export interface RoomState {
  phone: string;
  roomId: string | null;
  liveKitToken: string | null;
  identity: string;
  displayName: string;
  isAdmin: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderDisplayName: string;
  message: string;
  timestamp: number;
  isPrivate?: boolean;
  attachment?: { name: string; size: string };
}
