import { act, renderHook } from "@testing-library/react";
import { useRowSelection } from "./useRowSelection";

describe("useRowSelection", () => {
  it("seleciona linhas, a página inteira e zera ao mudar de escopo", () => {
    const { result, rerender } = renderHook(({ ids, scope }) => useRowSelection(ids, scope), {
      initialProps: { ids: [1, 2, 3], scope: "page-1" },
    });
    act(() => result.current.toggle(2));
    expect(result.current.selectedIds).toEqual([2]);
    expect(result.current.someSelected).toBe(true);

    act(() => result.current.togglePage());
    expect(result.current.allSelected).toBe(true);
    act(() => result.current.togglePage());
    expect(result.current.selectedIds).toEqual([]);

    act(() => result.current.togglePage());
    // a linha 3 saiu da página (ex.: foi ocultada na aba "Visíveis")
    rerender({ ids: [1, 2], scope: "page-1" });
    expect(result.current.selectedIds).toEqual([1, 2]);
    expect(result.current.allSelected).toBe(true);

    rerender({ ids: [4, 5], scope: "page-2" });
    expect(result.current.selectedIds).toEqual([]);
  });
});
