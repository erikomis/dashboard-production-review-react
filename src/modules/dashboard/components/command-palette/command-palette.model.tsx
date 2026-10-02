import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUGGEST_MIN_CHARS, useQueryProductSuggest } from "@/modules/dashboard/hooks/useProductSuggest";
import useColorMode from "@/shared/hooks/useColorMode";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { ACTION_COMMANDS, CommandItem, filterCommands, PAGE_COMMANDS, shortcutLabel } from "./command-items";

export type PaletteItem = CommandItem & { imageUrl?: string | null; optionId: string };
export type PaletteGroup = { id: string; label: string; items: PaletteItem[] };

const DEBOUNCE_MS = 250;

/** View-model da busca rápida: texto, grupos, item ativo, teclado e seleção. */
export const useCommandPaletteModel = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const baseId = useId();
  const [colorMode, setColorMode] = useColorMode();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, DEBOUNCE_MS);
  const trimmed = query.trim();
  const canSearchProducts = trimmed.length >= SUGGEST_MIN_CHARS;
  // só consulta com o texto já "assentado" (debounce) e com 2+ caracteres
  const suggest = useQueryProductSuggest(canSearchProducts ? debounced : "", 6);
  const isSearchingProducts = canSearchProducts && (debounced.trim() !== trimmed || suggest.isFetching);

  const optionId = (id: string) => `${baseId}-opt-${id}`;

  const groups = useMemo<PaletteGroup[]>(() => {
    const withId = (items: CommandItem[]): PaletteItem[] => items.map((item) => ({ ...item, optionId: optionId(item.id) }));
    const result: PaletteGroup[] = [];
    const pages = withId(filterCommands(PAGE_COMMANDS, query));
    const actions = withId(filterCommands(ACTION_COMMANDS, query));
    if (pages.length) result.push({ id: "pages", label: "Ir para", items: pages });
    if (actions.length) result.push({ id: "actions", label: "Ações", items: actions });
    if (canSearchProducts) {
      const products: PaletteItem[] = (suggest.data ?? []).map((product) => ({
        id: `product-${product.id}`,
        optionId: optionId(`product-${product.id}`),
        label: product.name,
        hint: product.categoryName ?? undefined,
        icon: "package",
        to: `/dashboard/products/${product.id}`,
        imageUrl: product.imageUrl,
      }));
      products.push({
        id: "search-all",
        optionId: optionId("search-all"),
        label: `Ver todos os produtos com “${trimmed}”`,
        icon: "search",
        to: `/dashboard/products?search=${encodeURIComponent(trimmed)}`,
      });
      result.push({ id: "products", label: "Produtos", items: products });
    }
    return result;
    // optionId depende só de baseId (estável)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, trimmed, canSearchProducts, suggest.data, baseId]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  // Item ativo volta para o primeiro sempre que o texto muda (estado anterior em render)
  const [active, setActive] = useState({ query, index: 0 });
  const activeIndex = active.query === query ? Math.min(active.index, Math.max(flat.length - 1, 0)) : 0;
  const activeItem = flat[activeIndex];
  const setActiveIndex = (index: number) => setActive({ query, index });

  // Mantém o item ativo visível ao navegar com as setas
  const activeOptionId = activeItem?.optionId;
  useEffect(() => {
    if (!activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView?.({ block: "nearest" });
  }, [activeOptionId]);

  const select = (item: PaletteItem | undefined) => {
    if (!item) return;
    if (item.action === "toggle-theme") setColorMode(colorMode === "dark" ? "light" : "dark");
    else if (item.to) navigate(item.to);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (flat.length === 0) return;
    const last = flat.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex(activeIndex >= last ? 0 : activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(activeIndex <= 0 ? last : activeIndex - 1);
        break;
      case "Home":
        if (event.ctrlKey) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (event.ctrlKey) {
          event.preventDefault();
          setActiveIndex(last);
        }
        break;
      case "PageDown":
        event.preventDefault();
        setActiveIndex(Math.min(activeIndex + 5, last));
        break;
      case "PageUp":
        event.preventDefault();
        setActiveIndex(Math.max(activeIndex - 5, 0));
        break;
      case "Enter":
        event.preventDefault();
        select(activeItem);
        break;
    }
  };

  const productsCount = suggest.data?.length ?? 0;
  const status = isSearchingProducts
    ? "Buscando produtos..."
    : flat.length === 0
      ? `Nada encontrado para “${trimmed}”.`
      : `${flat.length} ${flat.length === 1 ? "resultado" : "resultados"}${canSearchProducts ? `, ${productsCount} ${productsCount === 1 ? "produto" : "produtos"}` : ""}.`;

  return {
    query,
    setQuery,
    groups,
    activeOptionId,
    activeIndex,
    flatIndexOf: (item: PaletteItem) => flat.indexOf(item),
    setActiveIndex,
    onKeyDown,
    select,
    onClose,
    status,
    hasResults: flat.length > 0,
    canSearchProducts,
    isSearchingProducts,
    isProductsError: canSearchProducts && suggest.isError,
    productsCount,
    minChars: SUGGEST_MIN_CHARS,
    shortcut: shortcutLabel(),
    listboxId: `${baseId}-listbox`,
  };
};
