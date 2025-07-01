process.env.NODE_ENV = "test";

import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";

chai.use(chaiHttp);

const expect = chai.expect;
const should = chai.should();
import app from "../app.js";
import Dog from "../models/dog.js";
import User from "../models/user.js";

before((done) => {
  Dog.deleteMany({});
  User.deleteMany({});
  done();
});

after((done) => {
  Dog.deleteMany({});
  User.deleteMany({});
  done();
});

describe("Test Get Routes", () => {
  it("Test default API welcome route...", (done) => {
    request
      .execute(app)
      .get("/api/welcome")
      .end((err, res) => {
        res.should.have.status(200);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal("Welcome");
        done();
      });
  });

});

describe("Allow users to register with a username and password. Passwords should be hashed before storing in the database.", () => {
  it("Test default API welcome route...", (done) => {
    request
      .execute(app)
      .get("/api/welcome")
      .end((err, res) => {
        res.should.have.status(200);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal("Welcome");
        done();
      });
  });

});


// Allow users to register with a username and password. Passwords should be hashed before storing in the database.
// Enable users to log in using their credentials. Upon login, issue a token valid for 24 hours for subsequent authenticated requests.
// Authenticated users can register dogs awaiting adoption, providing a name and a brief description.
// Authenticated users can adopt a dog by its ID, including a thank-you message for the original owner. Restrictions apply: a dog already adopted cannot be adopted again, and users cannot adopt dogs they registered.
// Owners can remove their registered dogs from the platform unless the dog has been adopted. Users cannot remove dogs registered by others.
// Authenticated users can list dogs they've registered, with support for filtering by status and pagination.
// Authenticated users can list dogs they've adopted, with pagination support.
// Anticipate and manage potential edge cases, providing appropriate HTTP status codes.
// Ensure the application can parse JSON payloads.
// Use an npm package to enable CORS for resource sharing across domains.
// Securely store sensitive information such as database credentials in environment variables.
// Separate concerns by employing a layered architecture. The controller layer should manage routing logic, while the model layer should focus on database interactions. This promotes maintainability and scalability.
// Use MongoDB Atlas for your cloud database needs. Integrate this database with your application to manage data.