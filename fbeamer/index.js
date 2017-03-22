'use strict';

const request = require('request');
const crypto = require('crypto');

class FBeamer {
	constructor(config) {
		try {
			if(!config || config.PAGE_ACCESS_TOKEN === undefined || config.VERIFY_TOKEN === undefined || config.APP_SECRET === undefined) {
				throw new Error("Unable to access tokens!");
			} else {
				this.PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
				this.VERIFY_TOKEN = config.VERIFY_TOKEN;
				this.APP_SECRET = config.APP_SECRET;
			}
		} catch(e) {
			console.log(e);
		}
	}

	registerHook(req, res) {
		// If mode is subscribe and token is the same then send back a 200 http-status
		let {mode, verify_token, challenge} = req.query.hub;

		if(mode === 'subscribe' && verify_token === this.VERIFY_TOKEN) {
			return res.end(challenge);
		} else {
			console.log("Could not register webhook!");
			return res.status(403).end();
		}
	}

verifySignature(req, res, next) {
	if(req.method === 'POST') {
		let signature = req.headers['x-hub-signature'];
		try {
			if(!signature) {
				throw new Error("Signature missing!");
			} else {
				let hash = crypto.createHmac('sha1', this.APP_SECRET).update(JSON.stringify(req.body)).digest('hex');
				if(hash !== signature.split("=")[1]) {
					throw  new Error("Invalid signature");
				}
			}
		} catch(e) {
			res.send(500, e);
		}
	}

	return next();
}

	subscribe() {
		request({
			uri: 'https://graph.facebook.com/v2.8/me/subscribed_apps',
			qs: {
				access_token: this.PAGE_ACCESS_TOKEN
			},
			method: 'POST'
		}, (error, response, body) => {
			if(!error && JSON.parse(body).success) {
				console.log("Subscribed to the page!");
			} else {
				console.log(error);
			}
		});
	}

	getProfile(id) {
		return new Promise((resolve, reject) => {
			request({
				uri: `https://graph.facebook.com/v2.8/${id}`,
				qs: {
					access_token: this.PAGE_ACCESS_TOKEN
				},
				method: 'GET'
			}, (error, response, body) => {
				if(!error && response.statusCode === 200) {
					resolve(JSON.parse(body));
				} else {
					reject(error);
				}
			})
		});
	}

	incoming(req, res, cb) {
		//Extract the body of the POST request
		let data = req.body;
		if(data.object === 'page') {
			// Iterate through the page entry array
			data.entry.forEach(pageObj => {
				// Iterate through the messaging array
				pageObj.messaging.forEach(msgEvent => {
					let messageObj = {
						sender: msgEvent.sender.id,
						timeOfMessage: msgEvent.timestamp,
						message: msgEvent.message
					}
					cb(messageObj);
				});
			});
		}
		res.send(200);
	}

	sendMessage(payload) {
		return new Promise((resolve, reject) => {
			//Create a HTTP POST request
			request({
				uri: 'https://graph.facebook.com/v2.8/me/messages',
				qs: {
					access_token: this.PAGE_ACCESS_TOKEN
				},
				method: 'POST',
				json: payload
			}, (error, response, body) => {
				if(!error && response.statusCode === 200) {
					resolve({
						messageId: body.message_id
					});
				} else {
					reject(error);
				}
			});
		});
	}

	// Send a text message
	txt(id, text) {
		let obj = {
			recipient: {
				id
			},
			message: {
				text
			}
		}

		this.sendMessage(obj).catch( error => console.log(error) );
	}

	// Send an image message
	img(id, url) {
		let obj = {
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'image',
					payload: {
						url
					}
				}
			}
		}

		this.sendMessage(obj).catch( error => console.log(error) );
	}

	btn(id, data) {
		let obj = {
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: data.text,
						buttons: data.buttons
					}
				}
			}
		}
		this.sendMessage(obj).catch(error => console.log(error));
	}
}

module.exports = FBeamer;