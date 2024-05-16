# Orbital
## Introduction
Welcome to our Orbital project, Adventus. Adventus is a social media platform catered towards NUS students, providing a platform to make new friends with others outside one's typical social circle.

## Installation and Setup 
### Other required apps
First, make sure you have both [node.js](https://nodejs.org/en) as well as [postgreSQL](https://www.postgresql.org/). You can install them with the default configurations.
Once you've installed postgreSQL, boot up pgAdmin and sign in to your account. Then, from the Object Explorer in the left sidebar, under PostgreSQL > Databases, create a new database with a name of your choice.

### Setup
1. Clone this repository onto your local device.
2. In your terminal, navigate to the directory in which you saved the repository. For the purposes of this demonstration, let's assume it's saved in a folder named 'Adventus'. 
3. In the terminal, run `npm install` in both `Adventus/frontend` and `Adventus/backend` separately to install the required dependencies.
4. In the terminal, under directory `Adventus/backend`, run `prisma generate` followed by `prisma db push`.
5. In `Adventus/backend`, create a new file named `.env`.
   - In the new `.env` file, add the following lines of text, replacing the contents within the curly braces '{}' with the relevant details.
     ```
     PORT=8000 
     DATABASE_URL="postgresql://{Your postgreSQL account username}:{Your postgreSQL account password}@localhost:5432/{Your postgreSQL database name}?schema=public"
     JWTDuration="14d"
     ```

## Running the app
1. In a separate terminal, under directory `Adventus/backend`, run `npm tsc` (or any other typescript transpilier, ensuring that the tsconfig file is used), followed by `node index.js` to start the backend server. For developers, when you are coding on your IDE, change the "module" in tsconfig to "CommonJS". When trasnpilling, change it back to "ESNext". This is due to ESM incompatability of some modules we are using and just a temporary getaround.
2. In the terminal, under directory `Adventus/frontend`, run `npm run dev`. Take note of the address shown (for us, it's "http://localhost:3000")
3. In your browser of choice, type in "localhost:3000/" (or the address you were given) in your address bar and enter. 
4. You should see the homepage of our app Adventus!
