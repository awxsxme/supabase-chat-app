"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Save, Home, MessageSquare, Users, Settings } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"

interface SidebarProps {
  onSelectChat: (chatId: string) => void
  activeChatId?: string
}

export default function Sidebar({ onSelectChat, activeChatId }: SidebarProps) {
  const [chats, setChats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from("chats")
          .select(`
            id,
            title,
            updated_at,
            chat_labels(label),
            chat_participants(user_id, users(username, avatar_url)),
            messages(content, created_at)
          `)
          .order("updated_at", { ascending: false })

        if (error) throw error

        // Process the data to get the last message and format it
        const processedChats =
          data?.map((chat) => {
            const lastMessage =
              chat.messages.length > 0
                ? chat.messages.sort(
                    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                  )[0].content
                : "No messages yet"

            return {
              ...chat,
              last_message: lastMessage,
            }
          }) || []

        setChats(processedChats)
      } catch (error) {
        console.error("Error fetching chats:", error)
        setError("Failed to load chats")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()

    // Subscribe to chat updates
    const subscription = supabase
      .channel("public:chats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        () => {
          fetchChats()
        },
      )
      .subscribe()

    // Subscribe to message updates to refresh chat list
    const messageSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchChats()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      messageSubscription.unsubscribe()
    }
  }, [])

  return (
    <aside className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
      {/* Search and Filter Section */}
      <header className="border-b border-gray-200 p-3">
        <div className="flex items-center gap-2 pb-3">
          <div className="flex flex-1 items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5">
            <Search className="mr-2 h-4 w-4 text-gray-500" />
            <input type="text" placeholder="Search" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium">
            <Filter className="h-4 w-4" />
            <span>Custom filter</span>
            <Save className="h-4 w-4 text-green-600" />
          </button>
        </div>
      </header>

      {/* Chat List */}
      <nav className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-3 border-b border-gray-100 p-3">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No chats found</p>
          </div>
        ) : (
          // Actual chat list
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex cursor-pointer gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
                chat.id === activeChatId ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              {/* Avatar */}
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-white overflow-hidden">
                {chat.chat_participants && chat.chat_participants[0]?.users?.avatar_url ? (
                  <img
                    src={chat.chat_participants[0].users.avatar_url || "/placeholder.svg"}
                    alt={chat.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  chat.title.charAt(0)
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-medium">{chat.title}</h3>
                  <span className="text-xs text-gray-500">{format(new Date(chat.updated_at), "dd-MMM-yy")}</span>
                </div>

                <p className="mt-1 truncate text-sm text-gray-600">{chat.last_message}</p>

                {/* Participants */}
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  {chat.chat_participants && chat.chat_participants.map((p: any) => p.users.username).join(", ")}
                </div>
              </div>

              {/* Labels */}
              <div className="flex flex-col items-end gap-1 self-center">
                {chat.chat_labels &&
                  chat.chat_labels.map((labelObj: any, index: number) => (
                    <span
                      key={index}
                      className={`rounded px-1.5 py-0.5 text-xs ${
                        labelObj.label === "Demo"
                          ? "bg-orange-100 text-orange-800"
                          : labelObj.label === "Signup"
                            ? "bg-blue-100 text-blue-800"
                            : labelObj.label === "Internal"
                              ? "bg-green-100 text-green-800"
                              : labelObj.label === "Content"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {labelObj.label}
                    </span>
                  ))}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* Navigation Footer */}
      <footer className="border-t border-gray-200 px-2 py-3">
        <ul className="flex flex-col items-center gap-6">
          <li>
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
              <Home className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button className="rounded-full p-1 text-green-600 hover:bg-gray-100">
              <MessageSquare className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
              <Users className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
              <Settings className="h-6 w-6" />
            </button>
          </li>
        </ul>
      </footer>
    </aside>
  )
}
