import { z } from "zod"

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  phone_number: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

// Chat schema
export const ChatSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: z.enum(["direct", "group"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  participants: z.array(UserSchema).optional(),
  last_message: z.string().optional(),
  unread_count: z.number().optional(),
  labels: z.array(z.string()).optional(),
})

export type Chat = z.infer<typeof ChatSchema>

// Message schema
export const MessageSchema = z.object({
  id: z.string().uuid(),
  chat_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string(),
  read: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  sender: UserSchema.optional(),
})

export type Message = z.infer<typeof MessageSchema>

// Chat participant schema
export const ChatParticipantSchema = z.object({
  id: z.string().uuid(),
  chat_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
  joined_at: z.string().datetime(),
  user: UserSchema.optional(),
})

export type ChatParticipant = z.infer<typeof ChatParticipantSchema>

// Chat with participants and last message
export const ChatWithDetailsSchema = ChatSchema.extend({
  participants: z.array(UserSchema).optional(),
  last_message: MessageSchema.optional(),
  unread_count: z.number().optional(),
  labels: z.array(z.string()).optional(),
})

export type ChatWithDetails = z.infer<typeof ChatWithDetailsSchema>
