-- Check all messages in the database
SELECT 
  m.id, 
  m.chat_id, 
  m.sender_id, 
  u.username as sender_name,
  m.content, 
  m.read, 
  m.created_at, 
  m.updated_at
FROM 
  messages m
JOIN 
  users u ON m.sender_id = u.id
ORDER BY 
  m.created_at DESC
LIMIT 20;

-- Check if there are any constraints or triggers that might be preventing inserts
SELECT 
  tgname AS trigger_name,
  tgrelid::regclass AS table_name,
  tgtype,
  tgenabled
FROM 
  pg_trigger
WHERE 
  tgrelid = 'messages'::regclass;

-- Check if RLS (Row Level Security) is enabled on the messages table
SELECT
  tablename,
  hasrowsecurity,
  rowsecurity
FROM
  pg_tables
WHERE
  tablename = 'messages';

-- Check if there are any RLS policies on the messages table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'messages';
