export const CHAT_OPEN_EVENT = "ruangrasa:open-chat";

export function openChatWidget() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT));
}
