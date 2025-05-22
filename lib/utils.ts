import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Message } from "./types"

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return formatTime(dateString)
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return `${date.getDate()}-${getMonthAbbr(date.getMonth())}-${date.getFullYear().toString().slice(2)}`
  }
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function getMonthAbbr(month: number): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[month]
}

export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const grouped: Record<string, Message[]> = {}

  messages.forEach((message) => {
    const date = new Date(message.timestamp)
    const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }

    grouped[dateKey].push(message)
  })

  return grouped
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
