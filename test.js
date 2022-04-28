const { expect, assert } = require("chai");
const { dispenseBeverage, beverages } = require("./data");

const request = require("supertest")("http://localhost:3000");
const ingredientsData = {
  milk: 10,
  water: 9,
  sugar: 10,
  coffee: 10,
};

describe("Reset Ingredients", () => {
  it("Reset All ingredients to Zero if exits", () => {
    return request.get("/admin/reset").expect(200);
  });
});

// describe("Current Status of Ingredients", () => {});

describe("Add Ingredients", () => {
  it("Ingredient status : Before Adding ", (done) => {
    request
      .get("/user/status")
      .expect(200)
      .then((res) => console.log(res.body));
    done();
  });
  for (const key in ingredientsData) {
    const quantity = ingredientsData[key];
    const ingredientName = key;
    it(`Add ${ingredientName} : ${quantity} units`, () => {
      const data = {};
      data[ingredientName] = quantity;

      return request.post("/admin/topup").send(data).expect(200);
    });
  }
});

describe("Adding Beverage", () => {
  for (const beverage of beverages) {
    it(`Add ${beverage.beverageName}`, () => {
      const data = {
        beverageName: beverage.beverageName,
        ingredients: beverage.ingredients,
      };

      return request
        .post("/admin/add-beverage")
        .send(data)
        .expect(201)
        .then((res) => {
          assert.equal(res.body.name, data.beverageName);
        });
    });
  }
});

describe("Dispense Beverages", () => {
  it("Ingredient status : Water is not available", (done) => {
    request
      .get("/user/status")
      .expect(200)
      .then((res) => console.log(res.body));
    done();
  });
  for (const beverage of dispenseBeverage) {
    it(`Dispense -> ${beverage.name}`, () => {
      return request.post("/user/dispense").send(beverage).expect(200);
    });
  }
});

describe("Shoud not dispense the beverage : Expect 400 status code", () => {
  it("Ingredient status ", (done) => {
    request
      .get("/user/status")
      .expect(200)
      .then((res) => console.log(res.body));
    done();
  });
  for (const beverage of dispenseBeverage) {
    it(`Dispense Declined - status code 400 for -> ${beverage.name}`, () => {
      return request.post("/user/dispense").send(beverage).expect(400);
    });
  }
});

const ingredientsDataTopup = {
  water: 10,
  coffee: 10,
};

describe("Ingredients Topup", () => {
  for (const key in ingredientsDataTopup) {
    const quantity = ingredientsDataTopup[key];
    const ingredientName = key;
    it(`Add ${ingredientName} : ${quantity} units`, () => {
      const data = {};
      data[ingredientName] = quantity;

      return request.post("/admin/topup").send(data).expect(200);
    });
  }
});

describe("After Topup :Dispense beverage ", () => {
  it("Dispense Sugarless Coffee With Milk", () => {
    const data = dispenseBeverage[0];
    return request.post("/user/dispense").send(data).expect(200);
  });
  it("Dispense Coffee With Milk", () => {
    const data = dispenseBeverage[1];
    return request.post("/user/dispense").send(data).expect(200);
  });
});
