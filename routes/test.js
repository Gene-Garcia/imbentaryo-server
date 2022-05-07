// package
const router = require("express").Router();

const ctx = require("../database/databaseContext");

router.get("/db", async (req, res) => {
  //   ctx.test((err, rows) => {
  //     console.log("rows");
  //   });

  //   try {
  //     const result = await ctx.test();
  //     console.log(result);
  //   } catch (error) {
  //     console.log("error in test");
  //     console.error(error);
  //   }

  //   console.log("out");

  try {
    const result = await ctx.runSelectOne(
      "SELECT * FROM lorem WHERE info = (?)",
      ["Ipsum 0"]
    );
    console.log("sending...");
    return res.status(200).json(result);
  } catch (error) {
    console.log("error sa labas");
    console.error(error);
    return res.status(200).json(error);
  }
});

// export
module.exports = router;
