# URL Shortener App

A simple URL shortener app built with [Express](https://expressjs.com/)

## About
  First web app created for the Lighthouse Labs Web Development Bootcamp. This express.js app allows users to shorten long URLs and store them in an in-memory database. Users can also edit and delete their URLs.

  ![Screenshot of the app](https://i.imgur.com/GzM0Oiy.png)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/dirtandgrass/tinyapp.git
   ```

2. Install dependencies:

   ```bash
    npm install
    ```
3. Run the server:

   ```bash
   npm start
   ```
4. Open your browser and go to:

   ```bash
    http://localhost:8080/
    ```
5. Options
    - To customize the port, create a .env file in the root directory and add the following line:
        ```bash
        PORT=3000
        ```
    - to use a different session cookie secret, add the following line to the .env file:
        ```bash
        COOKIE_SECRET="[MY SECRET COOKIE STRING]"
        ```
5. Enjoy!


### Tests
  - To run the tests, use the following command:
    ```bash
    npm test
    ```
  - The tests are written using Mocha and Chai. They test the user model and the server routes.

## Dependencies
  - Node.js
  - Express
  - EJS
  - bcrypt
  - body-parser
  - cookie-session
  - dotenv

  ### Development and Test Dependencies
  - mocha
  - chai
  - nodemon