/*
 * This is a helper to obtain the authorization bearer
 * header sent in requests. Its value contains the account id.
 */
exports.getAuthorizationHeader = (authorization) => {
  // its format is "Bearear {value}"
  const data = authorization.split(" ");
  return data[1];
};
