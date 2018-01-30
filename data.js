import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";

const events = [
  {
    id: 1,
    date: '2017-09-08',
    talks: [1, 2]
  },
  {
    id: 2,
    date: '2017-10-13',
    talks: [3, 4]
  },
  {
    id: 3,
    date: '2017-11-10',
    talks: [5, 6]
  },
  {
    id: 4,
    date: '2017-12-05',
    talks: [7, 8]
  },
  {
    id: 5,
    date: '2018-01-12',
    talks: [9, 10]
  },
];

const speakers = [
  {
    id: 1,
    name: 'Jonatan Elsgard',
  },
  {
    id: 2,
    name: 'Roger Stoltz',
  },
  {
    id: 3,
    name: 'Johan Torin',
  },
  {
    id: 4,
    name: 'Jörgen Buder',
  },
  {
    id: 5,
    name: 'Birgitta Möller',
  },
  {
    id: 6,
    name: 'Henrik Lernmark',
  },
  {
    id: 7,
    name: 'Marcus Wendel',
  },
  {
    id: 8,
    name: 'Granit Demiraj',
  },
  {
    id: 9,
    name: 'Johan Strömhage',
  },
];

const talks = [
  {
    id: 1,
    event: 1,
    title: 'An easy-to-digest awk introduction',
    speaker: 1,
  },
  {
    id: 2,
    event: 1,
    title: 'Cross platform game development with libGDX',
    speaker: 2,
  },
  {
    id: 3,
    event: 2,
    title: 'OpenBSD, Security and me',
    speaker: 3,
  },
  {
    id: 4,
    event: 2,
    title: 'Neural networks, theory and practice',
    speaker: 4,
  },
  {
    id: 5,
    event: 3,
    title: 'LinkedIn',
    speaker: 5,
  },
  {
    id: 6,
    event: 3,
    title: 'AWS Serverless Backend',
    speaker: 6,
  },
  {
    id: 7,
    event: 4,
    title: 'React.js - Basic introduction',
    speaker: 7,
  },
  {
    id: 8,
    event: 4,
    title: 'Voice Recognition with JavaScript',
    speaker: 8,
  },
  {
    id: 9,
    title: 'AWS Partner Portal, AWS strategi',
    speaker: 9,
    event: 5,
  },
  {
    id: 10,
    event: 5,
    title: 'AWS Lambda',
    speaker: 6,
  }
];

const talksBySpeaker = groupBy(talks, "speaker");
const talksByEvent = groupBy(talks, "event");
const talksById = keyBy(talks, "id");
const speakersById = keyBy(speakers, "id");
const eventsById = keyBy(events, "id");

export { events, speakers, talks };
export const getTalksBySpeaker = speakerId => talksBySpeaker[speakerId];
export const getTalksByEvents = eventId => talksByEvent[eventId];
export const getTalkById = id => talksById[id];
export const getSpeakerById = id => speakersById[id];
export const getEventById = id => eventsById[id];
