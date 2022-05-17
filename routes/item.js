// package
const router = require("express").Router();

// controllers
const { insertItem } = require("../controller/item");

// routes

// add item with information, sometimes with inventory
router.post("/add", insertItem);

// update details of an item
router.patch("/update");

// gets item details and inventory information
router.get("/all/:itemId");

// get all available items
router.get("all");

// export
module.exports = router;
