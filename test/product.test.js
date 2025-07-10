process.env.NODE_ENV = "test";

import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";
import { faker } from "@faker-js/faker";

chai.use(chaiHttp);

const expect = chai.expect;
const should = chai.should();
import app from "../app.js";
import Dog from "../models/dog.js";
import User from "../models/user.js";

describe("User Api Tests", function () {
  before(async function () {
    await User.deleteMany({});
  });

  it("Allows users to register with a username and password. Passwords should be hashed before storing in the database.", (done) => {
    let requestBody = {
      email: "nlpaulhus@gmail.com",
      password: "testtesttesttest",
    };
    request
      .execute(app)
      .post("/api/signup")
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(201);
        const newUser = res.body.user;
        expect(newUser).to.have.property("email");
        expect(newUser).to.have.property("password");
        done();
      });
  });

  it("Enables users to log in using their credentials. Upon login, issue a token valid for 24 hours for subsequent authenticated requests.", (done) => {
    let requestBody = {
      email: "nlpaulhus@gmail.com",
      password: "testtesttesttest",
    };
    request
      .execute(app)
      .post("/api/login")
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");
        done();
      });
  });
});

describe("Dog Api Tests", function () {
  before(async function () {
    await Dog.deleteMany({});

    let dogSeedData = [];

    for (let i = 0; i < 25; i++) {
      let newDogOne = {
        name: faker.person.firstName(),
        description: faker.lorem.words(6),
        owner: "123456789",
        status: "adoptable",
      };

      let newDogTwo = {
        name: faker.person.firstName(),
        description: faker.lorem.words(6),
        owner: "123456789",
        status: "adopted",
        newOwnerId: "234567890",
        ownerMessage: faker.lorem.words(6),
      };

      let newDogThree = {
        name: faker.person.firstName(),
        description: faker.lorem.words(6),
        owner: "234567890",
        status: "adoptable",
      };

      let newDogFour = {
        name: faker.person.firstName(),
        description: faker.lorem.words(6),
        owner: "234567890",
        status: "adopted",
        newOwnerId: "123456789",
        ownerMessage: faker.lorem.words(6),
      };

      dogSeedData.push(newDogOne, newDogTwo, newDogThree, newDogFour);
    }

    await Dog.insertMany(dogSeedData);
  });

  it("Authenticated users can register dogs awaiting adoption, providing a name and a brief description.", (done) => {
    let newDog = {
      name: "Sadie",
      description: "The cutest dog on the planet",
      owner: "123456789",
    };

    request
      .execute(app)
      .post("/api/registerDog")
      .send(newDog)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.have.property("newDog");
        expect(res.body.newDog).to.have.property("name");
        expect(res.body.newDog).to.have.property("description");
        expect(res.body.newDog).to.have.property("owner");
        expect(res.body.newDog.status).to.equal("adoptable");
        done();
      });
  });

  it("Authenticated users can adopt a dog by its ID, including a thank-you message for the original owner. Restrictions apply: a dog already adopted cannot be adopted again, and users cannot adopt dogs they registered.", async function () {
    let dog = await Dog.findOne({ status: "adoptable" }).then((dog) =>
      dog.toJSON()
    );

    let dogId = dog._id.toString();

    let requestBody = {
      ownerMessage: "Thank you for this dog!",
      dogId: dogId,
      newOwnerId: "23426134463141",
    };

    request
      .execute(app)
      .put("/api/adopt")
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.have.property("updatedDog");
        expect(res.body.updatedDog).to.have.property("newOwnerId");
        expect(res.body.updatedDog).to.have.property("ownerMessage");
        expect(res.body.updatedDog.status).to.equal("adopted");
      });
  });

  it("Owners can remove their registered dogs from the platform unless the dog has been adopted. Users cannot remove dogs registered by others.", async function () {
    let dog = await Dog.findOne({ status: "adoptable" })
      .then((dog) => dog.toJSON())
      .catch((err) => console.log(err));
    let dogId = dog._id.toString();

    let requestBody = {
      dogId: dogId,
      currentUserId: dog.owner,
    };

    request
      .execute(app)
      .delete("/api/delete")
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.equal("Dog has been deleted.");
      });
  });

  it("Authenticated users can list dogs they've registered, with support for filtering by status and pagination. (all dogs)", async function () {
    const requestBody = {
      currentUserId: "123456789",
    };

    let page = Math.floor(Math.random() * 5) + 1;

    request
      .execute(app)
      .get(`/api/yourdogs/${page}`)
      .send(requestBody)
      .end((err, res) => {
        const yourDogs = res.body.yourDogs;
        expect(res.status).to.equal(201);
        expect(yourDogs.length).to.be.below(11);

        for (let i = 0; i < yourDogs.length; i++) {
          expect(res.body.yourDogs[i].owner).to.equal("123456789");
        }
      });
  });

  it("Authenticated users can list dogs they've registered, with support for filtering by status and pagination. (adoptable)", async function () {
    const requestBody = {
      currentUserId: "123456789",
    };

    let page = Math.floor(Math.random() * 3) + 1;

    request
      .execute(app)
      .get(`/api/yourdogs/adoptable/${page}`)
      .send(requestBody)
      .end((err, res) => {
        const yourDogs = res.body.yourDogs;
        expect(res.status).to.equal(201);
        expect(yourDogs.length).to.be.below(11);

        for (let i = 0; i < yourDogs.length; i++) {
          expect(yourDogs[i].owner).to.equal("123456789");
          expect(yourDogs[i].status).to.equal("adoptable");
        }
      });
  });

  it("Authenticated users can list dogs they've registered, with support for filtering by status and pagination. (adopted)", async function () {
    const requestBody = {
      currentUserId: "123456789",
    };

    let page = Math.floor(Math.random() * 3) + 1;

    request
      .execute(app)
      .get(`/api/yourdogs/adopted/${page}`)
      .send(requestBody)
      .end((err, res) => {
        const yourDogs = res.body.yourDogs;
        expect(res.status).to.equal(201);
        expect(yourDogs.length).to.be.below(11);

        for (let i = 0; i < yourDogs.length; i++) {
          expect(yourDogs[i].owner).to.equal("123456789");
          expect(yourDogs[i].status).to.equal("adopted");
        }
      });
  });

  it("Authenticated users can list dogs they've adopted, with pagination support.", async function () {
    const requestBody = {
      currentUserId: "123456789",
    };

    let page = Math.floor(Math.random() * 3) + 1;

    request
      .execute(app)
      .get(`/api/youradopteddogs/${page}`)
      .send(requestBody)
      .end((err, res) => {
        const yourDogs = res.body.yourDogs;
        expect(res.status).to.equal(201);
        expect(yourDogs.length).to.be.below(11);

        for (let i = 0; i < yourDogs.length; i++) {
          expect(yourDogs[i].newOwnerId).to.equal("123456789");
          expect(yourDogs[i].status).to.equal("adopted");
        }
      });
  });
});

//
//
// Anticipate and manage potential edge cases, providing appropriate HTTP status codes.
