const express = require("express");

const { graphql } = require("graphql");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");

const uniq = require("lodash/uniq");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");

const {
  events,
  speakers,
  talks,
  getTalkById,
  getSpeakerById,
  getEventById,
  getEventsBySpeaker,
  getTalksBySpeaker,
  getEventByTalk,
} = require("./data");

const SpeakerType = new GraphQLObjectType({
  name: "speaker",
  description: "a speaker at a TechFrulle event",
  fields: function() {
    return {
      id: {
        type: GraphQLID
      },
      name: {
        type: GraphQLString
      },
      events: {
        type: new GraphQLList(EventType),
        resolve: ({ id }) => getEventsBySpeaker(id)
      },
      talks: {
        type: new GraphQLList(TalkType),
        resolve: ({ id }) => getTalksBySpeaker(id)
      }
    };
  }
});

const EventType = new GraphQLObjectType({
  name: "event",
  description: "the monthly TechFrulle event",
  fields: function() {
    return {
      id: {
        type: GraphQLID
      },
      date: {
        type: GraphQLString
      },
      talks: {
        type: new GraphQLList(TalkType),
        resolve: ({ talks }) => talks.map(id => getTalkById(id))
      },
      speakers: {
        type: new GraphQLList(SpeakerType),
        resolve: ({ talks }) => {
          const speakersIds = uniq(talks.map(id => getTalkById(id).speaker));
          const speakers = speakersIds.map(id => getSpeakerById(id));
          return speakers;
        }
      }
    };
  }
});

const TalkType = new GraphQLObjectType({
  name: "talk",
  description: "a TechFrulle talk",
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
      },
      event: {
        type: EventType,
        resolve: ({ id }) => getEventByTalk(id)
      }
    };
  }
});

const queryType = new GraphQLObjectType({
  name: "TechFrulleQueries",
  description: "all queries you can do on the TechFrulle API",
  fields: function() {
    return {
      event: {
        type: EventType,
        args: {
          id: {
            description: "id of the event",
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: (root, { id }) => getEventById(id)
      },
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
      speakers: {
        type: new GraphQLList(SpeakerType),
        resolve: () => speakers
      },
      talks: {
        type: new GraphQLList(TalkType),
        resolve: () => talks
      },
      events: {
        type: new GraphQLList(EventType),
        resolve: () => events
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
      },
    };
  }
});

const schema = new GraphQLSchema({
  query: queryType
});

let app = express();
let PORT = 4005;

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
