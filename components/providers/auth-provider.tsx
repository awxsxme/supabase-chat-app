"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  profile: any | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Sync user to public.users table
  const syncUserToDatabase = async (user: User) => {
    try {
      console.log("🧠 Raw Supabase user:", user)

      const userPayload = {
        id: user?.id,
        username: user?.email?.split("@")[0] || `user_${user?.id?.slice(0, 8) || "unknown"}`,
      }

      console.log("🔍 Minimal payload to upsert:", userPayload)

      const { error } = await supabase
        .from("users")
        .upsert(userPayload, { onConflict: "id" })

      if (error) {
        console.error("❌ Upsert error:", error.message, error.details)
        throw error
      }

      // Fetch user profile
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profile) {
        console.log("User profile fetched:", profile)
        setProfile(profile)
      }
    } catch (error) {
      console.error("Error syncing user to database:", error)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await syncUserToDatabase(session.user)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        await syncUserToDatabase(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return <AuthContext.Provider value={{ user, profile, isLoading, logout }}>{children}</AuthContext.Provider>
}
