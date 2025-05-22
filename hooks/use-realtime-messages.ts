"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
  users?: {
    username: string
    avatar_url: string | null
  }
}

export function useRealtimeMessages(chatId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const isInitialLoad = useRef(true)

  // Set messages end ref
  const setMessagesEndRef = (ref: HTMLDivElement | null) => {
    messagesEndRef.current = ref
  }

  // Scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return

      setIsLoading(true)
      setError(null)

      try {
        console.log("Fetching messages for chat:", chatId)
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id, 
            chat_id, 
            sender_id, 
            content, 
            created_at,
            users(username, avatar_url)
          `)
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true })

        if (error) throw error

        console.log(`Retrieved ${data?.length || 0} messages`)
        setMessages(data || [])
        isInitialLoad.current = true
      } catch (error: any) {
        console.error("Error fetching messages:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [chatId])

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && isInitialLoad.current) {
      scrollToBottom("auto")
      isInitialLoad.current = false
    }
  }, [isLoading, messages])

  // Subscribe to new messages
  useEffect(() => {
    if (!chatId) return

    console.log("Setting up real-time subscription for chat:", chatId)

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          console.log("New message received:", payload.new)

          const newMessage = payload.new as Message

          // Fetch user data for the new message
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("username, avatar_url")
            .eq("id", newMessage.sender_id)
            .single()

          if (userError) {
            console.error("Error fetching user data for message:", userError)
          }

          const messageWithUser = {
            ...newMessage,
            users: userData || { username: "Unknown", avatar_url: null },
          }

          // Add message to state if it doesn't already exist
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some((msg) => msg.id === newMessage.id)
            if (exists) return prev

            return [...prev, messageWithUser]
          })

          // Scroll to bottom when new message arrives
          scrollToBottom()
        },
      )
      .subscribe((status) => {
        console.log(`Subscription status for chat ${chatId}:`, status)
      })

    return () => {
      console.log("Cleaning up subscription for chat:", chatId)
      supabase.removeChannel(channel)
    }
  }, [chatId])

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!chatId || !currentUserId || !content.trim()) {
      return { success: false, error: "Missing required data" }
    }

    try {
      console.log("Sending message:", { chatId, senderId: currentUserId, content })

      const { data, error } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          sender_id: currentUserId,
          content: content.trim(),
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      console.log("Message sent successfully:", data)
      return { success: true, data }
    } catch (error: any) {
      console.error("Error sending message:", error)
      return { success: false, error: error.message }
    }
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setMessagesEndRef,
    scrollToBottom,
  }
}
