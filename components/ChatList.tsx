"use client"

import type { ChatWithDetails } from "@/types"
import { formatDistanceToNow } from "date-fns"

interface ChatListProps {
  chats: ChatWithDetails[]
  isLoading: boolean
  activeChatId?: string
  onSelectChat: (chatId: string) => void
}

export default function ChatList({ chats, isLoading, activeChatId, onSelectChat }: ChatListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-3 flex animate-pulse gap-3 p-2">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">No chats found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex cursor-pointer gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
            chat.id === activeChatId ? "bg-gray-100" : ""
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          {/* Avatar */}
          <div className="relative h-12 w-12 flex-shrink-0">
            {chat.participants && chat.participants[0]?.avatar_url ? (
              <img
                src={chat.participants[0].avatar_url || "/placeholder.svg"}
                alt={chat.title}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                {chat.title.charAt(0)}
              </div>
            )}
            {chat.unread_count > 0 && (
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                {chat.unread_count}
              </div>
            )}
          </div>

          {/* Chat Info */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="truncate font-medium">{chat.title}</h3>
              <span className="text-xs text-gray-500">
                {chat.updated_at ? formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true }) : ""}
              </span>
            </div>

            <p className="mt-1 truncate text-sm text-gray-600">{chat.last_message}</p>

            {/* Phone number */}
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              {chat.participants && chat.participants[0]?.phone_number && (
                <span>{chat.participants[0].phone_number}</span>
              )}
              {chat.participants && chat.participants.length > 1 && <span>+{chat.participants.length - 1}</span>}
            </div>
          </div>

          {/* Labels */}
          <div className="flex flex-col items-end gap-1 self-center">
            {chat.labels &&
              chat.labels.map((label, index) => (
                <span
                  key={index}
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    label === "Demo"
                      ? "bg-orange-100 text-orange-800"
                      : label === "Signup"
                        ? "bg-blue-100 text-blue-800"
                        : label === "Internal"
                          ? "bg-green-100 text-green-800"
                          : label === "Content"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {label}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
