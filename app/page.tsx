"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { createDemoChat } from "@/lib/chatService"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  // Use hardcoded IDs for demo purposes
  const defaultUserId = "00000000-0000-0000-0000-000000000001" // Alice

  const [currentUserId, setCurrentUserId] = useState<string | undefined>()
  const [activeChatId, setActiveChatId] = useState<string | undefined>()
  const [availableChats, setAvailableChats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for authenticated user or use default
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking user...")

        // First, ensure the demo users exist
        const { data: aliceExists, error: aliceError } = await supabase
          .from("users")
          .select("id")
          .eq("id", defaultUserId)
          .maybeSingle()

        if (aliceError) throw aliceError

        if (!aliceExists) {
          console.log("Creating default user (Alice)...")

          // Create Alice if she doesn't exist
          const { error: createAliceError } = await supabase.from("users").insert({
            id: defaultUserId,
            username: "alice",
            avatar_url: "https://i.pravatar.cc/150?u=alice",
          })

          if (createAliceError) throw createAliceError

          console.log("Default user (Alice) created successfully")
        }

        // Check for authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          console.log("Authenticated user found:", user.id)

          // Check if this user exists in our users table
          const { data: dbUser, error: dbUserError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle()

          if (dbUserError) throw dbUserError

          if (dbUser) {
            console.log("User exists in users table, using authenticated user ID")
            setCurrentUserId(user.id)
          } else {
            // User exists in auth but not in our users table
            console.log("User exists in auth but not in users table, creating user record")

            // Create user record
            const { error: createUserError } = await supabase.from("users").insert({
              id: user.id,
              username: user.email || "User",
              avatar_url: null,
            })

            if (createUserError) {
              console.error("Error creating user record:", createUserError)
              console.log("Using default user (Alice) instead")
              setCurrentUserId(defaultUserId)
            } else {
              setCurrentUserId(user.id)
            }
          }
        } else {
          // For demo purposes, use Alice's ID
          console.log("No authenticated user, using default user (Alice)")
          setCurrentUserId(defaultUserId)
        }
      } catch (error: any) {
        console.error("Error checking user:", error)
        setError("Error checking user. Please try again.")

        // Fallback to default user
        setCurrentUserId(defaultUserId)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  // Fetch available chats
  useEffect(() => {
    if (!currentUserId) return

    const fetchChats = async () => {
      try {
        console.log("Fetching available chats for user:", currentUserId)

        // First check if we have any chats at all
        const { data, error } = await supabase.from("chats").select("id")

        if (error) throw error

        if (data && data.length > 0) {
          console.log(
            "Found chats:",
            data.map((chat) => chat.id),
          )
          setAvailableChats(data.map((chat) => chat.id))
        } else {
          console.warn("No chats found in the database, creating a demo chat...")

          // Create a demo chat if none exists
          const demoChat = await createDemoChat()
          if (demoChat) {
            console.log("Demo chat created:", demoChat.id)
            setAvailableChats([demoChat.id])
          }
        }
      } catch (error: any) {
        console.error("Error fetching available chats:", error)
        setError(error.message || "Failed to load chats")
      }
    }

    fetchChats()
  }, [currentUserId])

  // Set default chat when chats are loaded
  useEffect(() => {
    if (!isLoading && availableChats.length > 0 && !activeChatId) {
      console.log("Setting default active chat:", availableChats[0])
      setActiveChatId(availableChats[0])
    }
  }, [isLoading, availableChats, activeChatId])

  const handleSelectChat = (chatId: string) => {
    console.log("Selecting chat:", chatId)
    setActiveChatId(chatId)
  }

  if (error) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-gray-500">Please check your database connection and try again</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen w-full overflow-hidden">
      <ChatInterface />
    </main>
  )
}
