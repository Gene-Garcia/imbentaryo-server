// package
const router = require("express").Router();

// controllers
const { getGroups, insertGroup, getGroup } = require("../controller/group");

// routes

// item group and some details
router.post("/add", insertGroup);

// gets all groups
router.get("/all", getGroups);

// gets item group details
router.get("/one/:groupId", getGroup);

// deletes a group
router.delete("/delete/:groupId");

// export
module.exports = router;
