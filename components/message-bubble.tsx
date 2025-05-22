import type { Message } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.sender === "me"

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOutgoing ? "bg-green-100 text-green-900" : "bg-white text-gray-900 shadow-sm"
        }`}
      >
        {!isOutgoing && <div className="mb-1 font-medium text-gray-700">{message.senderName}</div>}

        <div className="break-words">{message.content}</div>

        <div className="mt-1 flex justify-end text-xs text-gray-500">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  )
}
