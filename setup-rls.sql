-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy to allow users to read messages in chats they are in
CREATE POLICY "Users can read messages in chats they are in"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.user_id = auth.uid()
        AND chat_participants.chat_id = messages.chat_id
    )
  );

-- Make sure realtime is enabled for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
