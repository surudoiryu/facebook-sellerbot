'use strict';

const MongoDB = require('mongodb').MongoClient
    , assert = require('assert');

const {MONGO_URI} = require('../config');

const mongodb = {
    test: () => {
        MongoDB.connect(MONGO_URI, function (err, db) {
            assert.equal(null, err);
            console.log("Connected to the MongoDB server");

            db.close();
            return err;
        });
    },
    get: (type, color, model) => {

        let tst = MongoDB.connect(MONGO_URI)
            .then(db => db.collection('phoneCases'))
            .then(phoneCases => {
                return phoneCases.find({
                    "color": color.toLowerCase().trim(),
                    "type": type.toLowerCase().trim(),
                    "model": model.toLowerCase().trim()
                }).toArray();
                //console.log(collection);
            })
            .catch(error => {
                console.log(error);
            })

/*
        MongoDB.connect(MONGO_URI, function(err, db) {
            assert.equal(null, err);

            //var findDocuments = function(db, callback) {
            let collection = db.collection('phoneCases');
            // Find some documents

            collection.find({
                "color": color.toLowerCase().trim(),
                "type": type.toLowerCase().trim(),
                "model": model.toLowerCase().trim()
            }).toArray().then( (docs) => {
                docs.forEach((item, idx, array) => { console.log(item) });
                db.close();
            }).catch( (error) => {
                console.log(error);
            });
            //}
/*
            findDocuments(db, function(docs) {
                db.close();
                return JSON.parse(docs);
                */
       /* });*/
        return tst;
        //});
    }
}

module.exports = (f) => {
    return mongodb;
}