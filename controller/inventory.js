const { httpStatus } = require("../constants/status");

exports.test = async (req, res) => {
  return res.status(httpStatus.OK).json({ data: "succ" });
};
