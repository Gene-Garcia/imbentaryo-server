const { httpStatus } = require("../constants/status");
const { runSelectMany } = require("../database/databaseContext");

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
exports.getGroups = async (req, res) => {
  try {
    console.log("Get Groups");

    const groups = await runSelectMany(
      `SELECT group_id, group_name FROM item_group`,
      []
    );

    return res.status(httpStatus.OK).json([...groups]);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

/*
 * GET
 * gets information of a group
 */
exports.getGroup = async (req, res) => {};
