import { BarChart2, FileText, FileEdit, Settings } from "lucide-react"

export default function RightSidebar() {
  return (
    <aside className="hidden w-16 border-l border-gray-200 bg-white md:flex">
      <nav className="flex w-full flex-col items-center py-6">
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
    </aside>
  )
}
