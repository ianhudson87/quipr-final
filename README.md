# Quipr

Deployed site: http://quipr-html.herokuapp.com

Created with Node.js, MongoDB, Socket.io, and other unimportant stuff
	
Heroku deployment instructions:
	
	1. Create heroku app
	2. Add engine property for node in package.json
	3. Go into project parent directory using command line
	4. Create 'Procfile' with cmd commands
	5. git rm add heroku [git repo of the heroku app]
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
		
## TODO
	
Huz:
Printin' names all day long takes all day. Print them one by one. ScoreScript stuff.

Ian:

- [] After vote tally, use inc

- [] On disconnect:
	remove from room
		in server: on disconnect, broadcast to people in game to end game (use same emit as when game ends properly)
		create js function that does all the things as when game ends. Import it into all of the pages. Add socket listener for game end on every page

[] On response page:
	users can reload page and see a textbox/response that they aren't supposed to
		in game.html: create localStorage var that keeps track of how many responses have been answered based on clicks. When on('connect') change the number for sendPromptRequest accordingly. Make sure to reset this value on('MoveToVoting'). If responses done is = 2, don't show the box or button


[x] Shuffle res before showPromptAndAnswersWithDelay

[] Disconnect users and remove game from db if user disconnects

[] Redirect users to correct game page if they load an incorrect page
	Same things as join_room. on('connect') send request to get the game stage. Redirect based on the value
	
	
