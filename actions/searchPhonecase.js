'use strict';

const {fetchEntity} = require('../utils');

const searchPhonecase = (session, mongodb) => {
    return ({sessionId, context, entities}) => {
        return new Promise((resolve, reject) => {
            // Fetch and extract entities
            let caseType = fetchEntity(entities, 'caseType');
            let caseColor = fetchEntity(entities, 'caseColor');
            let phoneModel = fetchEntity(entities, 'phoneModel');
            console.log(`${caseType} - ${caseColor} - ${phoneModel}`);

            let sessionObj = session.get(sessionId);
            if( sessionObj ) {
                caseType = sessionObj.caseType || caseType;
                caseColor = sessionObj.caseColor || caseColor;
                phoneModel = sessionObj.phoneModel || phoneModel;
            }


            if(caseType) {
                context.caseType = caseType;
                delete context.missingCasetype;
            }else {
                context.missingCasetype = true;
            }

            if(caseColor) {
                context.caseColor = caseColor;
                delete context.missingCasecolor;
            }else {
                context.missingCasecolor = true;
            }

            if(phoneModel) {
                context.phoneModel = phoneModel;
                delete context.missingPhonemodel;
            }else {
                context.missingPhonemodel = true;
            }

            if(context.caseType && context.caseColor && context.phoneModel) {
                delete context.missingCasetype;
                delete context.missingCasecolor;
                delete context.missingPhonemodel;
                context.jobDone = true;
                // Fetch fbid of the user
                session.update(sessionId, context);
                // Call mongodb to set data.
                //console.log(context);
            }
            // get data with caseType, caseColor and phoneModel

            // Call mongodb to store the data
            return resolve(context);
        })
    }
}

module.exports = searchPhonecase;