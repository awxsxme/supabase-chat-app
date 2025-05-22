"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"
import { getCurrentUser } from "@/lib/chatService"

type SupabaseContextType = {
  user: User | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  isLoading: true,
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return <SupabaseContext.Provider value={{ user, isLoading }}>{children}</SupabaseContext.Provider>
}
