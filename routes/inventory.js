const { test } = require("../controller/inventory");

// package
const router = require("express").Router();

// controllers

// routes
// router.route().get().post()
router.get("/test", test);

// export
module.exports = router;
