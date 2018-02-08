const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve: () => "Hello world!"
      }
    })
  })
});

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);
app.listen(4002, function() {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
