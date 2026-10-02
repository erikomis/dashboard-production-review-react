import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { environment } from "@/environment/environment";
import { queryClient } from "@/shared/libs/react-query";
import { notificationToastStore } from "@/shared/libs/preferences";
import { NotificationEvent } from "@/shared/types/notification";

export interface DashboardNotification extends NotificationEvent {
  id: string;
  receivedAt: string;
}

const MAX_NOTIFICATIONS = 20;

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export type StreamStatus = "connecting" | "open" | "error";

/**
 * Assina `GET /notification/sse` (eventos padrão, sem nome → `onmessage`).
 * Payload: `{ action, message, nameUser }`. Fecha a conexão ao desmontar.
 */
export const useNotificationStream = () => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const [lastAnnouncement, setLastAnnouncement] = useState("");

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

      const notification: DashboardNotification = {
        id: newId(),
        action: payload.action ?? "",
        message: payload.message ?? "",
        nameUser: payload.nameUser ?? "",
        receivedAt: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS));
      setUnreadCount((count) => count + 1);
      const text = `${notification.nameUser || "Alguém"}: ${notification.message || notification.action}`;
      setLastAnnouncement(`Nova notificação. ${text}`);

      // Toda notificação hoje corresponde a uma nova avaliação
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

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
