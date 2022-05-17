const { httpStatus } = require("../constants/status");
const { runQuery, runSelectOne } = require("../database/databaseContext");
const { generateKey, validateKey } = require("../utils/keyGenerator");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK);
};

/*
 * POST
 * inserts new item record
 */
exports.insertItem = async (req, res) => {
  try {
    const { name, unit_price, remarks, group_id } = req.body;

    if (!name || !unit_price || !group_id)
      return res.status(httpStatus.NOT_ALLOWED).json({
        message: "Incomplete item information. Try again, thank you.",
      });

    // validate if group_id is existing
    const group = await runSelectOne(
      `SELECT group_name FROM item_group WHERE group_id = ?`,
      [group_id]
    );

    if (!group)
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Invalid item group. Cannot be found. Try again, thank you",
      });

    // create id
    let item_id;
    while (true) {
      item_id = await generateKey(name);

      const isPresent = await validateKey(item_id, "item_id", "item");
      if (!isPresent) break;
    }

    // sql insert
    const isSuccess = await runQuery(
      `
    INSERT INTO item(item_id, name, unit_price, remarks, group_id, date_added)
    VALUES(?, ?, ?, ?, ?, ?)
    `,
      [item_id, name, unit_price, remarks, group_id, Date.now()]
    );

    if (!isSuccess)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Unable to add new item. Try again, thank you." });

    return res
      .status(httpStatus.CREATED)
      .json({ message: `Item ${name} has been added successfully.` });
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message });
  }
};

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
