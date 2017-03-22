'use strict';

const endConversation = require('./endConversation');
const search = require('./searchPhonecase');
module.exports = (session, f, mongodb) => {
    let searchPhonecase = search(session, mongodb);

    const actions = {
        send(request, response) {
            const {sessionId, context, entities} = request;
            const {text} = response;
            return new Promise((resolve, reject) => {
                let {fbid} = session.get(sessionId);
                f.txt(fbid, text);
                return resolve();
            });
        },
        searchPhonecase,
        endConversation
    }

    return actions;
}