// package
const router = require("express").Router();

// controllers
const { updateItemInventory } = require("../controller/inventory");

// routes

// gets item with inventory information (item details not included)
router.get("/details/:itemId");

// update item and inventory table
router.patch("/update/item-inventory", updateItemInventory);

// export
module.exports = router;
