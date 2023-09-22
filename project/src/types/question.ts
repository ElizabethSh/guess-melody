type GenreQuestionAnswer = {
  genre: string;
  src: string;
};

export type GenreQuestion = {
  answers: GenreQuestionAnswer[];
  genre: string;
  type: 'genre';
};

type ArtistQuestionAnswer = {
  artist: string;
  picture: string;
};

type Song = {
  artist: string;
  src: string;
}

export type ArtistQuestion = {
  answers: ArtistQuestionAnswer[];
  song: Song;
  type: 'artist';
};

// combining types ArtistQuestion and GenreQuestion
export type Question = ArtistQuestion | GenreQuestion;

export type Questions = Question[];

export type UserGenreQuestionAnswer = readonly (boolean | string) [];

// export type UserArtistQuestionAnswer = string;
