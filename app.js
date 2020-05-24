require("./models/user");
const routes = require("./routes/auth");
const express = require("express");
const app = express();
const { mongoUri } = require("./keys");
const port = 3000;
app.use(express.json());
app.use(routes);

var mongoose = require("mongoose");
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
var db = mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

app.listen(port, () => console.log(`Example app listening on port port!`));
