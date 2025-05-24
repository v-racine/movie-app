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
VALUES ('Valerie', 'papillion@pap.com', 'password'),
('Salamander', 'salaman@pap.com', 'password2'),
('Wesley', 'wes@pap.com', 'password3');

 
INSERT INTO reviews (reviewer, grade, comments, movie_id, user_id)
VALUES ('Valerie', 'A+', 'a classic!', 2, 1),
('Salamander', 'A+', 'awesome goth cinema', 7, 2), 
('Wesley', 'C', 'stoopid movie', 4, 3);

