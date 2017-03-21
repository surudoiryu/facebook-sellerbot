# simple-rulesbased-chatbot

A simple rules based chatbot, that can tell you the weather and simple things like hello, bye.


# How to run

Create a new file in the config directory named: "development.json"
paste in and save:
```
{
	"WIT_ACCESS_TOKEN": "wit acces token here",
	"FB": {
		"PAGE_ACCESS_TOKEN": "facebook access token here",
		"VERIFY_TOKEN": "facebook verify token here",
		"APP_SECRET": "facebook app secret here"
	}
}
```

In terminal, console:
```
npm install

./ngrok http 3000
```

Copy the Ngrok link and paste this in the App on Facebook as CallbackURL

# Example commands

* Hi
* Bye
* What is the weather like in Zeist?
* Will it snow tomorrow in Zeist?

# Dutch only command
Wanneer je dit uitprobeerd gelieve zo realistisch mogelijk vragen.
* Wie heeft {filmnaam} geregisseerd?
* Vertel me meer over {filmnaam}
* Wanneer was {filmnaam gereleased}?

# Dependencies
heroku.com
ngrok
wit.ai

#test it out at https://www.facebook.com/SurudoiRyu-128597457665896/