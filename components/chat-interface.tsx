"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import {
  Smile,
  Paperclip,
  Send,
  BarChart2,
  FileText,
  FileEdit,
  Settings,
  Search,
  Filter,
  Save,
  Home,
  MessageSquare,
  Users,
} from "lucide-react"

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeChatId, setActiveChatId] = useState("1")

  // Simulate scrolling to bottom when component mounts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }, [])

  // Sample data for demonstration
  const chats = [
    {
      id: "1",
      title: "Alice & Bob",
      lastMessage: "Thanks! I'm using TailwindCSS for the styling.",
      lastMessageTime: "2025-05-22T10:35:00",
      unreadCount: 0,
      phoneNumber: "+1 234 567 8901",
      avatar: "https://i.pravatar.cc/150?u=alice",
      participants: ["Alice", "Bob"],
      labels: ["Demo"],
    },
    {
      id: "2",
      title: "Work Group",
      lastMessage: "Let's discuss this in our meeting tomorrow.",
      lastMessageTime: "2025-05-22T09:15:00",
      unreadCount: 3,
      phoneNumber: "+1 234 567 8902",
      participantCount: 5,
      labels: ["Work", "Important"],
    },
    {
      id: "3",
      title: "Family Group",
      lastMessage: "Don't forget Mom's birthday this weekend!",
      lastMessageTime: "2025-05-21T18:30:00",
      unreadCount: 0,
      phoneNumber: "+1 234 567 8903",
      participantCount: 6,
      labels: ["Family"],
    },
  ]

  const activeChat = chats.find((chat) => chat.id === activeChatId)

  const messages = [
    {
      id: "1",
      chatId: "1",
      sender: "other",
      senderName: "Alice",
      content: "Hey there! How's it going?",
      timestamp: "2025-05-22T10:30:00",
    },
    {
      id: "2",
      chatId: "1",
      sender: "me",
      senderName: "You",
      content: "I'm good, thanks! Just working on this chat interface.",
      timestamp: "2025-05-22T10:32:00",
    },
    {
      id: "3",
      chatId: "1",
      sender: "other",
      senderName: "Alice",
      content: "It looks great! I love the WhatsApp style.",
      timestamp: "2025-05-22T10:33:00",
    },
    {
      id: "4",
      chatId: "1",
      sender: "me",
      senderName: "You",
      content: "Thanks! I'm using TailwindCSS for the styling.",
      timestamp: "2025-05-22T10:35:00",
    },
    {
      id: "5",
      chatId: "1",
      sender: "other",
      senderName: "Bob",
      content: "Hey everyone! Can I join the conversation?",
      timestamp: "2025-05-23T09:15:00",
    },
    {
      id: "6",
      chatId: "1",
      sender: "me",
      senderName: "You",
      content: "Of course, Bob! We're just talking about this chat interface.",
      timestamp: "2025-05-23T09:16:00",
    },
    {
      id: "7",
      chatId: "1",
      sender: "other",
      senderName: "Alice",
      content: "Welcome, Bob! What do you think of it so far?",
      timestamp: "2025-05-23T09:17:00",
    },
    {
      id: "8",
      chatId: "1",
      sender: "other",
      senderName: "Bob",
      content: "It's looking really good! I especially like the message bubbles and the date dividers.",
      timestamp: "2025-05-23T09:18:00",
    },
    {
      id: "9",
      chatId: "1",
      sender: "me",
      senderName: "You",
      content: "Thanks! I'm also working on making sure new messages slide into view smoothly.",
      timestamp: "2025-05-23T09:20:00",
    },
  ]

  const activeMessages = messages.filter((message) => message.chatId === activeChatId)

  // Group messages by date
  const groupedMessages: Record<string, typeof messages> = {}
  activeMessages.forEach((message) => {
    const date = new Date(message.timestamp)
    const dateKey = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }

    groupedMessages[dateKey].push(message)
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message
    // For this demo, we just scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}`
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left Sidebar */}
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
              <span>Filter</span>
              <Save className="h-4 w-4 text-green-600" />
            </button>
          </div>
        </header>

        {/* Chat List */}
        <nav className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex cursor-pointer gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
                chat.id === activeChatId ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveChatId(chat.id)}
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
                          : label === "Work"
                            ? "bg-blue-100 text-blue-800"
                            : label === "Family"
                              ? "bg-green-100 text-green-800"
                              : label === "Important"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
              </div>
            </div>
          ))}
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

      {/* Chat Window */}
      <main className="flex flex-1 flex-col bg-[#e5ded8]">
        {/* Chat Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-[#f0f0f0] p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
              {activeChat?.avatar ? (
                <img
                  src={activeChat.avatar || "/placeholder.svg"}
                  alt={activeChat.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white">
                  {activeChat?.title.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-medium">{activeChat?.title}</h2>
              <p className="text-sm text-gray-600">{activeChat?.participants?.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Online Users Avatars */}
            <div className="flex -space-x-2">
              <div className="relative h-8 w-8">
                <img
                  src="https://i.pravatar.cc/150?u=alice"
                  alt="Alice"
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
              </div>
              <div className="relative h-8 w-8">
                <img
                  src="https://i.pravatar.cc/150?u=bob"
                  alt="Bob"
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <section className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">{date}</div>
              </div>

              <div className="space-y-1">
                {dateMessages.map((message) => {
                  const isOutgoing = message.sender === "me"

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOutgoing ? "justify-end" : "justify-start"} animate-slide-in`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                          isOutgoing ? "bg-[#dcf8c6] text-gray-800" : "bg-white text-gray-800"
                        }`}
                      >
                        {!isOutgoing && <div className="mb-1 font-medium text-[#5e5e5e]">{message.senderName}</div>}

                        <div className="break-words">{message.content}</div>

                        <div className="mt-1 flex justify-end text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </section>

        {/* Message Input */}
        <footer className="border-t border-gray-200 bg-[#f0f0f0] p-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-lg bg-white p-2">
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Smile className="h-6 w-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <Paperclip className="h-6 w-6" />
            </button>

            <input type="text" placeholder="Message..." className="flex-1 bg-transparent px-2 py-1 outline-none" />

            <button type="submit" className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </main>

      {/* Right Sidebar */}
      <aside className="w-16 border-l border-gray-200 bg-white">
        <nav className="flex w-full flex-col items-center py-6">
          <ul className="flex flex-col items-center gap-8">
            <li>
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <BarChart2 className="h-6 w-6" />
              </button>
            </li>
            <li>
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <FileText className="h-6 w-6" />
              </button>
            </li>
            <li>
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <FileEdit className="h-6 w-6" />
              </button>
            </li>
            <li>
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <Settings className="h-6 w-6" />
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  )
}
