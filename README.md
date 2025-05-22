# WhatsApp Chat Interface

A WhatsApp-style chat interface built with Next.js App Router, TypeScript, TailwindCSS, and Supabase.

## Features

- Real-time messaging with Supabase Realtime
- WhatsApp-style UI with three main sections:
  - Left sidebar with chat list
  - Center pane with active chat
  - Right sidebar with tools
- Message grouping by date
- Auto-scrolling to latest messages
- Online status indicators
- Chat labels (Demo, Internal, etc.)

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Styling**: TailwindCSS
- **Icons**: Lucide React

## Demo Credentials

For demo purposes, the app uses two hardcoded users:

- **Alice**: ID `00000000-0000-0000-0000-000000000001`
- **Bob**: ID `00000000-0000-0000-0000-000000000002`

The default chat is "Alice & Bob" with ID `00000000-0000-0000-0000-000000000010`.

## Running Locally

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up Supabase:
   - Create a Supabase project
   - Run the SQL scripts in the `sql` directory to set up the database schema and seed data
   - Add your Supabase URL and anon key to `.env.local`:
     \`\`\`
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing Real-time Functionality

To test the real-time functionality:
1. Open the app in two browser tabs
2. In one tab, send a message as Alice
3. In the other tab, you'll see the message appear in real-time

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: React components
- `lib/`: Utility functions and services
- `types/`: TypeScript type definitions
- `sql/`: SQL scripts for database setup

## Screenshots

[Add screenshots here]
