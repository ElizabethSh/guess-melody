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

type GenreQuestionAnswer = {
  genre: string;
  src: string;
};

export type GenreQuestion = {
  answers: GenreQuestionAnswer[];
  genre: string;
  type: 'genre';
};


export type Question = ArtistQuestion | GenreQuestion;
export type Questions = Question[];
export type UserArtistQuestionAnswer = string;
export type UserGenreQuestionAnswer = readonly boolean [];
export type UserAnswer = UserArtistQuestionAnswer | UserGenreQuestionAnswer;

