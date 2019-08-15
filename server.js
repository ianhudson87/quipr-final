// creating express server, importing mongo, setting up socket server

var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 4000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

var server = app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

const MongoClient = require('mongodb').MongoClient

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

const io = require('socket.io');
var client = io(server).sockets;
console.log(port)

// Setting up constants

const response_time_limit = 1000
const tickRate = 0.5
const first_response_stage_num = 1
const first_voting_stage_num = 2
const first_scoreboard_stage_num = 3
const second_response_stage_num = 4
const second_voting_stage_num = 5
const second_scoreboard_stage_num = 6

const vote_start_time = 3000
const vote_end_time = 8000
const time_between_voting_rounds = 13

const voting_time_limit = 5

const max_question_id = 144

const time_between_showing_users_score = 1 // For scoreboard


// Connect to mongo
MongoClient.connect('mongodb+srv://oof:Oooofers1!@quipr-test1-exc7k.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, (err, cl) => {
	if(err){
		throw err;
	}
	
	db = cl.db('quipr-game')
	
	console.log('MongoDb connected')
	
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}
	
	// For scoreboard page
	function showUserAndScoreWithDelay(iteration, user_name, game_name, score, isLastPlayer){
		setTimeout(() => {
			client.in(game_name).emit('show_player_score', {
				user_name: user_name,
				score: score
			})
			
			// Either clear the entire game or go onto the next stage
			if(isLastPlayer){
				client.in(game_name).emit('display_players')
				games = db.collection('games')
				setTimeout(() => {
					games.find({'name': game_name}).toArray((err, res) => {
						// res = games with same game_name
						var game_stage = res[0].stage
						if(game_stage == second_scoreboard_stage_num){
							// Delete game in db, delete players in db, clear socket room, clear localStorage vars, redirect
							
							// Delete game
							games.deleteOne({'name': game_name})
							
							// Find all users and delete
							users = db.collection('users')
							users.find({'game_name': game_name}).toArray((err, res) => {
								// res = all users in game
								for(var x=0; x<res.length; x++){
									users.deleteOne({'name': res[x].name})
								}
							})
							
							// Clear socket room
							client.in(game_name).emit('remove_self_from_room')
							
							// Tell users to clear localStorage vars and redirect
							client.in(game_name).emit('finish_game')
						}
						else{
							// change game stage, redirect
							games.updateOne({'name': game_name}, {$set: {'stage': second_response_stage_num}})
							client.in(game_name).emit('move_to_reponses')
						}	
					})
				}, 3000)
			}
		}, 2000 + iteration * time_between_showing_users_score * 1000)
	}
	
	// Initial function call for moving to scoreboard for a game
	function moveToScoreboardAndLoop(game_name){
		client.in(game_name).emit('move_to_scoreboard')
		users = db.collection('users')
		
		users.find({'game_name': game_name}).sort({score: 1}).toArray((err, res) => {
			// res = players in the game in order of score from least first to most last
			
			// send socket to tell users to display users in order
			for(var x=0; x<res.length; x++){
				if(x == res.length-1){
					showUserAndScoreWithDelay(x, res[x].name, game_name, res[x].score, true)
				}
				else{
					showUserAndScoreWithDelay(x, res[x].name, game_name, res[x].score, false)
				}
				
			}
		})
		
	}
	
	function votingTimersUpdate(){
		games = db.collection('games')
		
		// Find all the games that are on the voting stage and have a timer that is active (timer >= 0). -1 means timer is currently inactive 
		games.updateMany({ $and:[ { $or:[{'stage': first_voting_stage_num}, {'stage': second_voting_stage_num}]  }, {'timer': {$gt:-1}} ]}, {$inc:{'timer': -1/tickRate}})
	}
	
	setInterval( votingTimersUpdate, 1/tickRate * 1000)
	
	// For voting page
	function showPromptAndAnswersWithDelay(iteration, round_num, game_name, players_array, isVotingFinished){
		// going to show the question from players_array[iteration][q1_id]
		
		var player1_name = players_array[iteration].name
		
		//show prompt
		setTimeout(() => {
			// clear response text area and hide who voted for whom
			client.in(game_name).emit('clear_answer_txt')
			client.in(game_name).emit('hide_users_votes')
			
			var attribute = 'r' + round_num + '_q1_id'
			client.in(game_name).emit('show_prompt', {
				prompt_id: players_array[iteration][attribute]
			})
		}, 1000 + iteration * time_between_voting_rounds * 1000)
		
		// show response1
		setTimeout(() => {
			var attribute = 'r' + round_num + '_q1_response'
			client.in(game_name).emit('show_response1', {
				response_txt: players_array[iteration][attribute]
			})
		}, 2500 + iteration * time_between_voting_rounds * 1000)
		
		// Find player with the same response as their q2
		var x = 0
		var search_attribute = 'r' + round_num + '_q2_id'
		var question_id = players_array[iteration]['r' + round_num + '_q1_id']
		var player2_response
		var player2_name
		while(true){
			if(players_array[x][search_attribute] == question_id){
				player2_response = players_array[x]['r' + round_num + '_q2_response']
				player2_name = players_array[x].name
				break
			}
			x++
		}
		
		// Show response2
		setTimeout(() => {
			client.in(game_name).emit('show_response2', {
				response_txt: player2_response
			})
		}, 3000 + iteration * time_between_voting_rounds * 1000)
		
		// Show buttons
		setTimeout(() => {
			client.in(game_name).emit('show_voting_buttons')
			games = db.collection('games')
			games.updateOne({'name': game_name}, {$set:{'timer': vote_end_time - vote_start_time}})
			client.in(game_name).emit('start_timer', {
				time: (vote_end_time - vote_start_time)/1000
			})
		}, vote_start_time + iteration * time_between_voting_rounds * 1000)
		
		// Hide buttons
		setTimeout(() => {
			client.in(game_name).emit('hide_voting_buttons')
			client.in(game_name).emit('end_timer')
		}, vote_end_time + iteration * time_between_voting_rounds * 1000)
		
		
		// Tally votes, show who voted for whom, reset voting in db.
		setTimeout(() => {
			
			// Reload users array with updated votes
			users = db.collection('users')
			
			// Show people's votes
			users.find({'game_name': game_name, 'vote': 1}).toArray((err, res1) => {
				// res1 = users in game who voted for player 1
				users.find({'game_name': game_name, 'vote': 2}).toArray((err, res2) => {
					// res2 = users in game who voted for player 2
					client.in(game_name).emit('show_users_votes', {
						votes_for_p1: res1,
						votes_for_p2: res2
					})
				})
			})
			
			// Tally votes. 
			var p1_votes = 0
			var p2_votes = 0
			var p1_current_score
			var p2_current_score
			users.find({'name': player1_name}).toArray((err, res) => {
				
				p1_current_score = res[0].score
				
				users.find({'name': player2_name}).toArray((err, res) => {
					p2_current_score = res[0].score
					// Add up votes
					users.find({'game_name': game_name}).toArray((err, res) => {
						for(var x=0; x<res.length; x++){
							if(res[x].vote == 1){
								p1_votes++
							}
							else if(res[x].vote == 2){
								p2_votes++
							}
						}
						
						// Update db with new scores
						users.updateOne({'name': player1_name},{$set: {score: p1_current_score + p1_votes}})
						users.updateOne({'name': player2_name},{$set: {score: p2_current_score + p2_votes}})
						
						// Reset votes
						users.updateMany({'game_name': game_name},{$set: {vote: 0}})
					})
				})
			})
			
		}, 10000 + iteration * time_between_voting_rounds * 1000)
		
		// If voting is finished, redirect update game stage
		setTimeout(() => {
			// If voting is finished, redirect. Update database with new stage
			if(isVotingFinished){
				games = db.collection('games')
				
				// Increment game stage by 1, reset timer
				console.log('inc')
				games.updateOne({'name': game_name}, {$inc: {stage: 1}})
				games.updateOne({'name': game_name}, {$set: {timer: response_time_limit}})
				moveToScoreboardAndLoop(game_name)
				
				/*
				games.find({'name': game_name}).toArray((err, res) => {
					if(res[0].stage == first_voting_stage_num){
						games.updateOne({'name': game_name}, {$set: {stage: first_scoreboard_stage_num}})
						moveToScoreboardAndLoop(game_name)
					}
					else{
						games.updateOne({'name': game_name}, {$set: {stage: second_scoreboard_stage_num}})
						moveToScoreboardAndLoop(game_name)
					}
				*/
			}
		}, 12000 + iteration * time_between_voting_rounds * 1000)
	}
	
	// Initial function call for moving to voting
	function moveToVotingAndLoop(game_name){
		console.log('movetovoting' + game_name)
		games = db.collection('games')
		users = db.collection('users')
		
		games.find({'name': game_name}).toArray((err, res) => {
			// res = games with same game_name
			// stage originally on responses, need to change to voting
			var nextGameStage = res[0].stage == first_response_stage_num ? first_voting_stage_num : second_voting_stage_num
			games.updateOne({'name': game_name}, {$set: {'stage': nextGameStage}})
			
			// tell users to move to voting
			client.in(game_name).emit('move_to_voting')
			
			games.find({'name': game_name}).toArray((err, res) => {
				var round_num = res[0].stage <= first_voting_stage_num ? 1 : 2 // TODO: sometimes updateOne (6 lines above) doesn't work in time for this line. Hot fix is to use <=
				
				// get all users in the same game
				users.find({'game_name': game_name}).toArray((err, res) => {
					// res = array of all players in the same game
					
					// shuffle res
					shuffleArray(res)
					
					// for each user in the game, get their first prompt and display it
					for(var x=0; x<res.length; x++){
						// Make function call for each round. Set appropriate delay in the function
						if(x == res.length - 1){
							showPromptAndAnswersWithDelay(x, round_num, game_name, res, true)
						}
						else{
							showPromptAndAnswersWithDelay(x, round_num, game_name, res, false)
						}
					}
				})
				
			})
		})
	}
	
	// Constantly running to decrement timer
	function gameLoop() {
		// update timers
		games = db.collection('games')
		games.find({$or: [{'stage': first_response_stage_num}, {'stage': second_response_stage_num}]}).toArray((err, res) => {
			// res = all games that are on stage 1 (responding to prompts)
			if(res != null){
				for(var x=0; x<res.length; x++){
					res[x].timer = res[x].timer - 1/tickRate // decrement all the times
					
					// if time has run out, emit to change page to people in the room
					if(res[x].timer < 0){
						moveToVotingAndLoop(res[x].name)
					}
					else{
						games.updateOne({'name': res[x].name},{$set: {'timer': res[x].timer}}) // update all the times in the db
					}
				}
			}
		})
		
		// If serverside timer updates are wanted
		// client.emit('update_timer')
		
	}
	
	setInterval(gameLoop, 1/tickRate * 1000)
	
	
	
	//Connect to socket
	client.on('connect', function(socket){ 
			
		// TESTING ONLY
		socket.on('a', (data) => {
			moveToVotingAndLoop(data.game_name)
		})
		
		socket.on('b', () => {
			db.collection('users').deleteMany({})
			db.collection('games').deleteMany({})
		})
		
		
		///////////////////////////////
		
		// handle client wanting to join room whenever page refreshes
		socket.on('join_room', (data) => {
			console.log(data)
			
			console.log('User joined room: ' + data.room_name)
			socket.join(data.room_name)
			
			if(data.is_owner == 'true'){
				// Set owner might be dead false
				games = db.collection('games')
				games.updateOne({'name': data.room_name}, {$set:{'owner_might_be_dead' : false}})
			}
			
			var disconnect_key = 'dis_key' + data.user_name
			
			// Handle owner player disconnecting
			socket.on('disconnect', () => {
				console.log('dis')
				// If page is lobby
				console.log(data)
				if(data.is_lobby){
					// If owner disconnects on lobby page
					if(data.is_owner == 'true'){
						
						console.log('bad owner')
						
						games = db.collection('games')
						games.updateOne({'name': data.room_name}, {$set:{'owner_might_be_dead' : true}})
						
						
						setTimeout(() => {
							console.log(data)
							// refresh games
							games = db.collection('games')
							games.find({'name': data.room_name, 'owner_might_be_dead':true}).toArray((err, res) => {
								if(res.length == 0){
									// All is good, owner has returned to family
								}
								else{
									// owner has abondonded children
									client.in(data.room_name).emit('leave_room')
									
									// deleting database
									games = db.collection('games')
									users = db.collection('users')
									
									games.deleteOne({'name': data.room_name})
									users.deleteMany({'game_name': data.room_name})
								}
							})
						}, 5000)
					}
				}
				
					
				
				/* BAD BAD BAD
				if(data.is_owner){
					// Telling users to delete local storage and redirect
					setTimeout(() => {
						client.in(data.room_name).emit('leave_room')
					},1000)
					
					// deleting database
					games = db.collection('games')
					users = db.collection('users')
					
					games.deleteOne({'name': data.room_name})
					users.deleteOne({'game_name': data.room_name})
				}
				*/
			})
		})
		
		// HANDLE CREATE
		// Handle create game button click
		socket.on('create_game', function(data){
			games = db.collection('games')
			users = db.collection('users')
			
			//add user to room, room name = game name
			
			games.find({"name": data.game_name}).toArray(function(err, res){
				if(err){
					throw err;
				}
				
				//make sure game name is unique
				if(res.length == 0){ // valid game name
				
					users.find({"name": data.user_name}).toArray(function(err, res){
						if(err){
							throw err;
						}
						
						//make sure user name is unique
						if(res.length == 0){ // valid user name
							
							games.insertOne({
								name: data.game_name,
								stage: 0,
								timer: 0,
								responses_done: 0,
								owner_might_be_dead: false
							})
							
							users.insertOne({
								name: data.user_name,
								score: 0,
								game_name: data.game_name,
								is_owner: 1,
								r1_q1_id: 0,
								r1_q2_id: 0,
								r2_q1_id: 0,
								r2_q2_id: 0,
								r1_q1_response:"",
								r1_q2_response:"",
								r2_q1_response:"",
								r2_q2_response:"",
								vote: 0
							})
							
							socket.emit('valid_create', {
								user_name: data.user_name,
								game_name: data.game_name
							})
							
						}
						else{
							socket.emit('duplicate_create_user_name')
						}
					})
				
				}
				else{
					socket.emit('duplicate_create_game_name')
				}
				
			})

		})
		
		// HANDLE JOIN
		// Handle join game button click
		socket.on('join_game', function(data){
			games = db.collection('games')
			users = db.collection('users')
			
			games.find({"name": data.game_name}).toArray(function(err, res){
				if(err){
					throw err;
				}
				
				//make sure game name is unique
				if(res.length > 0){ // valid game name
				
					users.find({"name": data.user_name}).toArray(function(err, res){
						if(err){
							throw err;
						}
						
						//make sure user name is unique
						if(res.length == 0){ // valid user name
							
							users.insertOne({
								name: data.user_name,
								score: 0,
								game_name: data.game_name,
								is_owner: 0,
								r1_q1_id: 0,
								r1_q2_id: 0,
								r2_q1_id: 0,
								r2_q2_id: 0,
								r1_q1_response:"",
								r1_q2_response:"",
								r2_q1_response:"",
								r2_q2_response:"",
								vote: 0
							})
							
							socket.emit('valid_join', {
								user_name: data.user_name,
								game_name: data.game_name
							})
							
						}
						else{
							socket.emit('duplicate_join_user_name')
						}
					})
				
				}
				else{
					socket.emit('duplicate_join_game_name')
				}
				
			})

		})
		
		// When new player joins a game, check to see if user need to update list. 
		socket.on('new_player', (data) => {
				client.in(data.room_name).emit('new_player')
		})
		
		/////////////////////////// LOBBY PAGE
		
		// reload the users list
		socket.on('reload_lobby', (data) => {
			users = db.collection('users')
			
			// find all users with same game_name
			users.find({'game_name': data.game_name}).toArray(function(err, res){
				client.emit('reload_lobby',{
					users_array: res
				})
			})
		})
		
		function createArrayOf_n_UniqueRandomPositiveInts(n, max){
			var array = new Array()
			while(array.length < n ){
				var temp = Math.floor(Math.random() * (max + 1))
				if(!array.includes(temp)){
					array.push(temp)
				}
			}
			return array
		}
		
		// handle start game button click
		socket.on('start_game', (data) => {
			console.log('start_game1')
			games = db.collection('games')
			users = db.collection('users')
			games.updateOne({'name': data.starting_game_name}, {$set: {'stage': 1, 'timer': response_time_limit}})
			
			// Assign questions
			users = db.collection('users')
			users.find({'game_name': data.starting_game_name}).toArray(function(err, res){
				// res = array of all users in the game
				
				for(var round=1; round<=2; round++){
					shuffleArray(res)
					gameIds_both_rounds = createArrayOf_n_UniqueRandomPositiveInts(res.length * 2, max_question_id)
					
					var q1_string = 'r'+ round + '_q1_id'
					var q2_string = 'r' + round + '_q2_id'
					
					if(round == 1){
						gameIds = gameIds_both_rounds.slice(0, res.length)
					}
					else{
						gameIds = gameIds_both_rounds.slice(res.length, res.length * 2)
					}
					
					for(var x=0; x<gameIds.length; x++){
						if(x != gameIds.length-1){
							users.updateOne({'name': res[x].name}, {$set: {[q1_string]: gameIds[x]}})
							users.updateOne({'name': res[x+1].name}, {$set: {[q2_string]: gameIds[x]}})
						}
						else{
							users.updateOne({'name': res[x].name}, {$set: {[q1_string]: gameIds[x]}})
							users.updateOne({'name': res[0].name}, {$set: {[q2_string]: gameIds[x]}})
						}
					}
				}

			})
			
			//tell users in same room to check their game for start
			console.log('start_game2')
			console.log('room_name' + data.room_name)
			client.in(data.room_name).emit('game_has_started')
		})
		
		
		// GAME STUFF
		
		// Handle user needing timer to update their display
		socket.on('get_timer', (data) => {
			games = db.collection('games')
			games.find({'name': data.game_name}).toArray((err, res) => {
				
				socket.emit('update_timer_display', {
					time: res[0].timer
				})
			
			})
		})
		
		// Handle user requesting to get number of responses they have completed
		socket.on('get_num_reponses_completed', (data) => {
			users = db.collection('users')
			games = db.collection('games')
			
			// get current stage to determine which field to update (which round)
			games.find({'name': data.game_name}).toArray((err, res) => {
				var current_game_stage = res[0].stage
				
				// get first reponse and see if is blank to determine which field to update (which prompt/question)
				users.find({'name': data.user_name}).toArray((err, res) => {
					// get first and second responses based on current stage
					var response_one = current_game_stage==first_response_stage_num ? res[0].r1_q1_response : res[0].r2_q1_response
					var response_two = current_game_stage==first_response_stage_num ? res[0].r1_q2_response : res[0].r2_q2_response
					
					var responses_completed
					if(response_two != ''){
						socket.emit('get_num_reponses_completed', {
							num_completed: 2
						})
					}
					else if(response_one != ''){
						socket.emit('get_num_reponses_completed', {
							num_completed: 1
						})
					}
					else{
						socket.emit('get_num_reponses_completed', {
							num_completed: 0
						})
					}
					
				})
				
				
			})
		})
		
		// Handle user submitting response
		socket.on('response_submited', (data) => {
			users = db.collection('users')
			games = db.collection('games')
			
			// get current stage to determine which field to update (which round)
			var current_game_stage = -1
			games.find({'name': data.game_name}).toArray((err, res) => {
				current_game_stage = res[0].stage
				
				// get first reponse and see if is blank to determine which field to update (which prompt/question)
				var response_one = -1
				users.find({'name': data.user_name}).toArray((err, res) => {
					// get first resposne based on current stage
					response_one = current_game_stage==first_response_stage_num ? res[0].r1_q1_response : res[0].r2_q1_response
					
					// creating field string to update
					var field_string = ""
					
					// Add round to field_string
					field_string += current_game_stage==first_response_stage_num ? 'r1_' : 'r2_'
					
					// Add question number to field_string
					field_string += response_one=='' ? 'q1_' : 'q2_'
					
					field_string += 'response'
					
					if(response_one != ''){
						socket.emit('both_responses_done') // (responses for user done)
					}
					
					// update the responses in the database
					users.updateOne({'name': data.user_name}, {$set: {[field_string]: data.response}})
					
					// Check to see if all users have responded twice. If so, move onto next page
					games.find({'name': data.game_name}).toArray((err, res) => {
						// res = array of games with same game_name.
						users.find({'game_name': data.game_name}).toArray((err, res2) => {
							// res2 = array of all players in the game
							if(res[0].responses_done >= res2.length * 2 - 1){
								// Last response is being input. Reset the responses_done counter
								moveToVotingAndLoop(data.game_name)
								games.updateOne({'name': data.game_name}, {$set: {'responses_done': 0}})
							}
							else{
								// Current response is not the last one
								games.updateOne({'name': data.game_name}, {$inc: {'responses_done': 1}})
							}
						})
					})
					
					
					/*
					users.find({'game_name': data.game_name}).toArray((err, res) => {
						var attribute = current_game_stage==first_response_stage_num ? 'r1_q2_response' : 'r2_q2_response'
						
						var all_responses_complete = true
						for(var x=0; x<res.length; x++){
							// if there exists a blank q2 response
							if(res[x][attribute] == ''){
								all_responses_complete = false
								break
							}
							// after getting through all entries
							if(x==res.length-1){
								if(all_responses_complete == true){
									moveToVotingAndLoop(data.game_name)
								}
							}
						}
					})
					*/
					
					
				})
				
				
			})
			
		})
		
		// Handle prompt request
		socket.on('get_prompt', (data) => {
			users = db.collection('users')
			games = db.collection('games')
			games.find({'name': data.game_name}).toArray((err, res) => {
				var current_game_stage = res[0].stage
				var round = current_game_stage==first_response_stage_num ? 1 : 2
				
				users.find({'name': data.user_name}).toArray((err, res) => {
					var attribute_string = 'r' + round + '_' + 'q' + data.prompt_num + '_id'
					var prompt_id = res[0][attribute_string]
					socket.emit('display_prompt', {
						prompt_id: prompt_id,
						prompt_num:data.prompt_num
					})
				})
				
			})
		})
		
		//////////////////////// VOTING STUFF
		
		// Handle vote for players
		socket.on('vote', (data) => {
			users = db.collection('users')
			users.updateOne({'name': data.user_name}, {$set: {'vote': data.vote_num}})
		})
		
		////////////////////// SCORE BOARD PAGE
		
		socket.on('remove_user_from_room', (data) => {
			socket.leave(data.room_name)
		})
		
	});
})