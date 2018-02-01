const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

let counter = 0;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType
} = require("graphql");

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      counter: {
        type: GraphQLInt,
        resolve: () => counter
      }
    })
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      increase: {
        type: GraphQLInt,
        args: {
          number: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (root, { number }) => (counter += number)
      }
    })
  })
});

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true
  })
);
app.listen(4000, function() {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
