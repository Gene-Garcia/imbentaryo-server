const res = require("express/lib/response");
const { httpStatus } = require("../constants/status");
const { generateKey, validateKey } = require("../utils/keyGenerator");
const { runQuery, runMultipleQuery } = require("./databaseContext");

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
      arrayParams.push([group.ID, group.NAME]);
    });
    console.log(arrayParams);

    const insertRes = await runMultipleQuery(
      `
      INSERT INTO item_group(group_id, group_name) VALUES(?, ?)
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
        ID: "",
        NAME: "Logitech Ergonomic",
        GROUP_ID: "2d4k951o3961ae5r63y4b",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        NAME: "RAKK Ilis RGB Mechanical Keyboard",
        GROUP_ID: "2d4k951o3961ae5r63y4b",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "",
        NAME: "A4Tech Wired Optical Mouse",
        GROUP_ID: "3u165moo93usm41e69502",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        NAME: "Razer Wireless Gaming RGB Mouse",
        GROUP_ID: "3u165moo93usm41e69502",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "",
        NAME: 'Mi 1C 23" Monitor',
        GROUP_ID: "m1o3o6ni946t315sr1952",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        NAME: 'Asus 1Q412 22" Thin Bezzel Display',
        GROUP_ID: "m1o3o6ni946t315sr1952",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "",
        NAME: "Samsung OLED Thin Curved TV",
        GROUP_ID: "i51v2e63l9ie6ts915432",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },

      {
        ID: "",
        NAME: "HP Personal Computer Desktop Set",
        GROUP_ID: "sys95u2435336t1en1m69",
        UNIT_PRICE: Math.floor(Math.random() * 905001) + 5000,
        DATE_ADDED: new Date(
          2022,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31) + 1
        ),
      },
      {
        ID: "",
        NAME: "Asus Gaming RGB Destop",
        GROUP_ID: "sys95u2435336t1en1m69",
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
      arrayParams.push([ID, NAME, UNIT_PRICE, GROUP_ID, DATE_ADDED]);
    });

    const insertRes = await runMultipleQuery(
      `INSERT INTO item(item_id, name, unit_price, group_id, date_added) VALUES(?, ?, ?, ?, ?)`,
      arrayParams
    );

    return res.status(200).json({ insertRes });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.insertInventory = async () => {
  const itemIds = [];

  try {
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
