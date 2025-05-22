"use client"

import { useEffect, useState } from "react"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-messages"
import ChatInput from "./chat-input"
import { getChatDetails } from "@/lib/chatService"

interface ChatWindowProps {
  chatId?: string
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [chatDetails, setChatDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chatId) return

    const fetchChatDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const details = await getChatDetails(chatId)
        setChatDetails(details)
      } catch (error: any) {
        console.error("Error fetching chat details:", error)
        setError(error.message || "Could not load chat details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatDetails()
  }, [chatId])

  if (!chatId) {
    return (
      <main className="flex flex-1 flex-col bg-gray-50">
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col bg-gray-50">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-gray-500">Try selecting a different chat or check if the chat exists</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <section className="flex flex-1 flex-col">
      {chatDetails && <ChatHeader chatDetails={chatDetails} />}
      <ChatMessages chatId={chatId} isLoading={isLoading} />
      <ChatInput chatId={chatId} />
    </section>
  )
}
