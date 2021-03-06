const { httpStatus } = require("../constants/status");
const { runQuery, runSelectOne } = require("../database/databaseContext");
const { validateKey, generateKey } = require("../utils/keyGenerator");

/*
 * POST
 * Makes database query to validate credentials
 */
exports.loginUser = async (req, res) => {
  console.log("Login User");

  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Username and password is required." });

    // get record
    const account = await runSelectOne(
      `
        SELECT
            username, account_id
        FROM account
        WHERE
            username = ?
            AND
            password = ?
        `,
      [username, password]
    );

    if (!account)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Incorrect username or password" });

    return res
      .status(httpStatus.OK)
      .json({ message: "Accepted credentials", ...account });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

/*
 * POST
 * Post/saves credentials of user
 */
exports.signUpUser = async (req, res) => {
  console.log("Sign Up User");

  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(httpStatus.NOT_ALLOWED)
        .json({ message: "Username and password is required." });

    // generate id
    let id;
    while (true) {
      id = await generateKey(username);

      const isPresent = await validateKey(id, "account_id", "account");
      if (!isPresent) break;
    }

    // check if username is existing
    const record = await runSelectOne(
      `
        SELECT account_id FROM account WHERE username = ?
        `,
      [username]
    );
    if (record)
      return res.status(httpStatus.NOT_ALLOWED).json({
        message: `${username} is already existing. Use another one and try again.`,
      });

    // save credentials
    const insertRes = await runQuery(
      `
        INSERT INTO 
        account(
            account_id, 
            username, 
            password
            )
        VALUES(
            ?, ?, ?
        )
        `,
      [id, username, password]
    );

    if (!insertRes)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong in saving your account. Try again.",
      });

    return res
      .status(httpStatus.CREATED)
      .json({ message: "Account created successfully." });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
