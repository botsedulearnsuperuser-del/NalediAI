-- SQL to Delete Users

-- CAUTION: THis deletes users from the Authentication table.
-- Cascade delete should handle removing their profiles and salons if your foreign keys are set up correctly.

-- Option 1: Delete a specific user by email
delete from auth.users where email = 'user@example.com';

-- Option 2: Delete ALL users (Dangerous - for dev reset only)
-- delete from auth.users;
