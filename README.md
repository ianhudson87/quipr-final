# Quipr

Deployed site: http://quipr-html.herokuapp.com

Created with Node.js, MongoDB, Socket.io, and other unimportant stuff
	
Heroku deployment instructions:
	
	1. Create heroku app
	2. Add engine property for node in package.json
	3. Go into project parent directory using command line
	4. Create 'Procfile' with cmd commands
	5. git rm add [git repo of the heroku app]
	6. git push heroku master
	7. Or just go look at this link: https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment
	
For source code reference:
	
	stages:
		
		1. first prompting
		2. first voting
		3. scores
		4. second prompting
		5. second voting
		6. scores
		7. third prompting
		8. third voting
		9. scores
		
TODO:
	
	Huz:
	
	Convert html to ReactJS. HUZ!!! 😶
	--yeah, yeah. I got it
	
	Input validation for username, gamename, and responses
	
	Remove reponse from textbox when entered
	
	Ian:

	When game is finished:
		clear room
		clear database
		delete player
	
	On disconnect:
		remove from room
		
	On response page:
		users can reload page and see a textbox again when they aren't supposed to
		
	Shuffle res before showPromptAndAnswersWithDelay
	
	Disconnect users and remove game from db if user disconnects
	
	Redirect users to correct game page if they load an incorrect page
	
	
