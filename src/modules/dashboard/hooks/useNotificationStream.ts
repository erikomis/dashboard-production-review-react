import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { environment } from "@/environment/environment";
import { queryClient } from "@/shared/libs/react-query";
import { notificationToastStore } from "@/shared/libs/preferences";
import { NotificationEvent } from "@/shared/types/notification";

export interface DashboardNotification extends NotificationEvent {
  id: string;
  receivedAt: string;
  /** Quando o evento aconteceu (`occurredAt`) ou, em mensagens antigas, quando chegou. */
  at: string;
}

const MAX_NOTIFICATIONS = 20;

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export type StreamStatus = "connecting" | "open" | "error";

/**
 * Assina `GET /notification/sse` (eventos padrão, sem nome → `onmessage`).
 * Payload: `{ action, message, nameUser }` + (fase 2) `{ eventId, type, entityType, entityId, userId, occurredAt }`.
 * Fecha a conexão ao desmontar.
 */
export const useNotificationStream = () => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const [lastAnnouncement, setLastAnnouncement] = useState("");
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    const source = new EventSource(`${environment.apiUrl}/notification/sse`, {
      withCredentials: true,
    });

    source.onopen = () => setStatus("open");
    // O EventSource reconecta sozinho; só refletimos o estado.
    source.onerror = () => setStatus("error");

    source.onmessage = (event: MessageEvent<string>) => {
      let payload: Partial<NotificationEvent>;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return; // keep-alive ou mensagem malformada
      }
      if (!payload || (!payload.message && !payload.action)) return;

      const receivedAt = new Date().toISOString();
      const notification: DashboardNotification = {
        id: payload.eventId || newId(),
        action: payload.action ?? "",
        message: payload.message ?? "",
        nameUser: payload.nameUser ?? "",
        eventId: payload.eventId,
        type: payload.type,
        entityType: payload.entityType,
        entityId: payload.entityId ?? null,
        userId: payload.userId ?? null,
        occurredAt: payload.occurredAt,
        receivedAt,
        at: payload.occurredAt || receivedAt,
      };

      // o mesmo eventId pode chegar de novo após uma reconexão
      if (seenIds.current.has(notification.id)) return;
      seenIds.current.add(notification.id);

      setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS));
      setUnreadCount((count) => count + 1);
      const text = `${notification.nameUser || "Alguém"}: ${notification.message || notification.action}`;
      setLastAnnouncement(`Nova notificação. ${text}`);

      // Hoje o SSE só emite REVIEW_CREATED: atualiza avaliações, notas e estatísticas
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });

      if (notificationToastStore.get()) {
        toast.info(text, { toastId: notification.id });
      }
    };

    return () => {
      source.close();
    };
  }, []);

  const markAllRead = () => setUnreadCount(0);
  const clear = () => {
    setNotifications([]);
    setUnreadCount(0);
  };
  const remove = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return { notifications, unreadCount, status, lastAnnouncement, markAllRead, clear, remove };
};
