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

exports.insertItems = async () => {
  const items = {
    GROUP_ID: [],
  };

  try {
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
