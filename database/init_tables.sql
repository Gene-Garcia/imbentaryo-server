CREATE TABLE item_group (
    group_id TEXT PRIMARY KEY,
    group_name TEXT NOT NULL,
    remarks TEXT
);

CREATE TABLE item (
    item_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit_price INTEGER,
    remarks TEXT,
    group_id TEXT NOT NULL,
    date_added TEXT NOT NULL,

    FOREIGN KEY(group_id) REFERENCES item_group(group_id)
);

CREATE TABLE inventory (
    inventory_id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    updated TEXT NOT NULL,

    FOREIGN KEY(item_id) REFERENCES item(item_id)
);