const { httpStatus } = require("../constants/status");
const { generateKey, validateKey } = require("../utils/keyGenerator");
const { runQuery, runMultipleQuery } = require("./databaseContext");

exports.insertAccounts = async (req, res) => {
  try {
    let accounts = [
      {
        ID: "",
        USERNAME: "martinnn",
      },
      {
        ID: "",
        USERNAME: "annajoe",
      },
    ];

    // assign keys
    for (let i = 0; i < accounts.length; i++) {
      let tempId;

      while (true) {
        tempId = await generateKey(accounts[i].USERNAME);

        const isPresent = await validateKey(tempId, "account_id", "account");
        if (!isPresent) break;
      }
      accounts[i].ID = tempId;
    }

    // build array params
    const arrayParams = [];

    accounts.forEach((account) => {
      // [ID, USERNAME]
      arrayParams.push([account.ID, account.USERNAME]);
    });
    console.log(arrayParams);

    const insertRes = await runMultipleQuery(
      `
      INSERT INTO account(account_id, username) VALUES(?, ?)
      `,
      arrayParams
    );

    return res.status(200).json({ insertRes });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.insertGroups = async (req, res) => {
  let groups = [
    {
      ID: "",
      NAME: "Keyboards",
    },
    {
      ID: "",
      NAME: "Mouse",
    },
    {
      ID: "",
      NAME: "Monitors",
    },
    {
      ID: "",
      NAME: "Television",
    },
    {
      ID: "",
      NAME: "System Unit",
    },
  ];

  try {
    // assign keys to each group
    for (let i = 0; i < groups.length; i++) {
      let tempId;

      while (true) {
        tempId = await generateKey(groups[i].NAME);

        const isPresent = await validateKey(tempId, "group_id", "item_group");
        if (!isPresent) break;
      }
      groups[i].ID = tempId;
    }

    // build array params
    const arrayParams = [];

    groups.forEach((group) => {
      // [ID, NAME]
      arrayParams.push([group.ID, group.NAME, "7m861t1n1524rn56i52an"]);
    });
    console.log(arrayParams);

    const insertRes = await runMultipleQuery(
      `
      INSERT INTO item_group(group_id, group_name, account_id) VALUES(?, ?, ?)
      `,
      arrayParams
    );

    return res.status(200).json({ insertRes });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.insertItems = async (req, res) => {
  try {
    const items = [
      {
        ID: "1d45ab36194y7ek5or446",
        NAME: "Logitech Ergonomic",
        GROUP_ID: "d3y250a1610b49orek521",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "1d45ab36194y7ek5or446",
        NAME: "RAKK Ilis RGB Mechanical Keyboard",
        GROUP_ID: "d3y250a1610b49orek521",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "81mom445u4e9s3u56o167",
        NAME: "A4Tech Wired Optical Mouse",
        GROUP_ID: "u145s12muo2e0m5o63402",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "81mom445u4e9s3u56o167",
        NAME: "Razer Wireless Gaming RGB Mouse",
        GROUP_ID: "u145s12muo2e0m5o63402",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "o55644nom19rti19634s7",
        NAME: 'Mi 1C 23" Monitor',
        GROUP_ID: "304mr4s0o53t621o21n5i",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "o55644nom19rti19634s7",
        NAME: 'Asus 1Q412 22" Thin Bezzel Display',
        GROUP_ID: "304mr4s0o53t621o21n5i",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "ie945l6et6i57s3014v51",
        NAME: "Samsung OLED Thin Curved TV",
        GROUP_ID: "3l45es1iiv4042t2e0561",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "95513n6t17e4sm045su6y",
        NAME: "HP Personal Computer Desktop Set",
        GROUP_ID: "ms6tn654u3y120401es52",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "95513n6t17e4sm045su6y",
        NAME: "Asus Gaming RGB Destop",
        GROUP_ID: "ms6tn654u3y120401es52",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
    ];

    // assign id to each item
    for (let i = 0; i < items.length; i++) {
      let tempId;

      while (true) {
        tempId = await generateKey(items[i].NAME);

        const isPresent = await validateKey(tempId, "item_id", "item");
        if (!isPresent) break;
      }

      items[i].ID = tempId;
    }

    // build sql params
    let arrayParams = [];
    items.forEach(({ ID, NAME, GROUP_ID, UNIT_PRICE, DATE_ADDED }) => {
      arrayParams.push([
        ID,
        NAME,
        UNIT_PRICE,
        GROUP_ID,
        DATE_ADDED,
        "7m861t1n1524rn56i52an",
      ]);
    });

    const insertRes = await runMultipleQuery(
      `INSERT INTO item(item_id, name, unit_price, group_id, date_added, account_id) VALUES(?, ?, ?, ?, ?, ?)`,
      arrayParams
    );

    return res.status(200).json({ insertRes });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.insertInventory = async (req, res) => {
  try {
    let inventories = [
      {
        ID: "",
        ITEM_ID: "l4i2t7o0h017150g64c5e",
        QTY: Math.floor(Math.random() * 500) + 1,
        UPDATED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        ITEM_ID: "4i0ki6125sl1570ark574",
        QTY: Math.floor(Math.random() * 500) + 1,
        UPDATED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        ITEM_ID: "21647c04iw1h5ae6574t0",
        QTY: Math.floor(Math.random() * 500) + 1,
        UPDATED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        ITEM_ID: "r17a6iw154ze020754rr7",
        QTY: Math.floor(Math.random() * 500) + 1,
        UPDATED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        ITEM_ID: "0508as454qs11u2714716",
        QTY: Math.floor(Math.random() * 500) + 1,
        UPDATED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
    ];

    // assign ids
    for (let i = 0; i < inventories.length; i++) {
      let tempId;

      while (true) {
        tempId = await generateKey(
          inventories[i].ITEM_ID + inventories[i].UPDATED
        );

        const isPresent = await validateKey(
          tempId,
          "inventory_id",
          "inventory"
        );
        if (!isPresent) break;
      }

      inventories[i].ID = tempId;
    }

    // build sql command
    let arrayParams = [];
    inventories.forEach(({ ID, ITEM_ID, QTY, UPDATED }) => {
      arrayParams.push([ID, ITEM_ID, QTY, UPDATED, "7m861t1n1524rn56i52an"]);
    });

    const insertRes = await runMultipleQuery(
      `INSERT INTO inventory(inventory_id, item_Id, quantity, updated, account_id) VALUES(?, ?, ?, ?, ?)`,
      arrayParams
    );

    return res.status(httpStatus.CREATED).json({ insertRes });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
