# 🟢 WhatsApp-Style Chat Interface

A polished, pixel-perfect chat application inspired by WhatsApp, built using **Next.js App Router**, **TypeScript**, **TailwindCSS**, and **Supabase**.

This project replicates a WhatsApp-style user interface with real-time messaging capabilities. It follows a screenshot as the design reference, with an emphasis on UI accuracy, core chat functionality, and extensibility.

[🔗 GitHub Repository](https://github.com/awxsxme/supabase-chat-app/)

---

## ✨ Features

- 🔄 **Real-Time Messaging** via Supabase Realtime
- 💬 **WhatsApp-Style UI** with 3-column layout:
  - Left: Chat list
  - Center: Active conversation
  - Right: Tool sidebar
- 📆 **Grouped Messages by Date**
- 📜 **Auto-Scroll to Latest Message**
- 🟢 **Online Status Indicators**
- 🏷️ **Chat Labels** (e.g., Demo, Internal)
- 🔐 **Login Screen** styled to match chat UI

---

## 🧪 Core Functional Requirements

The following are the mandatory features, implemented as per the design spec:

- ✅ Send messages via the input box; messages are saved to the DB and displayed instantly
- ✅ Real-time message updates between users using Supabase
- ✅ Selecting a chat opens the corresponding conversation thread
- ✅ Pixel-perfect UI with all buttons/icons (regardless of functionality)

---

## 🔧 Tech Stack

| Layer     | Stack                                   |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript     |
| Styling   | TailwindCSS                             |
| Backend   | Supabase (PostgreSQL + Realtime)        |
| Icons     | [React Icons](https://react-icons.github.io/react-icons) |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/awxsxme/supabase-chat-app.git
cd supabase-chat-app
pnpm install
```

### 2. Configure Supabase

- Create a new Supabase project
- Run the SQL scripts in the `sql/` directory to set up the schema and seed data
- Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Dev Server

```bash
pnpm run dev
```

## 🔄 Testing Real-time Messaging

1. Open two browser tabs  
2. Log in as different users  
3. Send a message — it will appear instantly on the other tab  

---

## ✅ Optional To-Do Features

These are stretch goals for enhancement:

- 🔍 **Chat Search & Filters**
- 🏷️ **Labeling Chats**
- 👥 **Assign Members to Chats**
- 🌐 **Responsive Layouts**
- 🌓 **Dark Mode Support**

---

## 🎥 Demo

[![Watch the demo](./public/loom-thumbnail.png)](https://www.loom.com/share/fc93cafb4d4346238412c8f1a93ed042?sid=958fc81c-badf-4064-a15f-2d9341c12035)
