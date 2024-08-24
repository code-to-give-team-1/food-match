-- Drop the donations table if it exists
DROP TABLE IF EXISTS donations;

-- Create the donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    vector FLOAT8[]  -- Assuming you're storing vectors as arrays of floats
);

-- Insert test values of food donations
INSERT INTO donations (name) VALUES 
('Apples'), 
('Canned Beans'), 
('Rice'), 
('Pasta'), 
('Tomato Sauce'),
('Broad Beans'),
('Broccoli'),
('Macaroni'),
('Milk Chocolate');
