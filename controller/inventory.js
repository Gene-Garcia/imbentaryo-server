const { httpStatus } = require("../constants/status");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK).json({ data: "succ" });
};

/*
 * POST or PATCH
 * updates or inserts record of an item_id with new quantity
 */
exports.upsertInventory = async (req, res) => {};

/*
 * GET
 * gets inventory of an item_id
 */
exports.getItemInventory = async (req, res) => {};
