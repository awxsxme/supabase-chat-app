export interface Chat {
  id: string
  title: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  phoneNumber: string
  participantCount?: number
  labels?: string[]
  participants?: string[]
  onlineUsers?: {
    name: string
    avatar: string
  }[]
}

export interface Message {
  id: string
  chatId: string
  content: string
  sender: string
  senderName: string
  timestamp: string
}
