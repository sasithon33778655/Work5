export interface  Creator{
    creator_ID : number;
    movie_ID : number;
    person_ID : number;
}

export interface Movie {
    title: string;
    year: number;
    plot: string;
    poster: string;
    genre: string;
}

export interface Person {
    name : string;
    biography: string;
    image: string;
}

export interface  Stars{
    starID : number;
    movie_ID : number;
    person_ID : number;
}