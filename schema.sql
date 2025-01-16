-- initial schema
CREATE TABLE movies (
	id serial PRIMARY KEY,
	movie_title varchar(250) NOT NULL, 
	movie_year integer NOT NULL CHECK ((movie_year >= 1878) AND (movie_year <= 9999)),
	run_time integer NOT NULL 
);

CREATE TABLE users (
	id serial PRIMARY KEY,
	username varchar(150) NOT NULL UNIQUE,
	email text NOT NULL,
	password text NOT NULL
);


CREATE TYPE letter_grade AS ENUM 
 ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F');

CREATE TABLE reviews (
	id serial PRIMARY KEY, 
	reviewer varchar(250) NOT NULL, 
	grade letter_grade NOT NULL,
	comments text,
	movie_id integer NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
	user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(movie_id, user_id)
);
