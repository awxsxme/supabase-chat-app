export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          title: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_labels: {
        Row: {
          id: string
          chat_id: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          label?: string
          created_at?: string
        }
      }
    }
  }
}
