import { Bell, BellRing, MessageSquareText, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotificationStream } from "@/modules/dashboard/hooks/useNotificationStream";
import { formatDateTime } from "@/shared/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";

/**
 * Notificações em tempo real via SSE (`/notification/sse`).
 * Radix cuida de teclado/foco; a região `aria-live` anuncia novas mensagens.
 */
const DropdownNotification = () => {
  const { notifications, unreadCount, status, lastAnnouncement, markAllRead, clear, remove } =
    useNotificationStream();

  return (
    <li>
      <span className="sr-only" role="status" aria-live="polite">
        {lastAnnouncement}
      </span>
      <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
        <DropdownMenuTrigger
          aria-label={
            unreadCount > 0 ? `Notificações, ${unreadCount} não lidas` : "Notificações"
          }
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-gray text-black hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {unreadCount > 0 ? <BellRing size={18} aria-hidden="true" /> : <Bell size={18} aria-hidden="true" />}
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-semibold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[min(22rem,calc(100vw-2rem))] p-0">
          <div className="flex items-center justify-between border-b border-stroke px-4 py-3 dark:border-strokedark">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">Notificações</p>
              <p className="flex items-center gap-1.5 text-xs text-body dark:text-bodydark">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    status === "open" ? "bg-success" : status === "error" ? "bg-danger" : "bg-warning"
                  }`}
                />
                {status === "open"
                  ? "Conectado em tempo real"
                  : status === "error"
                    ? "Reconectando..."
                    : "Conectando..."}
              </p>
            </div>
            {notifications.length > 0 && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  clear();
                }}
                className="px-2 py-1 text-xs"
              >
                Limpar tudo
              </DropdownMenuItem>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <Bell size={28} aria-hidden="true" className="mb-3 text-body dark:text-bodydark" />
              <p className="text-sm font-medium text-black dark:text-white">Sem notificações</p>
              <p className="mt-1 text-xs text-body dark:text-bodydark">
                Novas avaliações aparecem aqui assim que forem criadas.
              </p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1">
              {notifications.map((n) => (
                <li key={n.id} className="group relative">
                  <DropdownMenuItem asChild className="items-start pr-10">
                    <Link to="/dashboard/review">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                      >
                        <MessageSquareText size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-black dark:text-white">
                          {n.nameUser || "Usuário"}
                        </span>
                        <span className="block text-xs text-body dark:text-bodydark">{n.message}</span>
                        {n.action && (
                          <span className="mt-0.5 block truncate text-xs text-body dark:text-bodydark">
                            {n.action}
                          </span>
                        )}
                        <span className="mt-1 block text-[11px] text-body dark:text-bodydark">
                          {formatDateTime(n.receivedAt)}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <button
                    type="button"
                    onClick={() => remove(n.id)}
                    aria-label={`Dispensar notificação de ${n.nameUser || "usuário"}`}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded text-body hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-bodydark"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

export default DropdownNotification;
