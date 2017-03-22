'use strict';

const findById = (fbid, sessionStore) => {
    for(let [key, value] of sessionStore) {
        if(value.fbid === fbid) {
            return key;
        }
    }
}

const fetchEntity = (entities, entity) => {
    const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;

    if(!val) {
        return null;
    } else {
        return typeof val === 'object' ? val.value : val;
    }
}

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

module.exports = {
    findById,
    fetchEntity,
    createResponse
}
