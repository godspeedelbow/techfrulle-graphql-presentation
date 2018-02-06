const express = require("express");

const { graphql } = require("graphql");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");

const uniq = require("lodash/uniq");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");

const {
  events,
  talks,
  speakers,
  getTalkById,
  getSpeakerById,
  getEventById,
  getEventsBySpeaker,
  getTalksBySpeaker,
  addSpeaker,
  updateSpeaker,
  deleteSpeaker,
  addTalk,
  updateTalk,
  deleteTalk,
  addEvent,
  updateEvent,
  deleteEvent
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

const SpeakerInputType = new GraphQLInputObjectType({
  name: "speakerInput",
  description: "speaker details",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
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
        resolve: ({ event }) => getEventById(event)
      }
    };
  }
});

const TalkInputType = new GraphQLInputObjectType({
  name: "talkInput",
  description: "talk details",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    speaker: { type: new GraphQLNonNull(GraphQLInt) }
  })
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

const EventInputType = new GraphQLInputObjectType({
  name: "eventInput",
  description: "event details",
  fields: () => ({
    date: { type: new GraphQLNonNull(GraphQLString) },
    talks: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))) }
  })
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
      events: {
        type: new GraphQLList(EventType),
        resolve: () => events
      },
      speaker: {
        type: SpeakerType,
        args: {
          id: {
            description: "id of the speaker",
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: (root, { id }) => {
          console.log('*** id', id);
          const e = getSpeakerById(id);
          console.log('*** e', e);
          return e;
        }
      },
      speakers: {
        type: new GraphQLList(SpeakerType),
        resolve: () => speakers
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
      talks: {
        type: new GraphQLList(TalkType),
        resolve: () => talks
      }
    };
  }
});

const mutationType = new GraphQLObjectType({
  name: "TechFrulleMutations",
  description: "yes, we can!",
  fields: () => ({
    addSpeaker: {
      type: SpeakerType,
      description: "Add a speaker",
      args: {
        speaker: { type: SpeakerInputType }
      },
      resolve: (value, { speaker }) => {
        return addSpeaker(speaker);
      }
    },
    addTalk: {
      type: TalkType,
      description: "Add a talk",
      args: {
        talk: { type: TalkInputType }
      },
      resolve: (value, { talk }) => {
        return addTalk(talk);
      }
    },
    addEvent: {
      type: EventType,
      description: "Add a event",
      args: {
        event: { type: EventInputType }
      },
      resolve: (value, { event }) => {
        return addEvent(event);
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

let app = express();
let PORT = 4000;

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
