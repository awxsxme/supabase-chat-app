"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { useAuth } from "@/components/providers/auth-provider"
import { useRealtimeMessages } from "@/hooks/use-realtime-messages"

interface ChatMessagesProps {
  chatId: string
  isLoading?: boolean
}

export default function ChatMessages({ chatId, isLoading: headerLoading = false }: ChatMessagesProps) {
  const { user } = useAuth()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  const { messages, isLoading, error, scrollToBottom, addMessageToState } = useRealtimeMessages(chatId, user?.id, messagesEndRef)

  // Set the messages end ref for the hook to use
  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  if (isLoading || headerLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`mb-4 flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[70%] animate-pulse rounded-lg p-3 ${i % 2 === 0 ? "bg-white" : "bg-[#dcf8c6]"}`}>
              {i % 2 === 0 && <div className="mb-1 h-4 w-20 rounded bg-gray-200"></div>}
              <div className="h-4 w-40 rounded bg-gray-200"></div>
              <div className="mt-1 h-3 w-16 rounded bg-gray-200 self-end"></div>
            </div>
          </div>
        ))}
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-4 bg-[#e5ded8] flex items-center justify-center">
        <div className="text-red-500">Error loading messages: {error}</div>
      </main>
    )
  }

  if (messages.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto p-4 bg-[#e5ded8] flex items-center justify-center">
        <div className="text-gray-500">No messages yet. Start the conversation!</div>
      </main>
    )
  }

  // Group messages by date
  const groupedMessages: Record<string, typeof messages> = {}
  messages.forEach((message) => {
    const date = format(new Date(message.created_at), "dd-MM-yyyy")
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <main ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <section key={date} className="mb-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">{date}</div>
          </div>

          <div className="space-y-1">
            {dateMessages.map((message) => {
              const isOutgoing = message.sender_id === user?.id
              const senderName = message.users?.username || "Unknown"

              return (
                <div key={message.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                      isOutgoing ? "bg-[#dcf8c6] text-gray-800" : "bg-white text-gray-800"
                    }`}
                  >
                    {!isOutgoing && <div className="mb-1 font-medium text-[#5e5e5e]">{senderName}</div>}

                    <div className="break-words">{message.content}</div>

                    <div className="mt-1 flex justify-end text-xs text-gray-500">
                      {format(new Date(message.created_at), "HH:mm")}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
      <div ref={messagesEndRef} className="h-1" />
    </main>
  )
}
