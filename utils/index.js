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
        }
    } else {
        return {
            text: "Ik weet niet wat je bedoeld...",
            image: null
        }
    }
}

module.exports = createResponse;