CREATE TABLE chatlogs (
  userid uuid PRIMARY KEY REFERENCES profiles,
  chat jsonb NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE chatlogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chatlog"
ON chatlogs
FOR SELECT
TO authenticated
USING (auth.uid() = userid);

CREATE POLICY "Users can insert own chatlog"
ON chatlogs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can update own chatlog"
ON chatlogs
FOR UPDATE
TO authenticated
USING (auth.uid() = userid)
WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can delete own chatlog"
ON chatlogs
FOR DELETE
TO authenticated
USING (auth.uid() = userid);

-- I used AI to help generate the policies - I didn't know how to do it.
