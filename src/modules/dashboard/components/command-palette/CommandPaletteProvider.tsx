import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { useCommandPaletteModel } from "./command-palette.model";

type CommandPaletteContextValue = { isOpen: boolean; open: () => void; close: () => void; toggle: () => void };

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

/** Abre/fecha a busca rápida de qualquer lugar do painel (ex.: botão do header). */
// eslint-disable-next-line react-refresh/only-export-components
export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) throw new Error("useCommandPalette precisa estar dentro de <CommandPaletteProvider>");
  return context;
};

const PaletteHost = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const model = useCommandPaletteModel({ onClose });
  return isOpen ? <CommandPalette {...model} /> : null;
};

/** Registra o atalho global Ctrl+K / ⌘+K e renderiza a busca rápida. */
export const CommandPaletteProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);
  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen && <PaletteHost key="palette" isOpen={isOpen} onClose={close} />}
    </CommandPaletteContext.Provider>
  );
};
