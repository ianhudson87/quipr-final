# quipr-test1
 
to start server: [npm run dev] or [node server.js]

stages:
	1. first prompting
		timer: 60s
	2. first voting
		
	3. scores
	4. second prompting
	5. second voting
	6. scores
	
to do:
	make sure that the inputs can't be just a blank thing in the game and username
	
	check to see if all answers have been submitted when 'response_submitted' is emitted by client
	
	when game is finished:
		clear room
		clear database
		delete player
	
	on disconnect:
		remove from room
		
	on response page:
		users can reload page and see a textbox again when they aren't supposed to
		
	shuffle res before showPromptAndAnswersWithDelay