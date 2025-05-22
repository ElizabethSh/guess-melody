import { music, system, name, internet } from 'faker';
import { ArtistQuestion, GenreQuestion } from '../types/question';
import { GameType } from '../settings';

export const makeFakeArtistQuestion = (): ArtistQuestion =>
  ({
    type: GameType.Artist,
    song: {
      artist: name.title(),
      src: system.filePath(),
    },
    answers: new Array(3)
      .fill(null)
      .map(() => ({ picture: internet.avatar(), artist: name.title() })),
  }) as ArtistQuestion;

export const makeFakeGenreQuestion = (): GenreQuestion =>
  ({
    type: GameType.Genre,
    genre: music.genre(),
    answers: new Array(4)
      .fill(null)
      .map(() => ({ src: system.filePath(), genre: music.genre() })),
  }) as GenreQuestion;
