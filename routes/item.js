// package
const router = require("express").Router();

// controllers
const {
  insertItem,
  getItems,
  getItem,
  getItemsOfGroup,
} = require("../controller/item");

// routes

// add item with information, sometimes with inventory
router.post("/add", insertItem);

// update details of an item
router.patch("/update");

// gets item details and inventory information
router.get("/one/:itemId", getItem);

// get all available items
router.get("/all", getItems);

// get all items of an item group
router.get("/all/group/:itemGroupId", getItemsOfGroup);

// export
module.exports = router;
