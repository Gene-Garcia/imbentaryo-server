// package
const router = require("express").Router();

// controllers
const {
  getGroups,
  insertGroup,
  getGroup,
  updateGroup,
  deleteGroup,
} = require("../controller/group");

// routes

// item group and some details
router.post("/add", insertGroup);

// gets all groups
router.get("/all", getGroups);

// gets item group details
router.get("/one/:groupId", getGroup);

// updates an item group
router.patch("/update", updateGroup);

// deletes a group
router.delete("/delete/:groupId", deleteGroup);

// export
module.exports = router;
