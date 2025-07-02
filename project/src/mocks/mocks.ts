import { faker } from '@faker-js/faker';
import { GameType } from '@settings';

import { ArtistQuestion, GenreQuestion } from 'types/question';

export const makeFakeArtistQuestion = (): ArtistQuestion =>
  ({
    type: GameType.Artist,
    song: {
      artist: faker.person.fullName(),
      src: faker.system.directoryPath(),
    },
    answers: new Array(3).fill(null).map(() => ({
      picture: faker.image.avatar(),
      artist: faker.person.fullName(),
    })),
  }) as ArtistQuestion;

export const makeFakeGenreQuestion = (): GenreQuestion =>
  ({
    type: GameType.Genre,
    genre: faker.music.genre(),
    answers: new Array(4).fill(null).map(() => ({
      src: faker.system.directoryPath(),
      genre: faker.music.genre(),
    })),
  }) as GenreQuestion;
