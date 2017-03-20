'use strict';

const request = require('request');

const getInfo = data => {
    let intent = data.entities.intent[0].value || 'movieInfo';
    let movie = data.entities.movie && data.entities.movie[0].value || null;
    let releaseYear = data.entities.releaseYear && data.entities.releaseYear[0].value || null;
    return new Promise((resolve, reject) => {
        if(movie) {
            // Fetch data from OMDB
            request({
                uri: "http://www.omdbapi.com",
                qs: {
                    t: movie,
                    plot: 'short',
                    y: releaseYear,
                    r: 'json'
                },
                method: 'GET'
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    resolve(JSON.parse(body))
                } else {
                    reject(error);
                }
            });
            resolve("Finding details about ${movie}");
        } else {
            reject("Entities not found");
        }
    });
}

module.exports = getInfo;