import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryActivity, useQueryActivitySummary } from "@/modules/dashboard/hooks/useActivity";
import { useCsvExport } from "@/modules/dashboard/hooks/useCsvExport";
import { ActivityService } from "@/modules/dashboard/services/activity.service";
import {
  ENTITY_TYPES,
  EVENT_TYPE_GROUPS,
  getEntityLabel,
  getEntityLink,
  getEventMeta,
} from "@/modules/dashboard/utils/activity-events";
import { chartTheme, peakDay } from "@/modules/dashboard/utils/chart-data";
import { groupByDay, lastDaysRange } from "@/modules/dashboard/utils/relative-time";
import useColorMode from "@/shared/hooks/useColorMode";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { activityPeriodSchema } from "./activity.schema";
import { ACTIVITY_PAGE_SIZE, DEFAULT_ACTIVITY_DAYS } from "./activity.type";

export const useActivityModel = () => {
  const [colorMode] = useColorMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaults = useMemo(() => lastDaysRange(DEFAULT_ACTIVITY_DAYS), []);

  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;
  const type = searchParams.get("type") ?? "";
  const entityType = searchParams.get("entity") ?? "";
  const search = searchParams.get("search") ?? "";
  const from = searchParams.get("from") ?? defaults.from;
  const to = searchParams.get("to") ?? defaults.to;

  const updateParams = (changes: Record<string, string | undefined>) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        next.delete("page");
        return next;
      },
      { replace: true }
    );

  // ---- busca com debounce ----
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch.trim() === search) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch.trim()) next.set("search", debouncedSearch.trim());
        else next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, search, setSearchParams]);

  // ---- período: edita localmente, aplica na URL só quando válido ----
  const [periodDraft, setPeriodDraft] = useState({ from, to });
  const [prevPeriod, setPrevPeriod] = useState({ from, to });
  if (prevPeriod.from !== from || prevPeriod.to !== to) {
    setPrevPeriod({ from, to });
    setPeriodDraft({ from, to });
  }
  const periodCheck = activityPeriodSchema.safeParse(periodDraft);
  const periodError = periodCheck.success ? undefined : periodCheck.error.issues[0]?.message;

  /** Campo esvaziado volta ao padrão (últimos 30 dias). */
  const setPeriodField = (field: "from" | "to", value: string) => {
    const draft = { ...periodDraft, [field]: value || defaults[field] };
    setPeriodDraft(draft);
    if (activityPeriodSchema.safeParse(draft).success) {
      updateParams({
        from: draft.from !== defaults.from ? draft.from : undefined,
        to: draft.to !== defaults.to ? draft.to : undefined,
      });
    }
  };

  const setQuickPeriod = (days: number) => {
    const range = lastDaysRange(days);
    updateParams({
      from: range.from === defaults.from ? undefined : range.from,
      to: range.to === defaults.to ? undefined : range.to,
    });
  };

  const filters = { type, entityType, search, from: from || undefined, to: to || undefined };
  const list = useQueryActivity({ ...filters, page, size: ACTIVITY_PAGE_SIZE });
  const summary = useQueryActivitySummary(filters.from, filters.to);

  const csv = useCsvExport(() => ActivityService.exportCsv(filters), "eventos");

  const error = list.error ?? summary.error;
  const isUnavailable = getErrorStatus(list.error) === 503 || getErrorStatus(summary.error) === 503;

  const entries = (list.data?.content ?? []).map((entry) => {
    const meta = getEventMeta(entry.type);
    return {
      ...entry,
      meta,
      entityLabel: getEntityLabel(entry.entityType),
      link: getEntityLink(entry.entityType, entry.entityId, entry.type),
    };
  });

  const byType = (summary.data?.byType ?? []).map((item) => ({
    ...item,
    meta: getEventMeta(item.type),
  }));
  const byDay = summary.data?.byDay ?? [];

  const hasFilters = !!(type || entityType || search || searchParams.get("from") || searchParams.get("to"));

  const setPage = (nextPage: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage > 0) next.set("page", String(nextPage + 1));
      else next.delete("page");
      return next;
    });

  return {
    groups: groupByDay(entries, (e) => e.occurredAt),
    entriesCount: entries.length,
    page,
    setPage,
    pageSize: ACTIVITY_PAGE_SIZE,
    totalPages: list.data?.page.totalPages ?? 0,
    totalElements: list.data?.page.totalElements ?? 0,
    type,
    setType: (value: string) => updateParams({ type: value || undefined }),
    toggleType: (value: string) => updateParams({ type: value === type ? undefined : value }),
    typeGroups: EVENT_TYPE_GROUPS.map((group) => ({
      label: group.label,
      options: group.types.map((t) => ({ value: t, label: getEventMeta(t).label })),
    })),
    entityType,
    setEntityType: (value: string) => updateParams({ entity: value || undefined }),
    entityOptions: ENTITY_TYPES.map((value) => ({ value, label: getEntityLabel(value) })),
    searchInput,
    setSearchInput,
    search,
    periodDraft,
    periodError,
    setPeriodField,
    setQuickPeriod,
    hasFilters,
    clearFilters: () => {
      setSearchInput("");
      setSearchParams(new URLSearchParams(), { replace: true });
    },
    summaryTotal: summary.data?.total,
    byType,
    byDay,
    byDayPeak: peakDay(byDay),
    theme: chartTheme(colorMode),
    isLoading: list.isLoading,
    isFetching: list.isFetching,
    isSummaryLoading: summary.isLoading,
    isError: list.isError || summary.isError,
    isUnavailable,
    errorMessage: error ? getErrorMessage(error, "Não foi possível carregar a atividade.") : undefined,
    exportCsv: csv.exportCsv,
    isExporting: csv.isExporting,
    retry: () => {
      void list.refetch();
      void summary.refetch();
    },
  };
};
