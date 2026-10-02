/** Payload das mensagens SSE de `/notification/sse`. */
export interface NotificationEvent {
  action: string;
  message: string;
  nameUser: string;
}
