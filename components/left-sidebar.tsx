"use client"

import { Search, Filter, Save, Home, MessageSquare, Users, Settings } from "lucide-react"
import type { Chat } from "@/lib/types"
import ChatPreview from "./chat-preview"

interface LeftSidebarProps {
  chats: Chat[]
  activeChatId: string
  onSelectChat: (id: string) => void
}

export default function LeftSidebar({ chats, activeChatId, onSelectChat }: LeftSidebarProps) {
  return (
    <aside className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
      {/* Search and Filter Section */}
      <div className="border-b border-gray-200 p-3">
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
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatPreview
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>

      {/* Navigation Footer */}
      <nav className="border-t border-gray-200 px-2 py-3">
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
      </nav>
    </aside>
  )
}
