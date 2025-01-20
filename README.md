# Movie-App

Welcome to Me and My Chicken's Movie App!

# Prerequisites

- Node.js >= 20.11.0
- PostgreSQL >= 14.13

# Set-up

1. Install Dependencies: Run `npm install` in the project root.

2. Start PostgreSQL 

3. Create DB: Run `createdb movies-app` OR `createdb -h localhost -U <username> movies-app`

4. Configure Environment: [???]

5. Setup DB: Run `psql -d movies-app < schema.sql` OR `psql -h localhost -U <username> -d movies-app < schema.sql` to load schema AND  `psql -d < seed-data.sql` OR `psql -h localhost -U <username> -d movies-app < seed-data.sql` to load seed data.

6. Start App: `npm run dev` 

# Application Overview

This app lets users view a movie list and create movie reviews. 

  ## Features:
    Movies:
      - All users can view the list of movies AND view additional information about any movie on the list. 
      - Any user create/update/delete a movie. 

    Reviews:
      - All users can view the list of reviews AND view additional information about any particular review. 
      - A user can also create/update/delete their own movie reviews when they sign-up / sign-in.  

    Users:
      - Users can _sign-up_ to create an account. 
      - Users can _sign-in_ to create/update/delete a movie review. 
