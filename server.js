var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
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
  port = 4001;
}

//const client = require('socket.io').listen(port).sockets
const io = require('socket.io');
var client = io(server).sockets;
console.log(port)

var response_time_limit = 9999
var tickRate = 0.5
var first_response_stage_num = 1
var first_voting_stage_num = 2
var second_response_stage_num = 4
var second_voting_stage_num = 5

var time_between_voting_rounds = 7

var voting_time_limit = 5

var max_question_id = 144


//Connect to mongo
MongoClient.connect('mongodb+srv://oof:Oooofers1!@quipr-test1-exc7k.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, (err, cl) => {
	if(err){
		throw err;
	}
	
	db = cl.db('quipr-game')
	
	console.log('MongoDb connected')
	
	function showPromptAndAnswersWithDelay(iteration, round_num, game_name, players_array, voting_finished){
		// going to show the question from players_array[iteration][q1_id]
		
		var player1_name = players_array[iteration].name
		
		//show prompt
		setTimeout(() => {
			// clear response text area and voting buttons
			client.in(game_name).emit('clear_answer_txt')
			
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
		
		// find player with the same response as their q2
		var x = 0
		var search_attribute = 'r' + round_num + '_q2_id'
		var question_id = players_array[iteration]['r' + round_num + '_q1_id']
		console.log(question_id)
		var player2_response
		var player2_name
		while(true){
			if(players_array[x][search_attribute] == question_id){
				player2_response = players_array[x]['r' + round_num + '_q2_response']
				player2_name = players_array[x].name
				console.log(players_array[x]['r' + round_num + '_q2_response'])
				break
			}
			x++
		}
		
		// show response2
		setTimeout(() => {
			client.in(game_name).emit('show_response2', {
				response_txt: player2_response
			})
		}, 3000 + iteration * time_between_voting_rounds * 1000)
		
		// show buttons
		setTimeout(() => {
			client.in(game_name).emit('show_voting_buttons')
		}, 3000 + iteration * time_between_voting_rounds * 1000)
		
		// hide buttons, tally votes, reset voting in db. If voting is finished, redirect update game stage
		setTimeout(() => {
			// Hide buttons
			client.in(game_name).emit('hide_voting_buttons')
			
			// Tally votes. Reload users array with updated votes
			users = db.collection('users')
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
						
						// If voting is finished, redirect. Update database
						if(voting_finished){
							client.in(game_name).emit('move_to_responses')
							games = db.collection('games')
							games.updateOne({'game_name': game_name}, {$set: {stage: second_response_stage_num}})
						}
					})
				})
			})
			
		}, 6000 + iteration * time_between_voting_rounds * 1000)
	}
	
	function moveToVotingAndLoop(game_name){
		games = db.collection('games')
		users = db.collection('users')
		
		games.updateOne({'name': game_name}, {$set: {'stage': 2}})
		client.in(game_name).emit('move_to_voting')
		
		games.find({'name': game_name}).toArray((err, res) => {
			console.log(res[0].stage + '--stage')
			var round_num = res[0].stage == first_voting_stage_num ? 1 : 2
			
			// get all users in the same game
			users.find({'game_name': game_name}).toArray((err, res) => {
				// res = array of all players in the same game
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
	}
	
	
	function gameLoop() {
		// update timers
		games = db.collection('games')
		games.find({'stage': 1}).toArray((err, res) => {
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
		console.log("user connected")
		
			
		// TESTING ONLY
		socket.on('a', (data) => {
			moveToVotingAndLoop(data.game_name)
		})
		
		// handle client wanting to join room whenever page refreshes
		socket.on('join_room', (data) => {
			console.log("room joined" + data.room_name)
			socket.join(data.room_name)
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
								timer: 0
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
		
		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
		
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
			client.in(data.room_name).emit('game_has_started')
		})
		
		
		// GAME STUFF
		
		socket.on('get_timer', (data) => {
			games = db.collection('games')
			games.find({'name': data.game_name}).toArray((err, res) => {
				
				socket.emit('update_timer_display', {
					time: res[0].timer
				})
			
			})
		})
		
		
		socket.on('response_submited', (data) => {
			users = db.collection('users')
			games = db.collection('games')
			
			// get current stage to determine which field to update (which round)
			var current_game_stage = -1
			games.find({'name': data.game_name}).toArray((err, res) => {
				current_game_stage = res[0].stage
				
				// get first reponse and see if is blank to determine which fild to update (which prompt/question)
				var response_one = -1
				users.find({'name': data.user_name}).toArray((err, res) => {
					//if currently on first prompt
					if(current_game_stage == first_response_stage_num){
						response_one = res[0].r1_q1_response
					}
					else{
						response_one = res[0].r2_q1_response
					}
					
					// creating field string to update
					var field_string = ""
					if(current_game_stage == first_response_stage_num){
						field_string += 'r1_'
					}
					else{
						field_string += 'r2_'
					}
					if(response_one == ''){
						field_string += 'q1_'
					}
					else{
						field_string += 'q2_'
						socket.emit('both_responses_done') // (responses for user done)
						
					}
					field_string += 'response'
					
					// update the reponses in the database
					users.updateOne({'name': data.user_name}, {$set: {[field_string]: data.response}})
					
					// Check to see if all users have responded twice. If so, move onto next page
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
					
				})
				
				
			})
			
		})
		
		// Handle prompt requestion
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
						prompt_id: prompt_id
					})
				})
			})
		})
		
		// Handle vote for players
		socket.on('vote', (data) => {
			users = db.collection('users')
			users.updateOne({'name': data.user_name}, {$set: {'vote': data.vote_num}})
		})
		
	});
})