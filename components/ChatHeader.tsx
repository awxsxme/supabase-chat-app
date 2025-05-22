import { RefreshCw, HelpCircle, Search } from "lucide-react"

interface ChatHeaderProps {
  chatDetails: any
}

export default function ChatHeader({ chatDetails }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-[#f0f0f0] p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-medium">{chatDetails.title}</h2>
          <p className="text-sm text-gray-600">{chatDetails.participants?.map((p: any) => p.username).join(", ")}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          <RefreshCw className="h-5 w-5" />
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <Search className="h-5 w-5" />
        </button>

        {/* Online Users Avatars */}
        <div className="flex -space-x-2">
          {chatDetails.participants?.map((user: any, index: number) => (
            <div key={index} className="relative h-8 w-8">
              <img
                src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.username}`}
                alt={user.username}
                className="h-full w-full rounded-full border-2 border-white object-cover"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
