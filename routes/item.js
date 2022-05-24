// package
const router = require("express").Router();

// controllers
const { insertItem, getItems, getItem } = require("../controller/item");

// routes

// add item with information, sometimes with inventory
router.post("/add", insertItem);

// update details of an item
router.patch("/update");

// gets item details and inventory information
router.get("/one/:itemId", getItem);

// get all available items
router.get("/all", getItems);

// export
module.exports = router;
