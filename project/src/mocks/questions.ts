import { Questions } from '../types/question';

const AVATAR_URL = 'https://i.pravatar.cc/128';

export const questions: Questions = [
  {
    // NOTE: user can select more than one answer
    genre: 'reggae', // right answer
    type: 'genre',
    answers: [
      {
        genre: 'reggae',
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/BWV_543-fugue.ogg',
      },
      {
        genre: 'jazz',
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/BWV_543-fugue.ogg',
      },
      {
        genre: 'rock',
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/BWV_543-fugue.ogg',
      },
      {
        genre: 'disco',
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/BWV_543-fugue.ogg',
      },
    ],
  },
  {
    // NOTE: user can select only one answer
    song: {
      artist: 'Jim Beam', // right answer
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/BWV_543-fugue.ogg',
    },
    type: 'artist',
    answers: [
      {
        artist: 'John Snow',
        picture: `${AVATAR_URL}?rnd=${Math.random()}`,
      },
      {
        artist: 'Jack Daniels',
        picture: `${AVATAR_URL}?rnd=${Math.random()}`,
      },
      {
        artist: 'Jim Beam',
        picture: `${AVATAR_URL}?rnd=${Math.random()}`,
      },
    ],
  },
];
