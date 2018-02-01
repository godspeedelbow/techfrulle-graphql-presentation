const express = require("express");

const { graphql } = require("graphql");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");

const schema = require("./schema");

let app = express();
let PORT = 3000;

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const server = app.listen(PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("GraphQL listening at http://%s:%s", host, port);
});
