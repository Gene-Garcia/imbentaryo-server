const { runSelectOne } = require("../database/databaseContext");

/*
 * Generates a key with a combination of shuffled
 * text with current date time in milliseconds
 */
exports.generateKey = (text) => {
  let key = text;

  // removes all whitespaces and converts to lower case
  key = key.replace(/\s/g, "").toLowerCase();

  // repeat key until length is less then 8
  while (key.length < 8) {
    key = key + key;
  }

  // extract only 8 characters
  key = key.substring(0, 8);

  const now = new Date(); //Fri Jul 24 2020 11:41:49 GMT+0530 (India Standard Time)
  const nowIso = now.toISOString(); //"2020-07-24T06:11:49.911Z"
  // in milliseconds
  const inMs = Date.parse(nowIso); //1595571109911

  key = shuffle(key + inMs);
  return key;
};

const shuffle = (text) => {
  const shuffled = text
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return shuffled;
};

/*
 * Makes database request just to validate if there is
 * record in the database
 *
 * @returns true if not unique, false if unique
 */
exports.validateKey = async (key, idColumnName, table) => {
  const tbl = table.replace(/\s/g, "");
  const col = idColumnName.replace(/\s/g, "");

  const result = await runSelectOne(
    `SELECT ${col} FROM ${tbl} WHERE ${col} = (?)`,
    [key]
  );

  return result ? true : false;
};
