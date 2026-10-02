import { useState } from "react";

/**
 * Seleção de linhas de uma página da tabela.
 * A seleção vale para um "escopo" (filtros + página): ao mudar o escopo ela zera sozinha,
 * e ids que saíram da página (ex.: ocultadas na aba "Visíveis") deixam de contar.
 */
export const useRowSelection = (rowIds: number[], scopeKey: string) => {
  const [state, setState] = useState<{ key: string; ids: number[] }>({ key: scopeKey, ids: [] });
  const scoped = state.key === scopeKey ? state.ids : [];
  const selectedIds = scoped.filter((id) => rowIds.includes(id));

  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  return {
    selectedIds,
    isSelected: (id: number) => selectedIds.includes(id),
    toggle: (id: number) =>
      setState({
        key: scopeKey,
        ids: selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
      }),
    togglePage: () => setState({ key: scopeKey, ids: allSelected ? [] : [...rowIds] }),
    clear: () => setState({ key: scopeKey, ids: [] }),
    allSelected,
    someSelected,
  };
};
