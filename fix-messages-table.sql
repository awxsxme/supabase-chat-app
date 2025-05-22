-- Check if the messages table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'messages'
  ) THEN
    RAISE NOTICE 'Creating messages table...';
    
    CREATE TABLE messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Add indexes for better performance
    CREATE INDEX messages_chat_id_idx ON messages(chat_id);
    CREATE INDEX messages_sender_id_idx ON messages(sender_id);
    CREATE INDEX messages_created_at_idx ON messages(created_at);
    
    RAISE NOTICE 'Messages table created successfully';
  ELSE
    RAISE NOTICE 'Messages table already exists';
    
    -- Check if all required columns exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'read'
    ) THEN
      RAISE NOTICE 'Adding read column to messages table...';
      ALTER TABLE messages ADD COLUMN read BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'updated_at'
    ) THEN
      RAISE NOTICE 'Adding updated_at column to messages table...';
      ALTER TABLE messages ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
  END IF;
  
  -- Disable RLS on messages table for testing
  ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'Row Level Security disabled on messages table for testing';
END $$;

-- Check if there are any messages in the table
SELECT COUNT(*) FROM messages;
