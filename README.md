# Movie-App

Welcome to Me and My Chicken's Movie App!

# Prerequisites

- Node.js >= 20.11.0
- PostgreSQL >= 14.13

# Set-up

1. Install Dependencies: Run `npm install` in the project root.
2. Create DB: Run `createdb movies-app`

3. Configure Environment: [do they have to do anything here?]

4. Setup DB: Run `psql -d movies-app < schema.sql` to load schema and 
`psql -d < seed-data` to load seed data.
5. Start App: `npm run dev` 

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
