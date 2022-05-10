-- INSERT INTO item_group(group_id, group_name) VALUES("", "")

-- INSERT INTO item(item_id, name, unit_price, group_id, date_added) VALUES("", "", "", "", "")

-- INSERT INTO inventory(inventory_id, item_Id, quantity, updated) VALUES("", "", "", "")

-- SELECT * 
-- FROM item
-- INNER JOIN inventory
-- ON item.item_id = inventory.item_id;

-- SELECT name, group_name, unit_price, date_added
-- FROM item
-- LEFT JOIN item_group
-- ON item.group_id = item_group.group_id