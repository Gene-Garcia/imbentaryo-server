const { httpStatus } = require("../constants/status");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK);
};

/*
 * POST
 * creates a new item group
 */
exports.insertGroup = async (req, res) => {};

/*
 * GET
 * gets all available groups
 */
exports.getGroups = async (req, res) => {};

/*
 * GET
 * gets information of a group
 */
exports.getGroup = async (req, res) => {};
