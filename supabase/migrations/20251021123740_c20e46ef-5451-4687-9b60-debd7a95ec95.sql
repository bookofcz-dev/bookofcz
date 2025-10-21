-- Drop any triggers using lowercase_wallet_address on marketplace_books
DROP TRIGGER IF EXISTS lowercase_wallet_address_trigger ON marketplace_books;

-- The lowercase_wallet_address function should only be on user_roles table
-- Let's make sure it exists there
DROP TRIGGER IF EXISTS lowercase_wallet_address_trigger ON user_roles;

CREATE TRIGGER lowercase_wallet_address_trigger
BEFORE INSERT OR UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION lowercase_wallet_address();