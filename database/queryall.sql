-- SQLite
select * from item
left join item_group 
    on item.group_id = item_group.group_id
left join inventory
    on inventory.item_id = item.item_id