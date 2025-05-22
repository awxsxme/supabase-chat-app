"use client"

import { FiLogOut } from "react-icons/fi"
import { useAuth } from "@/components/providers/auth-provider"

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      onClick={logout}
      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
      aria-label="Logout"
      title="Logout"
    >
      <FiLogOut className="h-6 w-6" />
    </button>
  )
}
