require("dotenv").config();

// Express - backend web framework to handle http requests and responses
// considered as de facto standard
const express = require("express");

const app = express();

/* Middleware declaration */
// Encodes request to json format
app.use(express.json());

/* Assignment of route to a URI path */
app.use("/v1/item", require("./routes/item"));
app.use("/v1/inventory", require("./routes/inventory"));
app.use("/v1/group", require("./routes/group"));
app.use("/v1/account", require("./routes/account"));
// only used in development, not in production
// app.use("/v1/database", require("./routes/database"));

const PORT = process.env.PORT;

/* Binds this server to a connection based on the host and port */
app.listen(PORT, () =>
  console.log(
    `Server is running and listening to port ${PORT}.\nhttp://localhost:${PORT}`
  )
);
