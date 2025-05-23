"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.replace("/")
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const verifySessionAndRedirect = async () => {
      for (let i = 0; i < 10; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("✅ Session confirmed, redirecting");
          window.location.href = "/";
          return;
        }
        await new Promise((res) => setTimeout(res, 200)); // wait 200ms
      }
      console.error("❌ Session cookie did not propagate in time");
    };


    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split("@")[0],
            },
          },
        })

        if (error) throw error

        if (data.user) {
          if (data.user.identities?.length === 0) {
            setError("An account with this email already exists")
          } else {
            // Sync user to database
            const {
              data: { user },
            } = await supabase.auth.getUser()

            if (user) {
              console.log("🧠 Raw Supabase user:", user)

              const userPayload = {
                id: user?.id,
                username: username || user?.email?.split("@")[0] || `user_${user?.id?.slice(0, 8) || "unknown"}`,
              }

              console.log("🔍 Minimal payload to upsert:", userPayload)

              const { error } = await supabase
                .from("users")
                .upsert(userPayload, { onConflict: "id" })

              if (error) {
                console.error("❌ Upsert error:", error.message, error.details)
                throw error
              }
            }

            if (data.session) {
              setSuccess("Account created successfully! Redirecting...")
              verifySessionAndRedirect();
            } else {
              setSuccess("Please check your email to confirm your account")
            }
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          // Sync user to database
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
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
          }

          setSuccess("Login successful! Redirecting...");
          
          verifySessionAndRedirect();
          
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">WhatsApp Chat</h1>
          <p className="mt-2 text-gray-600">{isSignUp ? "Create your account" : "Sign in to continue"}</p>
        </header>

        <section className="rounded-lg bg-white p-6 shadow-md">
          {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

          {success && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{success}</div>}

          {isLoading && <p className="text-center text-sm text-gray-500 mb-4">Processing login...</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="your.email@example.com"
              />
            </div>

            {isSignUp && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username (optional)
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                  placeholder="yourname"
                />
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder={isSignUp ? "Min. 6 characters" : "Your password"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-green-500 px-4 py-2 text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-green-600 hover:text-green-800"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
