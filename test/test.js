const { expect } = require("chai");
const Grud = require("./../dist/grud");
const mock = require("./mock.json");

const db = new Grud({
  owner: "aneesahammed",
  repo: "git-lab",
  path: "db.json",
  personalAccessToken: process.env.TOKEN,
});

describe("grud tests", () => {
  describe("create records", async () => {
    it("should create 4 records", async () => {
      const collection = await db.save(mock);
      expect(collection).to.have.lengthOf(4);
    });
  });

  describe("read records", () => {
    it("Should read 4 records", async () => {
      const collection = await db.find();
      expect(collection).to.have.lengthOf(4);
    });
  });

  describe("query records", () => {
    it("Should query a valid record", async () => {
      const obj = await db.find({ author: "Anand" });
      expect(obj.author).to.equal("Anand");
    });

    it("Should query an invalid record", async () => {
      const obj = await db.find({ author: "xxx" });
      expect(obj).to.equal(undefined);
    });
  });

  describe("update records", () => {
    it("Should update a record", async () => {
      console.log(`changing author from:${mock[1].author}->Atul`);
      mock[1].author = "Atul";
      const collection = await db.update({ author: "Anand" }, mock[1]);
      expect(collection).to.have.lengthOf(4);
      expect(collection).to.include.members([mock[1]]);
    });

    it("Should try to update an invalid record", async () => {
      const collection = await db.update({ author: "xxx" }, mock[0]);
      expect(collection).to.have.lengthOf(4);
      //todo confirm collection is not updated.
    });
  });

  describe("delete records", () => {
    it("should try deleting an invalid record", () => {
      expect(async () => {
        await db.deleteOne({ author: "xxx" });
      }).to.throw("Unable to delete the record, please check the query.");
    });

    it("should delete a record", async () => {
      const collection = await db.deleteOne({ author: "Anees" });
      expect(collection).to.have.lengthOf(3);
      expect(collection).to.not.include.members([mock[3]]);
    });
  });
});
