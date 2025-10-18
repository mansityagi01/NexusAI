# Quick Fix for Description Column Error

## Option 1: Run this SQL in Supabase Dashboard (FASTEST)

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run this command:

```sql
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS description text;
```

## Option 2: Alternative Server Fix (if you can't access Supabase)

Temporarily modify the server to not use the description field:

In `server/index.js`, replace the database insert with:

```javascript
const { error } = await supabase.from('tickets').insert({
  id: ticketId,
  subject: ticket_subject,
  // description: ticket_description || null,  // Comment this out temporarily
  status: 'Processing'
});
```

## Option 3: Reset and Recreate (if needed)

If you want to completely reset your database:

1. Drop the existing tables in Supabase SQL Editor:
```sql
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS tickets;
```

2. Re-run the updated migration file that now includes the description column.

## Recommended Approach

**Use Option 1** - it's the fastest and safest way to add the missing column without losing existing data.

After running the SQL command, restart your NexusAI server and the error should be resolved!