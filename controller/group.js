const { httpStatus } = require("../constants/status");
const {
  runSelectMany,
  runQuery,
  runSelectOne,
  runMultipleQuery,
} = require("../database/databaseContext");
const { generateKey, validateKey } = require("../utils/keyGenerator");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK);
};

/*
 * POST
 * creates a new item group
 */
exports.insertGroup = async (req, res) => {
  console.log(req.body);
  try {
    const { group_name: name, remarks } = req.body;

    if (!name)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ error: "Item group name is required" });

    // generated id
    let group_id;
    while (true) {
      group_id = await generateKey(name);

      const isPresent = await validateKey(group_id, "group_id", "item_group");
      if (!isPresent) break;
    }

    const status = await runQuery(
      `INSERT INTO item_group(group_id, group_name, remarks) VALUES(?, ?, ?)`,
      [group_id, name, remarks]
    );

    if (!status)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Unable to insert item group ${name}. Try again, thank you.`,
      });

    return res
      .status(httpStatus.CREATED)
      .json({ message: `Item group ${name} added successfully` });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/*
 * GET
 * gets all available groups
 */
exports.getGroups = async (req, res) => {
  try {
    const groups = await runSelectMany(
      `SELECT group_id, group_name FROM item_group`,
      []
    );

    return res.status(httpStatus.OK).json([...groups]);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/*
 * GET
 * gets information of a group
 */
exports.getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!groupId)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Group Id is missing" });

    const group = await runSelectOne(
      `
      SELECT * FROM item_group
      WHERE group_id = ?
      `,
      [groupId]
    );

    if (!group)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: `Item group with Id ${groupId} not found` });

    return res.status(httpStatus.OK).json({ ...group });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/*
 * PATCH
 * updates an item_group record based on group_id
 */
exports.updateGroup = async (req, res) => {
  try {
    console.log(req.body);
    const { group_id: id, group_name: name, remarks } = req.body;

    if (!id || !name)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Group Id and group name is missing" });

    // validate and find the ite group first
    const group = await runSelectOne(
      `SELECT group_id FROM item_group WHERE group_id = ?`,
      [id]
    );
    if (!group)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Item group to update was not found. Try again." });

    const updateRes = await runQuery(
      `
      UPDATE item_group
      SET
        group_name = ?,
        remarks = ?
      WHERE
        group_id = ?
      `,
      [name, remarks, id]
    );

    if (!updateRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong in updating this item group. Try again.",
      });

    return res
      .status(httpStatus.OK)
      .json({ message: `Item group ${name} has been updated successfully/` });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

/*
 * DELETE
 * deletes an item group based on group id
 */
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Group Id of group to delete is missing" });

    // find group first
    const group = await runSelectOne(
      `SELECT group_id FROM item_group WHERE group_id = ?`,
      [groupId]
    );
    if (!group)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Item group to update was not found. Try again." });

    // delete
    const deleteInventoryRes = await runQuery(
      `
        DELETE FROM inventory
        WHERE
          item_id IN (
            SELECT
              item_id
            FROM item
            WHERE
              group_id = ?
          )
      `,
      [groupId]
    );
    if (!deleteInventoryRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          "Something went wrong in deleting inventory record of items under this item group",
      });

    const deleteItemRes = await runQuery(
      `
        DELETE FROM item
        WHERE
          group_id = ?
      `,
      [groupId]
    );
    if (!deleteItemRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong in deleting items under this item group",
      });

    const deleteGroupRes = await runQuery(
      `
        DELETE FROM item_group
        WHERE
          group_id = ?
      `,
      [groupId]
    );

    if (!deleteGroupRes)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Unable to delete this group. Try again" });

    return res.status(httpStatus.OK).json({
      message:
        "This item group has been deleted along with its items and items' inventory records",
    });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
