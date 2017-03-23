'use strict';

// Create an API server
const restify = require('restify');
const server = restify.createServer({
	name: 'VanillaMessenger'
});
const PORT = process.env.PORT || 3000;

//
server.use( restify.jsonp() );
server.use( restify.bodyParser() );
server.use( (req,res, next) => f.verifySignature(req,res,next) );

// Tokens
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

// MongoDB
const mongodb = require('./mongodb')(f);

// Sessions
const session = require('./session');

// WIT Actions
const actions = require('./actions')(session, f, mongodb);

// Wit.AI
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken: config.WIT_ACCESS_TOKEN,
	actions
});


//OMDB
const omdb = require('./omdb');

// VanillaMessenger
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather, forecastWeather} = require('./parser');

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});


if( mongodb.test() === (null||undefined) ){
	// Check if we have connection with the database


	// Receive all incoming messages
	server.post('/', (req, res, next) => {
		f.incoming(req, res, msg => {
			// Process messages
			const {
				sender,
				postback,
				message
			} = msg;

			if(postback) {
				const {
					schedule,
					fbid,
					id
				} = JSON.parse(postback.payload);

			}

			if(message.text) {
				// process messages
				let sessionId = session.init(sender);
				let {context} = session.get(sessionId);

				// wit actions
				wit.runActions(sessionId, message.text, context)
				.then(ctx => {
					//delete session if conversation is over
					console.log(ctx);
					if(ctx.jobDone) {
						session.delete(sessionId)
						mongodb.get(ctx.caseType, ctx.caseColor, ctx.phoneModel)
							.then( x => {
								console.log(x);
								let data = {
									text: `${x[0].name} voor ${x[0].price}.`,
									buttons: [{
										type: 'postback',
										title: 'Bestel Snel',
										payload: `${x[0].link}`
									}]
								}
								//console.log(data);

								f.img(sender, x[0].image)
								f.btn(sender, data);
								//f.txt(sender, x[0].name+" voor "+ x[0].price +" bekijk het op: "+ x[0].link);

							});
					} else {
						session.update(sessionId, ctx);
					}
				})
				.catch(error => console.log(`Error: ${error}`));
			}
		});
		return next();
	});
} else {
	console.log("We have no connection with the MongoDB anymore!");
}

// Auto subscribe the bot
f.subscribe();

server.listen(PORT, () => console.log(`SPH Seller Bot running on port ${PORT}`));