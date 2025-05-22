"use client"

import { BarChart2, FileText, FileEdit, Settings } from "lucide-react"
import LogoutButton from "./logout-button"

export default function RightSidebar() {
  return (
    <aside className="w-16 border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Main navigation icons */}
      <nav className="flex-1 flex flex-col items-center py-6">
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

      {/* Logout button at the bottom */}
      <div className="flex justify-center pb-6">
        <LogoutButton />
      </div>
    </aside>
  )
}
