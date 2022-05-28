const { test, updateItemInventory } = require("../controller/inventory");

// package
const router = require("express").Router();

// controllers

// routes

// increase inventory of an item
router.patch("/increase/:itemId");

// decreases inventory of an item
router.patch("/decrease/:itemId");

// gets item with inventory information (item details not included)
router.get("/details/:itemId");

// update item and inventory table
router.patch("/update/item-inventory", updateItemInventory);

// export
module.exports = router;
