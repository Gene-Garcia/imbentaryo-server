const {
  insertGroups,
  insertItems,
  insertInventory,
} = require("../database/databaseInit");

const router = require("express").Router();

router.post("/init/groups", insertGroups);
router.post("/init/items", insertItems);
router.post("/init/inventory", insertInventory);

module.exports = router;
