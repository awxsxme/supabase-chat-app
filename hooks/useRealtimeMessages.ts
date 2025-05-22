"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

// This hook sets up a real-time subscription to new messages
export function useRealtimeMessages(chatId: string, onNewMessage: (msg: any) => void) {
  useEffect(() => {
    if (!chatId) return

    console.log(`Setting up real-time subscription for chat: ${chatId}`)

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("New message received:", payload.new)
          onNewMessage(payload.new)
        },
      )
      .subscribe((status) => {
        console.log(`Subscription status for chat ${chatId}:`, status)
      })

    return () => {
      console.log(`Cleaning up subscription for chat: ${chatId}`)
      supabase.removeChannel(channel)
    }
  }, [chatId, onNewMessage])
}
