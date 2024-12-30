-- initial schema
CREATE TABLE movies (
	id serial PRIMARY KEY,
	movie_title varchar(250) NOT NULL, 
	movie_year integer NOT NULL CHECK ((movie_year >= 1878) AND (movie_year <= 9999)),
	run_time integer NOT NULL 
);