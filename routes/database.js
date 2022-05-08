const { insertGroups } = require("../database/databaseInit");

const router = require("express").Router();

router.post("/init/groups", insertGroups);

module.exports = router;
