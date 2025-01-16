INSERT INTO movies (movie_title, movie_year, run_time)
VALUES
('Les Enfants du Paradis', 1945, 163),
('Notorious', 1946, 101), 
('Mon Oncle', 1958, 117),
('Point Break', 1991, 122),
('The Lives of Others', 2006, 137),
('No Country for Old Men', 2007, 122),
('Nosferatu', 2024, 132); 

INSERT INTO users (username, email, password)
VALUES ('Valerie', 'papillion@pap.com', 'Ipooped'),
('Salamander', 'salaman@pap.com', 'smells!'),
('Wesley', 'wes@pap.com', 'buttslach');

 
INSERT INTO reviews (reviewer, grade, comments, movie_id, user_id)
VALUES ('Valerie', 'A+', 'it''s me and my chicken', 2, 1),
('Salamander', 'A+', 'awesome goth cinema', 7, 2), 
('Wesley', 'C', 'stoopid chicken movie', 4, 3);

