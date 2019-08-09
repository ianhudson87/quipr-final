var socket = returnSocket(0);

if(socket !== undefined){
    console.log('Connected to socket!');
    //create button is pressed

    function CreateButtonClicked(userName, gameName){
        socket.emit('create_game', {
            user_name: userName,
            game_name: gameName,
        });
    }
    //socket stuff
    socket.on('duplicate_create_game_name', () => {
        alert("bad GameName");
    });
    
    socket.on('duplicate_create_user_name', () => {
        alert("Bad UserName");
    });

    socket.on('valid_create', (data) => {
        localStorage.user_name = data.user_name + " 👍🏾";
        localStorage.game_name = data.game_name;
        localStorage.is_owner = true;
        window.location.replace('../lobby/lobby.html');
    });

    //join button is pressed!
    function JoinButtonClicked(userName, gameName) {
        socket.emit('join_game', {
            user_name: userName,
            game_name: gameName,
        });
    }

    socket.on('duplicate_join_game_name', () => {
        alert("bad GameName");
    })

    socket.on('duplicate_join_user_name', () => {
        alert("Bad UserName");
    });

    socket.on('valid_join', (data) => {
        localStorage.user_name = data.user_name,
        localStorage.game_name = data.game_name,
        localStorage.is_owner = false,
        
        // joing room so socket knows which room to look for
        socket.emit('join_room', {
            room_name: data.game_name,
        })
        
        // make sure the users in the same lobby as the new player have their list updated
        socket.emit('new_player', {
            game_name: localStorage.game_name,
            room_name: localStorage.game_name
        })
        window.location.replace('./lobby.html');
    })
}