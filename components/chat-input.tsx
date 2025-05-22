"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Smile, Paperclip, Send } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRealtimeMessages } from "@/hooks/use-realtime-messages"

interface ChatInputProps {
  chatId: string
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const { sendMessage } = useRealtimeMessages(chatId, user?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isSending || !user) return

    const messageContent = message.trim()
    setMessage("") // Clear input immediately for better UX
    setIsSending(true)
    setError(null)

    try {
      const { success, error } = await sendMessage(messageContent)

      if (!success && error) {
        throw new Error(error)
      }

      // Focus the input field again
      inputRef.current?.focus()
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message || "Failed to send message. Please try again.")
      // Restore the message if sending failed
      setMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-[#f0f0f0] p-3">
      {error && <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-lg bg-white p-2">
        <button type="button" className="text-gray-500 hover:text-gray-700">
          <Smile className="h-6 w-6" />
        </button>
        <button type="button" className="text-gray-500 hover:text-gray-700">
          <Paperclip className="h-6 w-6" />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          className="flex-1 bg-transparent px-2 py-1 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <button
          type="submit"
          className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600 disabled:opacity-50"
          disabled={!message.trim() || isSending || !user}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </footer>
  )
}
