const express = require("express");

const { graphql } = require("graphql");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");

const { getSpeakerById, getTalkById } = require("./data");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");

const PORT = 3000;

const SpeakerType = new GraphQLObjectType({
  name: "speaker",
  fields: function() {
    return {
      id: {
        type: GraphQLID
      },
      name: {
        type: GraphQLString
      }
    };
  }
});

const TalkType = new GraphQLObjectType({
  name: "talk",
  fields: function() {
    return {
      id: {
        type: GraphQLID
      },
      title: {
        type: GraphQLString
      },
      speaker: {
        type: SpeakerType,
        resolve: ({ speaker }) => getSpeakerById(speaker)
      }
    };
  }
});

const queryType = new GraphQLObjectType({
  name: "TechFrulle",
  fields: () => ({
    speaker: {
      type: SpeakerType,
      args: {
        id: {
          description: "id of the speaker",
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (root, { id }) => getSpeakerById(id)
    },
    talk: {
      type: TalkType,
      args: {
        id: {
          description: "id of the talk",
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (root, { id }) => getTalkById(id)
    }
  })
});

const app = express();

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: new GraphQLSchema({
      query: queryType
    }),
    graphiql: true
  })
);

const server = app.listen(PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("GraphQL listening at http://%s:%s", host, port);
});
