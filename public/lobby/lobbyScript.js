var gamePath = '../game/game.html'


//any part that needs to reference the DOM must go in this function below or a Socket "ON" functions.
function reactDone(){
    if(localStorage.is_owner == 'true'){
        document.getElementById("start_game").style.visibility = "visible";
    }
    window.reactComponent.changeGameName(localStorage.game_name);//should work...

    // Update player list when page is loaded
    updatePlayers()
    
}

var socket = returnSocket()

if(socket != undefined) {

    console.log('Connected to socket...');

    // Connect to room
    socket.on('connect', () => {
        console.log('connect')
        socket.emit('join_room', {
            room_name: localStorage.game_name,
			user_name: localStorage.user_name,
			is_owner: localStorage.is_owner
        })
    })
	
	localStorage.movingOn = 0;// if zero, button isn't pressed. If 1, button has been pressed....
	
	// Handle disconnecting
	socket.on('disconnect_key' + localStorage.user_name, () => {
		console.log("The boss has left...");
        if(localStorage.movingOn == 0 && localStorage.is_owner == 'true') {
            socket.emit("boss_is_dead", {
                game_name:localStorage.game_name
            })
            //calls a mass deleter. Deletes everything...
            socket.emit('remove_room', {
                room_name: localStorage.game_name
            })
        }
	})
	
	socket.on('leave_room', () => {
		localStorage.clear();
		window.location.replace('../index.html');
	})

    // function that emits socket to update player list
    var updatePlayers = function(){
        console.log("reload!")
        socket.emit('reload_lobby', {
            game_name: localStorage.game_name
        })
    }

    // Handle array of players in game
    socket.on('reload_lobby', (data) => {
        var users = data.users_array.map((user) => {
                if(user.is_owner == 1){
                    return user.name + " 👍🏾";
                }
                else return user.name;
        }) 
        //var users = ["Huzaifa Khan", "Ian Hudson", "San Kwon", "Tong Zhao"];
        //if you are looking for the 'thumbs-up' i moved it to the "preGame.js" file.
        //send string array to the 'createLobby' react component so it is saved in as a state 
        window.reactComponent.changeList(users);
    })

    // Handle new player
    socket.on('new_player', () => {
        console.log('newplayers')
        updatePlayers()
    })

    function startGame() {
        console.log("game has started");
        socket.emit('start_game', {
            starting_game_name: localStorage.game_name,
            room_name: localStorage.game_name
        })
    };

    // Handle start of game
    socket.on('game_has_started', () => {
        console.log('here')
        localStorage.movingOn = 1;
        localStorage.Round = 1;
        window.location.replace(gamePath);
        //I think that the 'disconnect' fires right after the line above...
    })
}