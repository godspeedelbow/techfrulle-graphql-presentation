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
  getTalkById,
  getSpeakerById,
  getEventById,
  getEventsBySpeaker,
  getTalksBySpeaker
} = require("./data");

const SpeakerType = new GraphQLObjectType({
  name: "speaker",
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

const queryType = new GraphQLObjectType({
  name: "TechFrulle",
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
        resolve: (root, { id }) => getSpeakerById(id)
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

module.exports = new GraphQLSchema({
  query: queryType
});
