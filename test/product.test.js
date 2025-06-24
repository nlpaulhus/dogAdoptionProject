process.env.NODE_ENV = "test";

import { expect as _expect, use } from "chai";
const expect = _expect;
import chaiHttp from "chai-http";

use(chaiHttp);

describe("First test", function () {
  describe("it should be a test", function () {
    let expectedVal = 10;
    let actualVal = 1;
    expect(actualVal).to.be.equal(expectedVal);
  });
});
