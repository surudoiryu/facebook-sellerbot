'use strict';

const {fetchEntity} = require('../utils');

const searchPhonecase = (session, mongodb) => {
    return ({sessionId, context, entities}) => {
        return new Promise((resolve, reject) => {
            // Fetch and extract entities
            let caseType = fetchEntity(entities, 'caseType');
            let caseColor = fetchEntity(entities, 'caseColor');
            let phoneModel = fetchEntity(entities, 'phoneModel');
            console.log(`Old: ${caseType} - ${caseColor} - ${phoneModel}`);

            console.log(context);

            let sessionObj = session.get(sessionId);
            if( sessionObj ) {
                caseType = sessionObj.context.caseType || caseType;
                caseColor = sessionObj.context.caseColor || caseColor;
                phoneModel = sessionObj.context.phoneModel || phoneModel;
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

            console.log(`New: ${caseType} - ${caseColor} - ${phoneModel}`);
            console.log(`Missing: ${context.missingCasetype} - ${context.missingCasecolor} - ${context.missingPhonemodel}`);

            if(context.caseType && context.caseColor && context.phoneModel) {
                context.jobDone = true;
            }else {
                delete context.jobDone;
            }
            // get data with caseType, caseColor and phoneModel
            console.log(context);
            session.update(sessionId, context);
            // Call mongodb to store the data
            return resolve(context);
        })
    }
}

module.exports = searchPhonecase;