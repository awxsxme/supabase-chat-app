-- Check if the messages table exists and has the correct structure
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
  END IF;
  
  -- Disable RLS on messages table for testing
  ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'Row Level Security disabled on messages table for testing';
END $$;

-- Check if there are any messages in the table
SELECT COUNT(*) FROM messages;

-- Insert a test message if there are none
DO $$
DECLARE
  message_count INTEGER;
  chat_id UUID;
  sender_id UUID;
BEGIN
  SELECT COUNT(*) INTO message_count FROM messages;
  
  IF message_count = 0 THEN
    -- Get a valid chat_id
    SELECT id INTO chat_id FROM chats LIMIT 1;
    
    -- Get a valid sender_id
    SELECT id INTO sender_id FROM users LIMIT 1;
    
    IF chat_id IS NOT NULL AND sender_id IS NOT NULL THEN
      RAISE NOTICE 'Inserting test message...';
      
      INSERT INTO messages (
        chat_id,
        sender_id,
        content,
        read,
        created_at,
        updated_at
      ) VALUES (
        chat_id,
        sender_id,
        'This is a test message to verify the messages table is working correctly.',
        FALSE,
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Test message inserted successfully';
    ELSE
      RAISE NOTICE 'Could not insert test message: No valid chat or sender found';
    END IF;
  ELSE
    RAISE NOTICE 'Messages table already has % messages', message_count;
  END IF;
END $$;

-- Check messages again
SELECT 
  m.id, 
  m.chat_id, 
  m.sender_id, 
  u.username as sender_name,
  m.content, 
  m.read, 
  m.created_at
FROM 
  messages m
JOIN 
  users u ON m.sender_id = u.id
ORDER BY 
  m.created_at DESC
LIMIT 10;
