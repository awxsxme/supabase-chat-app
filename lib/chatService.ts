import { supabase } from "./supabaseClient"

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Error fetching current user:", error)
    return null
  }

  return user
}

// Get messages for a chat
export async function getMessages(chatId: string) {
  try {
    console.log("Fetching messages for chat:", chatId)
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id, 
        content, 
        sender_id, 
        created_at,
        users(username, avatar_url)
      `)
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      throw error
    }

    console.log(`Retrieved ${data?.length || 0} messages for chat ${chatId}`)
    return data || []
  } catch (error) {
    console.error("Error in getMessages:", error)
    throw error
  }
}

// Send a message
export async function sendMessage(chatId: string, senderId: string, content: string) {
  try {
    console.log("Sending message:", { chatId, senderId, content })

    // First verify the sender exists in the users table
    const { data: userExists, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", senderId)
      .maybeSingle()

    if (userError) {
      console.error("Error checking if user exists:", userError)
      throw new Error("Error checking if user exists")
    }

    if (!userExists) {
      console.error(`User with ID ${senderId} does not exist in users table`)
      throw new Error(`User with ID ${senderId} does not exist. Cannot send message.`)
    }

    // Then verify the chat exists
    const { data: chatExists, error: chatError } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .maybeSingle()

    if (chatError) {
      console.error("Error checking if chat exists:", chatError)
      throw new Error("Error checking if chat exists")
    }

    if (!chatExists) {
      console.error(`Chat with ID ${chatId} does not exist in chats table`)
      throw new Error(`Chat with ID ${chatId} does not exist. Cannot send message.`)
    }

    // Now send the message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content,
        read: false,
      })
      .select()

    if (error) {
      console.error("Error sending message:", error)
      throw error
    }

    console.log("Message sent successfully:", data)

    // Update the chat's updated_at timestamp
    await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)

    return data[0]
  } catch (error) {
    console.error("Error in sendMessage:", error)
    throw error
  }
}

// Subscribe to new messages in a chat
export function subscribeToMessages(chatId: string, callback: (message: any) => void) {
  console.log("Setting up subscription for chat:", chatId)

  const channel = supabase
    .channel(`messages:chat-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        console.log("New message received via subscription:", payload.new)
        callback(payload.new)
      },
    )
    .subscribe((status) => {
      console.log(`Subscription status for chat ${chatId}:`, status)
    })

  return channel
}

// Get chat details
export async function getChatDetails(chatId: string) {
  try {
    console.log("Fetching chat details for:", chatId)

    // First check if the chat exists
    const { data: chatExists, error: chatExistsError } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .maybeSingle()

    if (chatExistsError) {
      console.error("Error checking if chat exists:", chatExistsError)
      throw new Error("Error checking if chat exists")
    }

    if (!chatExists) {
      console.error(`Chat with ID ${chatId} not found`)
      throw new Error(`Chat with ID ${chatId} not found. Please check if the chat exists.`)
    }

    // If chat exists, get full details
    const { data, error } = await supabase
      .from("chats")
      .select(`
        id,
        title,
        type,
        chat_participants(user_id, users(id, username, avatar_url))
      `)
      .eq("id", chatId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching chat details:", error)
      throw new Error(error.message)
    }

    if (!data) {
      throw new Error("Chat details not found")
    }

    // Handle case where chat_participants might be null or empty
    const participants = data.chat_participants ? data.chat_participants.map((p: any) => p.users).filter(Boolean) : []

    console.log("Chat details retrieved:", { ...data, participants })
    return {
      ...data,
      participants,
    }
  } catch (error) {
    console.error("Error in getChatDetails:", error)
    throw error
  }
}

// Create a demo chat if none exists
export async function createDemoChat() {
  try {
    console.log("Creating demo chat...")

    // Check if we have any users
    const { data: users, error: usersError } = await supabase.from("users").select("id, username").limit(2)

    if (usersError) {
      console.error("Error checking users:", usersError)
      throw new Error("Error checking users")
    }

    // If we don't have at least 2 users, create them
    if (!users || users.length < 2) {
      console.log("Creating demo users...")

      // Create demo users
      const { error: createUsersError } = await supabase.from("users").insert([
        {
          id: "00000000-0000-0000-0000-000000000001",
          username: "alice",
          avatar_url: "https://i.pravatar.cc/150?u=alice",
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          username: "bob",
          avatar_url: "https://i.pravatar.cc/150?u=bob",
        },
      ])

      if (createUsersError) {
        console.error("Error creating demo users:", createUsersError)
        throw new Error("Error creating demo users")
      }

      console.log("Demo users created successfully")
    }

    // Check if we have any chats
    const { data: chats, error: chatsError } = await supabase.from("chats").select("id").limit(1)

    if (chatsError) {
      console.error("Error checking chats:", chatsError)
      throw new Error("Error checking chats")
    }

    // If we don't have any chats, create a demo chat
    if (!chats || chats.length === 0) {
      console.log("Creating demo chat...")

      // Create demo chat
      const { data: chat, error: createChatError } = await supabase
        .from("chats")
        .insert({
          id: "00000000-0000-0000-0000-000000000010",
          title: "Alice & Bob",
        })
        .select()
        .single()

      if (createChatError) {
        console.error("Error creating demo chat:", createChatError)
        throw new Error("Error creating demo chat")
      }

      console.log("Demo chat created:", chat)

      // Add participants to the chat
      const { error: addParticipantsError } = await supabase.from("chat_participants").insert([
        {
          chat_id: "00000000-0000-0000-0000-000000000010",
          user_id: "00000000-0000-0000-0000-000000000001",
        },
        {
          chat_id: "00000000-0000-0000-0000-000000000010",
          user_id: "00000000-0000-0000-0000-000000000002",
        },
      ])

      if (addParticipantsError) {
        console.error("Error adding participants to demo chat:", addParticipantsError)
        throw new Error("Error adding participants to demo chat")
      }

      console.log("Participants added to demo chat")

      // Add a demo message
      const { error: addMessageError } = await supabase.from("messages").insert([
        {
          chat_id: "00000000-0000-0000-0000-000000000010",
          sender_id: "00000000-0000-0000-0000-000000000001",
          content: "Hey Bob, welcome to our chat!",
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (addMessageError) {
        console.error("Error adding demo message:", addMessageError)
        throw new Error("Error adding demo message")
      }

      console.log("Demo message added to chat")
      return chat
    }

    return chats[0]
  } catch (error) {
    console.error("Error in createDemoChat:", error)
    throw error
  }
}
