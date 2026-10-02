import { useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Download,
  EyeOff,
  Flag,
  FolderTree,
  History,
  LayoutDashboard,
  LoaderCircle,
  MessageSquareText,
  Moon,
  Package,
  Plus,
  Search,
  Settings,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { cn } from "@/shared/utils/utils";
import { CommandIcon } from "./command-items";
import { useCommandPaletteModel } from "./command-palette.model";

const ICONS: Record<CommandIcon, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  home: LayoutDashboard,
  package: Package,
  tags: Tags,
  folder: FolderTree,
  download: Download,
  message: MessageSquareText,
  users: Users,
  history: History,
  settings: Settings,
  user: UserRound,
  plus: Plus,
  flag: Flag,
  "eye-off": EyeOff,
  moon: Moon,
  search: Search,
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-stroke bg-white px-1 font-satoshi text-[11px] font-medium text-black shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-bodydark1">
    {children}
  </kbd>
);

type CommandPaletteProps = ReturnType<typeof useCommandPaletteModel>;

/**
 * Busca rápida (Ctrl+K / ⌘+K): combobox ARIA com lista agrupada.
 * O foco fica no campo; as setas mudam o item ativo (`aria-activedescendant`), Enter abre e Esc fecha.
 */
export const CommandPalette = ({
  query,
  setQuery,
  groups,
  activeOptionId,
  flatIndexOf,
  setActiveIndex,
  onKeyDown,
  select,
  onClose,
  status,
  hasResults,
  canSearchProducts,
  isSearchingProducts,
  isProductsError,
  productsCount,
  minChars,
  shortcut,
  listboxId,
}: CommandPaletteProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true, onClose);

  return createPortal(
    <div
      className="fixed inset-0 z-999999 flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-[2px] animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Busca rápida"
        className="flex max-h-[min(36rem,76vh)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-stroke bg-white shadow-default animate-scale-in dark:border-strokedark dark:bg-boxdark"
      >
        <div className="flex items-center gap-3 border-b border-stroke px-4 dark:border-strokedark">
          {isSearchingProducts ? (
            <LoaderCircle size={20} aria-hidden="true" className="shrink-0 animate-spin text-primary dark:text-primary-light" />
          ) : (
            <Search size={20} aria-hidden="true" className="shrink-0 text-body dark:text-bodydark" />
          )}
          <input
            type="text"
            role="combobox"
            aria-label="Buscar telas, ações e produtos"
            aria-expanded={hasResults}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            aria-describedby={`${listboxId}-help`}
            autoComplete="off"
            spellCheck={false}
            data-autofocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar telas, ações ou produtos..."
            className="h-14 w-full bg-transparent text-base text-black outline-none placeholder:text-body/80 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-bodydark/70"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Fechar busca rápida"
          >
            <Kbd>Esc</Kbd>
          </button>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {hasResults ? (
            <div id={listboxId} role="listbox" aria-label="Resultados da busca rápida">
              {groups.map((group) => (
                <div key={group.id} role="group" aria-labelledby={`${listboxId}-${group.id}`} className="mb-2 last:mb-0">
                  <div
                    id={`${listboxId}-${group.id}`}
                    role="presentation"
                    className="flex items-center justify-between px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-body dark:text-bodydark"
                  >
                    {group.label}
                    {group.id === "products" && isSearchingProducts && (
                      <span className="font-normal normal-case tracking-normal">Buscando...</span>
                    )}
                  </div>
                  {group.items.map((item) => {
                    const Icon = ICONS[item.icon] ?? Search;
                    const isActive = item.optionId === activeOptionId;
                    return (
                      <div
                        key={item.id}
                        id={item.optionId}
                        role="option"
                        aria-selected={isActive}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseMove={() => !isActive && setActiveIndex(flatIndexOf(item))}
                        onClick={() => select(item)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm",
                          isActive ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-white" : "text-black dark:text-bodydark1"
                        )}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="h-8 w-8 shrink-0 rounded-md border border-stroke bg-white object-contain dark:border-strokedark" />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                              isActive ? "bg-primary text-white" : "bg-gray-2 text-body dark:bg-meta-4 dark:text-bodydark1"
                            )}
                          >
                            <Icon size={16} aria-hidden />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{item.label}</span>
                          {item.hint && (
                            <span className={cn("block truncate text-xs", isActive ? "text-primary/80 dark:text-bodydark1" : "text-body dark:text-bodydark")}>
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {isActive && <CornerDownLeft size={16} aria-hidden="true" className="shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div id={listboxId} role="listbox" aria-label="Resultados da busca rápida" className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-black dark:text-white">Nada encontrado para “{query.trim()}”</p>
              <p className="mt-1 text-xs text-body dark:text-bodydark">Tente outro nome de tela ou de produto.</p>
            </div>
          )}
          {!canSearchProducts && (
            <p className="px-2 pb-1 pt-2 text-xs text-body dark:text-bodydark">
              Digite {minChars} letras ou mais para buscar também produtos.
            </p>
          )}
          {isProductsError && (
            <p role="alert" className="px-2 pb-1 pt-2 text-xs text-danger dark:text-danger-light">
              Não foi possível buscar produtos agora.
            </p>
          )}
          {canSearchProducts && !isSearchingProducts && !isProductsError && productsCount === 0 && (
            <p className="px-2 pb-1 pt-2 text-xs text-body dark:text-bodydark">Nenhum produto com esse nome.</p>
          )}
        </div>

        <div
          id={`${listboxId}-help`}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-stroke bg-gray-2/70 px-4 py-2.5 text-xs text-body dark:border-strokedark dark:bg-meta-4/40 dark:text-bodydark"
        >
          <span className="inline-flex items-center gap-1.5">
            <Kbd>
              <ArrowUp size={12} aria-hidden="true" />
            </Kbd>
            <Kbd>
              <ArrowDown size={12} aria-hidden="true" />
            </Kbd>
            <span>
              <span className="sr-only">setas para </span>navegar
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>Enter</Kbd>
            <span>abrir</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            <span>fechar</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <Kbd>{shortcut}</Kbd>
            <span>abre de qualquer tela</span>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};
