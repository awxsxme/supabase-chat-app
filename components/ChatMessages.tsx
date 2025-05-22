"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { getMessages } from "@/lib/chatService"
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages"
import { useAuth } from "@/components/providers/auth-provider"
import { supabase } from "@/lib/supabaseClient"

interface ChatMessagesProps {
  chatId: string
  isLoading: boolean
}

export default function ChatMessages({ chatId, isLoading: headerLoading }: ChatMessagesProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return

      setIsLoading(true)
      setError(null)
      try {
        console.log("Fetching messages for chat:", chatId)
        const data = await getMessages(chatId)
        setMessages(data)

        // Initial scroll should be instant
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        }, 100)
      } catch (error: any) {
        console.error("Error fetching messages:", error)
        setError(error.message || "Failed to load messages")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [chatId])

  // Set up real-time listener for new messages
  useRealtimeMessages(chatId, async (newMessage) => {
    // Fetch user data for the new message
    const { data: userData } = await supabase
      .from("users")
      .select("username, avatar_url")
      .eq("id", newMessage.sender_id)
      .single()

    // Add user data to the message
    const messageWithUser = {
      ...newMessage,
      users: userData || { username: "Unknown", avatar_url: null },
    }

    // Add to messages state (avoid duplicates)
    setMessages((prev) => {
      // Check if message already exists
      const exists = prev.some((msg) => msg.id === newMessage.id)
      if (exists) return prev
      return [...prev, messageWithUser]
    })
  })

  if (isLoading || headerLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`mb-4 flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[70%] animate-pulse rounded-lg p-3 ${i % 2 === 0 ? "bg-white" : "bg-green-100"}`}>
              {i % 2 === 0 && <div className="mb-1 h-4 w-20 rounded bg-gray-200"></div>}
              <div className="h-4 w-40 rounded bg-gray-200"></div>
              <div className="mt-1 h-3 w-16 rounded bg-gray-200 self-end"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8] flex items-center justify-center">
        <div className="text-gray-500">No messages yet. Start the conversation!</div>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages: Record<string, any[]> = {}
  messages.forEach((message) => {
    const date = format(new Date(message.created_at), "dd-MM-yyyy")
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">{date}</div>
          </div>

          <div className="space-y-1">
            {dateMessages.map((message) => {
              const isOutgoing = message.sender_id === user?.id
              const senderName = message.users?.username || "User"

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
        </div>
      ))}
      <div ref={messagesEndRef} />
    </main>
  )
}
