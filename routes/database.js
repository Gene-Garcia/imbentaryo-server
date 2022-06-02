const {
  insertGroups,
  insertItems,
  insertInventory,
  insertAccounts,
} = require("../database/databaseInit");

const router = require("express").Router();

router.post("/init/accounts", insertAccounts)
router.post("/init/groups", insertGroups);
router.post("/init/items", insertItems);
router.post("/init/inventory", insertInventory);

module.exports = router;
