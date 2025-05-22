"use client"

import type { Chat } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ChatPreviewProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
}

export default function ChatPreview({ chat, isActive, onClick }: ChatPreviewProps) {
  return (
    <div
      className={`flex cursor-pointer gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative h-12 w-12 flex-shrink-0">
        {chat.avatar ? (
          <img
            src={chat.avatar || "/placeholder.svg"}
            alt={chat.title}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
            {chat.title.charAt(0)}
          </div>
        )}
        {chat.unreadCount > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
            {chat.unreadCount}
          </div>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-medium">{chat.title}</h3>
          <span className="text-xs text-gray-500">{formatDate(chat.lastMessageTime)}</span>
        </div>

        <p className="mt-1 truncate text-sm text-gray-600">{chat.lastMessage}</p>

        {/* Phone number */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <span>{chat.phoneNumber}</span>
          {chat.participantCount && <span>+{chat.participantCount}</span>}
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
  )
}
