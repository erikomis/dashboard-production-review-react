/**
 * Payload das mensagens SSE de `/notification/sse`.
 * `action`/`message`/`nameUser` existem desde a fase 1; os demais vieram na fase 2
 * e podem faltar em mensagens antigas.
 */
export interface NotificationEvent {
  action: string;
  message: string;
  nameUser: string;
  eventId?: string;
  type?: string;
  entityType?: string;
  entityId?: string | null;
  userId?: number | null;
  occurredAt?: string;
}
