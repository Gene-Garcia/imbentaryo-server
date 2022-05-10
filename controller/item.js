const { httpStatus } = require("../constants/status");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK);
};

/*
 * POST
 * inserts new item record
 */
exports.insertItem = async (req, res) => {};

/*
 * GET
 * gets all items.
 * it can include item_group and inventory info if stated
 */
exports.getItems = async (req, res) => {};

/*
 * GET
 * gets record of item_id
 * it can include item_group and inventory info if stated
 */
exports.getItem = async (req, res) => {};
