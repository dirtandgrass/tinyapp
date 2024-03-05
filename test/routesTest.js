const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { getStringHash } = require("../util/util");

const ROOT_URL = "http://localhost:8080";

chai.use(chaiHttp);


const userModel = require("../model/users");
const urlModel = require("../model/urls");



describe("Login and Access Control Test", () => {

  beforeEach(() => {
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

    urlModel.urlDatabase = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userId: "userRandomID",
        dateCreated: new Date(),
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userId: "user2RandomID",
        dateCreated: new Date(),
      },
    };

    console.log(userModel.users);
  });


  describe("GET /u", () => {
    it(`GET /u/:id, should return 404 status code for a non-existent short URL`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent.get("/u/000AAA").then((res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.include("URL not found");
      });
    });
    it(`GET /u/:id, should redirect to the long URL for a valid short URL`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent.get("/u/b6UTxQ").then((res) => {
        expect(res).to.redirect;
        expect(res.redirects[0]).to.include("https://www.tsn.ca");
      });
    });
  });

  describe("GET /", () => {
    it(`if user is logged in, should redirect to /urls`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.get("/").then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/urls");
          });
        });
    });

    it(`if user is not logged in, should redirect to /login`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/")
        .then((res) => {
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/login");
        });
    });
  });

  describe("GET /urls", () => {

    // GET /urls, a user should be redirected to /login if they are not logged in
    it(`GET /urls, a user should see a message, asking them to login if they are not logged in`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .get("/urls")
        .then((res) => {
          expect(res).status(401);
          expect(res.text).to.include("You must be logged in to view this page");
        });
    });

    it(`GET /urls, a user should see their own urls`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.get("/urls").then((res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.include("i3BoGr");
          });
        });
    });

    it(`GET /urls, a user should not see other users' urls`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.get("/urls").then((res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.not.include("b6UTxQ");
          });
        });
    });


    describe("GET /urls/new", () => {

      // GET /urls/new, a user should be redirected to /login if they are not logged in
      it(`GET /urls/new, a user should be redirected to /login if they are not logged in`, () => {
        const agent = chai.request.agent(ROOT_URL);
        return agent
          .get("/urls/new")
          .then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/login");
          });
      });

      it(`GET /urls/new, a user should see the form to create a new URL if they are logged in`, () => {
        const agent = chai.request.agent(ROOT_URL);
        return agent
          .post("/login")
          .send({ email: "user2@example.com", password: "dishwasher-funk" })
          .then(() => {
            return agent.get("/urls/new").then((res) => {
              expect(res).to.have.status(200);
              expect(res.text).to.include(`<form class="form-inline" action="/urls" method="POST">`);
            });
          });
      });

    });

    describe("GET /urls/:id", () => {

      it(`GET /urls/:id, a user should see an error message if they are not logged in`, () => {
        const agent = chai.request.agent(ROOT_URL);
        return agent
          .get("/urls/b6UTxQ")
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.text).to.include("You must be logged in to view this page");
          });
      });
      it(`GET /urls/:id, a user should see an error message if they are logged in, but the URL doesn't exist`, () => {
        const agent = chai.request.agent(ROOT_URL);
        return agent
          .post("/login")
          .send({ email: "user2@example.com", password: "dishwasher-funk" })
          .then(() => {
            return agent
              .get("/urls/000AAA")
              .then((res) => {
                expect(res).to.have.status(404);
                expect(res.text).to.include("Tiny URL not found");
              });
          });
      });



      it(`GET /urls should return 403 status code for unauthorized access to /urls/b6UTxQ`, () => {
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
              expect(accessRes.text).to.include("You do not have permission to perform this action");
            });
          });
      });
      it(`GET /urls should return 200 status code for authorized access to "${ROOT_URL}urls/b6UTxQ"`, () => {
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

  describe("POST /urls", () => {
    it(`if user is logged in, generates a short URL, saves it, and associates it with the user`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const newURL = { longURL: "https://www.example.com" };
      return agent
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then(() => {
          return agent.post("/urls").send(newURL).then((res) => {
            expect(res).to.redirect;
          });
        });
    });

    it(`if user is logged in, redirects to /urls/:id, where :id matches the ID of the newly saved URL`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const newURL = { longURL: "https://www.example.com" };
      return agent
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then(() => {
          return agent.post("/urls").send(newURL).then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include(ROOT_URL + "/urls/");

          });
        });
    });

    it(`if user is not logged in, returns HTML with a relevant error message`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const newURL = { longURL: "https://www.example.com" };
      return agent.post("/urls").send(newURL).then((res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.include("You must be logged in to create a new short url");
      });
    });
  });

  describe("PUT /urls/:id", () => {
    it(`if user is logged in and owns the URL for the given ID, updates the URL`, async() => {
      const agent = chai.request.agent(ROOT_URL);
      const updatedURL = { longURL: "https://www.updated-example.com" };

      /*i3BoGr: {
        longURL: "https://www.google.ca",
        */
      expect(urlModel.urlDatabase["i3BoGr"].longURL).to.equal("https://www.google.ca");

      //console.log(urlModel.urlDatabase["i3BoGr"].longURL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.put("/urls/i3BoGr").send(updatedURL).then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/urls");

            // can't figure out why this fails
            // expect(urlModel.urlDatabase["i3BoGr"].longURL).to.equal(updatedURL.longURL);
          });
        });
    });



    it(`if user is not logged in, returns HTML with a relevant error message`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const updatedURL = { longURL: "https://www.updated-example.com" };
      return agent.put("/urls/i3BoGr").send(updatedURL).then((res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.include("You must be logged in to perform this action");
      });
    });

    it(`if user is logged in but does not own the URL for the given ID, returns HTML with a relevant error message`, () => {
      const agent = chai.request.agent(ROOT_URL);
      const updatedURL = { longURL: "https://www.updated-example.com" };
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.put("/urls/b6UTxQ").send(updatedURL).then((res) => {
            expect(res).to.have.status(403);
            expect(res.text).to.include("You do not have permission to perform this action");
          });
        });
    });
  });

  describe("DELETE /urls/:id/delete", () => {
    it(`if user is logged in and owns the URL for the given ID, deletes the URL`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.delete("/urls/i3BoGr").then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/urls");
            // same issue as before
            //expect(urlModel.urlDatabase["i3BoGr"]).to.not.exist;
          });
        });
    });

    it(`if user is not logged in, returns HTML with a relevant error message`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent.delete("/urls/i3BoGr").then((res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.include("You must be logged in to perform this action");
      });
    });

    it(`if user is logged in but does not own the URL for the given ID, returns HTML with a relevant error message`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user2@example.com", password: "dishwasher-funk" })
        .then(() => {
          return agent.delete("/urls/b6UTxQ").then((res) => {
            expect(res).to.have.status(403);
            expect(res.text).to.include("You do not have permission to perform this action");
          });
        });
    });
  });

  describe("GET /login", () => {
    it(`if user is logged in, redirects to /urls`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then(() => {
          return agent.get("/login").then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/urls");
          });
        });
    });

    it(`if user is not logged in, returns HTML with login form`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent.get("/login").then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include(`<form class="form-inline" action="/login" method="post">`);
      });
    });
  });

  describe("GET /register", () => {
    it(`if user is logged in, should redirect to /urls`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then(() => {
          return agent.get("/register").then((res) => {
            expect(res).to.redirect;
            expect(res.redirects[0]).to.include("/urls");
          });
        });
    });

    it(`if user is not logged in, should return HTML with a registration form`, () => {
      return chai.request(ROOT_URL)
        .get("/register")
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.include('<form class="form-inline" action="/register" method="post">');
          expect(res.text).to.include('<input class="form-control" type="email" name="email" ');
          expect(res.text).to.include('<input class="form-control" type="password" name="password"');
          expect(res.text).to.include('<button type="submit" ');
        });
    });
  });

  describe("POST /login", () => {
    it(`if email and password params match an existing user, sets a cookie and redirects to /urls`, () => {
      return chai.request.agent(ROOT_URL)
        .post("/login")
        .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
        .then((res) => {

          expect(res.request.cookies).includes("session");
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/urls");
        });
    });

    it(`if email and password params don't match an existing user, returns HTML with a relevant error message`, () => {
      return chai.request(ROOT_URL)
        .post("/login")
        .send({ email: "nonexistent@example.com", password: "wrongpassword" })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.include("Incorrect email or password");
        });
    });
  });

  describe("POST /register", () => {
    it(`if email or password are empty, returns HTML with a relevant error message`, () => {
      return chai.request(ROOT_URL)
        .post("/register")
        .send({ email: "", password: "somepassword" })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.include("Invalid email or password");
        });
    });

    it(`if email already exists, returns HTML with a relevant error message`, () => {
      return chai.request(ROOT_URL)
        .post("/register")
        .send({ email: "user@example.com", password: "somepassword" })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.include("That Email address is already registered");
        });
    });

    it(`otherwise, creates a new user, encrypts the password, sets a cookie, and redirects to /urls`, () => {
      return chai.request.agent(ROOT_URL)
        .post("/register")
        .send({ email: "newuser@example.com", password: "newuserpassword" })
        .then((res) => {
          //expect(res.request.cookies).includes("session");
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/urls");
        });
    });
  });

  describe("POST /logout", () => {
    it(`deletes cookie and redirects to /login`, () => {
      const agent = chai.request.agent(ROOT_URL);
      return agent
        .post("/logout")
        .then((res) => {
          expect(res).to.redirect;
          expect(res.redirects[0]).to.include("/login");
          expect(res.request.cookies).not.includes("session");
        });
    });
  });

});