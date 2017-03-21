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

// Wit.AI
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken: config.WIT_ACCESS_TOKEN
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

// Receive all incoming messages
server.post('/', (req, res, next) => {
	f.incoming(req, res, msg => {
		// Process messages
		const {
			message,
			sender
		} = msg;
		//f.txt(msg.sender, `Hey, you just said ${msg.message.text}`);
		//f.img(msg.sender, `http://www.stickees.com/files/food/sweet/3543-icecream-cone-sticker.png`)
		if(message.text) {
			// If the received message is a text message
			matcher(message.text, data => {
				switch(data.intent) {
					case 'Hello':
						f.txt(sender, `${data.entities.greeting} to you too!`);
						break;
					case 'CurrentWeather':
						weather(data.entities.city, 'current')
							.then(response => {
								let parseResult = currentWeather(response);
								f.txt(sender, parseResult);
							})
							.catch(error => {
								console.log("There seems to be a problem connecting to the weather service "+error);
								f.txt(sender, "Hmm, something is not right with my brains. Please try again later.")
							});
						break;
					case 'WeatherForecast':
						weather(data.entities.city)
							.then(response => {
								let parseResult = forecastWeather(response, data.entities);
								f.txt(sender, parseResult);
							})
							.catch(error => {
								console.log("There seems to be a problem connecting to the weather service "+error);
								f.txt(sender, "Hmm, something is not right with my brains. Please try again later.")
							});
						break;

					default: {
						wit.message(message.text, {})
						.then(omdb)
						.then(response => {
							console.log("response: "+response);
							f.txt(sender, response.text);
							if(response.image){
								f.img(sender, response.image);
							}
						})
						.catch(error => {
							console.log(error);
							f.txt(sender, "Gosh! Ik weet het niet :( wat bedoel je?");
						});
					}
				}
			});
		}
	});
	return next();
});

// Auto subscribe the bot
f.subscribe();

server.listen(PORT, () => console.log(`SPH Seller Bot running on port ${PORT}`));