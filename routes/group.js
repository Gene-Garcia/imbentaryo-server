// package
const router = require("express").Router();

// controllers

// routes

// item group and some details
router.post("add");

// gets all groups
router.get("all");

// gets all items of a group by its id
router.get("/:groupId/items");

// deletes a group
router.delete("/delete/:groupId");

// export
module.exports = router;
