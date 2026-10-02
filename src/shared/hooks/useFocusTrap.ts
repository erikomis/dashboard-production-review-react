import { RefObject, useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Pilha de armadilhas ativas: só a do topo (o diálogo aberto por último) reage ao teclado. */
const trapStack: symbol[] = [];

/**
 * Prende o foco (Tab / Shift+Tab) dentro de `ref` enquanto `active`,
 * fecha com Esc e devolve o foco ao elemento que abriu.
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void
) => {
  // Guarda o callback num ref para não reexecutar o efeito (e roubar o foco)
  // a cada render quando o chamador passa uma função inline.
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const token = Symbol("focus-trap");
    trapStack.push(token);
    const isTop = () => trapStack[trapStack.length - 1] === token;
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    const initial =
      container.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? container;
    initial.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Diálogo empilhado (ex.: confirmação aberta de dentro de um painel): só o de cima responde
      if (!isTop()) return;
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscapeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const index = trapStack.indexOf(token);
      if (index >= 0) trapStack.splice(index, 1);
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
};
