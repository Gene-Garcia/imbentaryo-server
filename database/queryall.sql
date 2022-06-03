select 
    item.account_id,
    username,
    item.item_id,
    name,
    item.group_id,
    group_name,
    inventory_id,
    quantity
from item
inner join account
    on account.account_id = item.account_id
inner join item_group 
    on item.group_id = item_group.group_id
left join inventory
    on inventory.item_id = item.item_id;
