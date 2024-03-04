const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { getStringHash } = require("../util/util");

const ROOT_URL = "http://localhost:8080";

chai.use(chaiHttp);


const userModel = require("../model/users");
userModel.users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: getStringHash("purple-monkey-dinosaur")
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: getStringHash("dishwasher-funk")
  }
};



describe("Login and Access Control Test", () => {
  describe("GET /urls", () => {

    // GET /urls, a user should be redirected to /login if they are not logged in
    it(`1. GET /urls, a user should be redirected to /login if they are not logged in`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/urls")
        .then((res) => {
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/login");
        });
    });

    // GET /urls/new, a user should be redirected to /login if they are not logged in
    it(`2. GET /urls/new, a user should be redirected to /login if they are not logged in`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/urls/new")
        .then((res) => {
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/login");
        });
    });

    it(`3. GET /urls/:id, a user should see an error message if they are not logged in`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/urls/b6UTxQ")
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.include("You must be logged in to view this page");
        });
    });
    it(`4. GET /urls/:id, a user should see an error message if the URL doesn't exist`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/urls/000AAA")
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.text).to.include("The requested URL does not exist");
        });
    });

    it(`5. should return 403 status code for unauthorized access to /urls/b6UTxQ`, () => {
      const agent = chai.request.agent(ROOT_URL);
      // Step 1: Login with valid credentials
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          // Step 2: Make a GET request to a protected resource
          return agent.get("/urls/b6UTxQ").then((accessRes) => {
          // Step 3: Expect the status code to be 403
            expect(accessRes).to.have.status(403);
            expect(accessRes.text).to.include("You do not have permission to access this URL");
          });
        });
    });
    it(`5. should return 200 status code for authorized access to "${ROOT_URL}urls/b6UTxQ"`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const shortCode = "b6UTxQ";
      // Step 1: Login with valid credentials
      return agent
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then(() => {
          // Step 2: Make a GET request to a protected resource
          return agent.get("/urls/" + shortCode).then((accessRes) => {
          // Step 3: Expect the status code to be 403
            expect(accessRes).to.have.status(200);
            expect(accessRes.text).to.include(shortCode);
          });
        });
    });
  });



});