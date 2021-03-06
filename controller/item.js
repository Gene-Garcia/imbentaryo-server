const { httpStatus } = require("../constants/status");
const {
  runQuery,
  runSelectOne,
  runSelectMany,
} = require("../database/databaseContext");
const { getAuthorizationHeader } = require("../utils/authorizationHelper");
const { generateKey, validateKey } = require("../utils/keyGenerator");

/*
 * POST
 * inserts new item record
 */
exports.insertItem = async (req, res) => {
  console.log("Insert Item");

  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const { name, unit_price, stock, remarks, group_id } = req.body;

    if (!name || unit_price < 0 || !group_id)
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
    INSERT 
    INTO item(
      item_id, 
      name, 
      unit_price, 
      remarks, 
      group_id, 
      date_added,
      account_id)
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `,
      [item_id, name, unit_price, remarks, group_id, Date.now(), accountIdToken]
    );

    if (!isSuccess)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Unable to add new item. Try again, thank you." });

    // if there is stock count upsert inventory
    if (stock >= 0) {
      let inventory_id;
      while (true) {
        inventory_id = await generateKey(name);

        const isPresent = await validateKey(
          inventory_id,
          "inventory_id",
          "inventory"
        );
        if (!isPresent) break;
      }

      // create - always create even if this a 1-to-1 relationship
      // if duplicates are created then that is an issue of error
      const isSuccessInventory = await runQuery(
        `
        INSERT INTO inventory(inventory_id, item_id, quantity, updated, account_id)
        VALUES (?, ?, ?, ?, ?)
        `,
        [inventory_id, item_id, stock, Date.now(), accountIdToken]
      );

      if (!isSuccessInventory)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message:
            "Item " +
            name +
            " has been added but unable to add inventory record for " +
            name +
            ". You may select the item to update its inventory.",
        });
      else
        return res.status(httpStatus.CREATED).json({
          message: `Item ${name} has been added successfully with an inventory record.`,
        });
    } else
      return res.status(httpStatus.CREATED).json({
        message: `Item ${name} has been added successfully without an inventory record.`,
      });
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
exports.getItems = async (req, res) => {
  console.log("Get Items");

  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const items = await runSelectMany(
      ` 
        SELECT 
          item.item_id, 
          name, 
          quantity, 
          updated, 
          item.account_id
        FROM item
        LEFT JOIN inventory
          ON item.item_id = inventory.item_id
        WHERE 
          item.account_id = ?
      `,
      [accountIdToken]
    );

    return res.status(httpStatus.OK).json([...items]);
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message });
  }
};

/*
 * GET
 * gets all items that belongs to a specific
 * item group
 */
exports.getItemsOfGroup = async (req, res) => {
  console.log("Get Items of Group");
  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const { itemGroupId } = req.params;

    if (!itemGroupId)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Item group Id is missing" });

    const items = await runSelectMany(
      ` 
        SELECT 
          item.item_id, 
          name, 
          quantity, 
          updated, 
          item.group_id
        FROM item
        LEFT JOIN inventory
            ON item.item_id = inventory.item_id
        WHERE 
          item.group_id = ?
        AND
          item.account_id = ?
      `,
      [itemGroupId, accountIdToken]
    );

    return res.status(httpStatus.OK).json([...items]);
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message });
  }
};

/*
 * GET
 * gets record of item_id
 * it can include item_group and inventory info if stated
 */
exports.getItem = async (req, res) => {
  console.log("Get Item");

  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const { itemId } = req.params;

    if (!itemId)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Item Id is missing. Try again." });

    const inventory = await runSelectOne(
      `
      SELECT 
        item.item_id AS item_id, 
        item.group_id AS group_id, 
        inventory_id, 
        item.name as name, group_name, item.remarks as remarks, 
        quantity, unit_price, 
        updated, date_added
      FROM item
      INNER JOIN item_group
        ON item.group_id = item_group.group_id
      LEFT JOIN inventory 
        ON item.item_id = inventory.item_id
      WHERE 
        item.item_id = ?
      AND
        item.account_id = ?
      `,
      [itemId, accountIdToken]
    );

    if (!inventory)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Item not found. Try again." });

    return res.status(httpStatus.OK).json({ ...inventory });
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/*
 * DELETE
 * deletes an item as well as its connected inventory record, if there is a record
 */
exports.deleteItemInventory = async (req, res) => {
  console.log("Delete Item Inventory");

  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const { itemId } = req.params;

    if (!itemId)
      return res.status(httpStatus.NOT_ALLOWED).json({
        message: "Item id of item to be deleted is missing. Try again.",
      });

    // validate if existing
    const item = await runSelectOne(
      `
      SELECT 
        item_id
      FROM item
      WHERE
        item_id = ?
      AND
        account_id = ?
      `,
      [itemId, accountIdToken]
    );

    if (!item)
      return res.status(httpStatus.NOT_FOUND).json({
        message: "This item is not existing, thus, cannot be deleted.",
      });

    // delete inventory
    const deleteInventoryRes = await runQuery(
      `
      DELETE FROM inventory
      WHERE
        item_id = ?
      AND
        account_id = ?
      `,
      [itemId, accountIdToken]
    );

    if (!deleteInventoryRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          "Deleting this item was stopped because something went wrong in deleting its inventory. Try again.",
      });

    // delete item
    const deleteItemRes = await runQuery(
      `
      DELETE FROM item
      WHERE
        item_id = ?
      AND
        account_id = ?
      `,
      [itemId, accountIdToken]
    );

    if (!deleteItemRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          "Something went wrong in deleting this item but its inventory was already deleted. Try again.",
      });

    return res.status(httpStatus.OK).json({
      message: "This item and its inventory has been deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
