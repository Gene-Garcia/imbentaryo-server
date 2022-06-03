const { httpStatus } = require("../constants/status");
const { runQuery, runSelectOne } = require("../database/databaseContext");
const { getAuthorizationHeader } = require("../utils/authorizationHelper");
const { validateKey, generateKey } = require("../utils/keyGenerator");

/*
 * PATCH
 * Updates all data field of item and inventory
 */
exports.updateItemInventory = async (req, res) => {
  console.log("Update Item Inventory");

  try {
    const accountIdToken = getAuthorizationHeader(req.headers.authorization);

    const { inventory, item } = req.body;

    if (!item.item_id || !item.name || !item.group_id)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Incomplete item details" });

    let inventory_id = inventory.inventory_id;
    if (!inventory_id) {
      /*
       * there might be instances when no inventory id is sent, maybe due to error.
       * it could mean 2 things
       * 1. No inventory record
       * 2. With inventory record but did not send the id
       *
       * So we need to check with the database first to get the inventory id
       * so that no new additional inventory record will be created
       */
      const inventoryRecord = await runSelectOne(
        `
        SELECT 
          inventory_id 
        FROM 
          inventory 
        WHERE 
          item_id = ?
        AND
          inventory.account_id = ?
        `,
        [item.item_id, accountIdToken]
      );

      if (inventoryRecord) {
        // use the recently queried inventory id
        inventory_id = inventoryRecord.inventory_id;
      } else {
        // create new inventory id
        while (true) {
          inventory_id = await generateKey(item.name);

          const isPresent = await validateKey(
            inventory_id,
            "inventory_id",
            "inventory"
          );
          if (!isPresent) break;
        }
      }
    }

    // upsert inventory
    const upsertInventoryRes = await runQuery(
      `
      REPLACE INTO 
        inventory(
          inventory_id, 
          item_id, 
          quantity, 
          updated,
          account_id)
      VALUES(?, ?, ?, ?, ?)
      `,
      [
        inventory_id,
        item.item_id,
        inventory.quantity,
        Date.now(),
        accountIdToken,
      ]
    );

    if (!upsertInventoryRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Unable to update inventory of item. Try again, thank you.",
      });

    let parsedUnitPrice = 0;
    try {
      parsedUnitPrice = parseFloat(item.unit_price);
    } catch (e) {}

    // update item
    const updateItemRes = await runQuery(
      `
      UPDATE item
      SET
        name = ?,
        unit_price = ?,
        remarks = ?,
        group_id = ?
      WHERE 
        item_id = ?
      AND
        account_id = ?
      `,
      [
        item.name,
        parsedUnitPrice,
        item.remarks,
        item.group_id,
        item.item_id,
        accountIdToken,
      ]
    );

    if (!updateItemRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          "Failed to update item information but item inventory was updated successfully",
      });

    return res.status(httpStatus.CREATED).json({
      message: `${item.name} and its inventory has been updated successfully`,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: e.message });
  }
};
