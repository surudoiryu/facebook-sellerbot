'use strict';

const createResponse = (intent, movie) => {
    if(movie.Response === 'True') {
        let {
            Title,
            Year,
            Plot,
            Director,
            Actors,
            Poster
        } = movie;

        switch(intent) {
            case 'movieInfo': {
                let str = `${Title} (${Year}). Deze film is geregisseerd door ${Director} and gespeeld door ${Actors}. ${Plot}`.substring(0,320);
                return {
                    text: str,
                    image: Poster
                }
            }
            case 'releaseYear': {
                let str = `${Title} is uitgebracht in ${Year}.`;
                return {
                    text: str,
                    image: null
                }
            }

            case 'director': {
                let str = `${Title} (${Year}) is geregisseerd door ${Director}`;
                return {
                    text: str,
                    image: null
                }
            }
            default: {
                return {
                    text: "Altijd van dienst :)",
                    image: null
                }
            }
        }
    } else {
        return {
            text: "Ik weet niet wat je bedoeld...",
            image: null
        }
    }
}

module.exports = createResponse;