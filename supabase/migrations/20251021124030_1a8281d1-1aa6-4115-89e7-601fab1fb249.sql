-- Drop only user-created triggers (not system constraint triggers)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'marketplace_books'::regclass 
        AND tgname NOT LIKE 'RI_ConstraintTrigger%'
        AND tgname NOT LIKE 'pg_%'
    )
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON marketplace_books CASCADE';
    END LOOP;
END $$;

-- Now create ONLY the correct trigger for creator_wallet
CREATE TRIGGER lowercase_creator_wallet_trigger
BEFORE INSERT OR UPDATE ON marketplace_books
FOR EACH ROW
EXECUTE FUNCTION lowercase_creator_wallet();