// package
const router = require("express").Router();

// controllers
const {
  insertItem,
  getItems,
  getItem,
  getItemsOfGroup,
  deleteItemInventory,
} = require("../controller/item");

// routes

// add item with information, sometimes with inventory
router.post("/add", insertItem);

// gets item details and inventory information
router.get("/one/:itemId", getItem);

// get all available items
router.get("/all", getItems);

// get all items of an item group
router.get("/all/group/:itemGroupId", getItemsOfGroup);

// delete item as well as its inventory
router.delete("/delete/:itemId", deleteItemInventory);

// export
module.exports = router;
