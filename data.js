const keyBy = require("lodash/keyBy");
const groupBy = require("lodash/groupBy");

const speakers = [
  {
    id: '0',
    name: "Jonatan Elsgard"
  },
  {
    id: '1',
    name: "Roger Stoltz"
  },
  {
    id: '2',
    name: "Johan Torin"
  },
  {
    id: '3',
    name: "Jörgen Buder"
  },
  {
    id: '4',
    name: "Birgitta Möller"
  },
  {
    id: '5',
    name: "Henrik Lernmark"
  },
  {
    id: '6',
    name: "Marcus Wendel"
  },
  {
    id: '7',
    name: "Granit Demiraj"
  },
  {
    id: '8',
    name: "Johan Strömhage"
  }
];

const talks = [
  {
    id: '0',
    title: "An easy-to-digest awk introduction",
    speaker: '0'
  },
  {
    id: '1',
    title: "Cross platform game development with libGDX",
    speaker: '1'
  },
  {
    id: '2',
    title: "OpenBSD, Security and me",
    speaker: '2'
  },
  {
    id: '3',
    title: "Neural networks, theory and practice",
    speaker: '3'
  },
  {
    id: '4',
    title: "LinkedIn",
    speaker: '4'
  },
  {
    id: '5',
    title: "AWS Serverless Backend",
    speaker: '5'
  },
  {
    id: '6',
    title: "React.js - Basic introduction",
    speaker: '6'
  },
  {
    id: '7',
    title: "Voice Recognition with JavaScript",
    speaker: '7'
  },
  {
    id: '8',
    title: "AWS Partner Portal, AWS strategi",
    speaker: '8'
  },
  {
    id: '9',
    title: "AWS Lambda",
    speaker: '5'
  }
];

const events = [
  {
    id: '0',
    date: "2017-09-08",
    talks: ['0', '1']
  },
  {
    id: '1',
    date: "2017-10-13",
    talks: ['2', '3']
  },
  {
    id: '2',
    date: "2017-11-10",
    talks: ['4', '5']
  },
  {
    id: '3',
    date: "2017-12-05",
    talks: ['6', '7']
  },
  {
    id: '4',
    date: "2018-01-12",
    talks: ['8', '9']
  }
];

const talksById = keyBy(talks, "id");
const speakersById = keyBy(speakers, "id");
const eventsById = keyBy(events, "id");

const talksBySpeaker = groupBy(talks, "speaker");
const talksByEvent = groupBy(talks, "event");

module.exports = {
  events,
  speakers,
  talks,
  getTalksBySpeaker: speakerId => talksBySpeaker[speakerId],
  getTalksByEvent: eventId => talksByEvent[eventId],
  getTalkById: talkId => talks.find(({ id }) => talkId === id),
  getSpeakerById: speakerId => speakers.find(({ id }) => speakerId === id),
  getEventById: eventId => events.find(({ id }) => eventId === id),
  getEventByTalk: event => events.find(({ talks }) => talks.includes(event)),
  addSpeaker: ({ name }) => {
    const id = speakers.length.toString();
    const speaker = {
      id,
      name
    };
    speakers.push(speaker);
    return speaker;
  },
  addTalk: ({ title, speaker }) => {
    const id = talks.length.toString();
    const talk = {
      id,
      title,
      speaker
    };
    talks.push(talk);
    return talk;
  },
  addEvent: ({ date, talks }) => {
    const id = events.length.toString();
    const event = {
      id,
      date,
      talks
    };
    events.push(event);
    console.log("*** events", events);
    return event;
  }
};
