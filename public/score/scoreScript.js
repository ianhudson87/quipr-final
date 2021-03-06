getStageAndRefreshIfNeeded('scoreboard', localStorage.game_name)

function reactDone(){
    console.log("react is done loading");

    window.reactComponent.setGameName(localStorage.game_name, localStorage.Round);
}
if(socket !== undefined) {

    // Connect to room
    socket.on('connect', () => {
        socket.emit('join_room', {
            room_name: localStorage.game_name
        })
    })

    // Handle showing players
    socket.on('show_player_score', (data) => {
        console.log('show player');
        window.reactComponent.printLosers(data.user_name + ': ' + data.score);
    })

    // Handle end of game
    socket.on('finish_game', () => {
        localStorage.clear()
        window.location.replace('../index.html')
    })
    
    // Handle moving to next round of responses
    socket.on('move_to_reponses', () => {
        localStorage.Round++;
        window.location.replace('../game/game.html')
    })
    
    // Handle request to remove user from current room
    socket.on('remove_self_from_room', () => {
        socket.emit('remove_user_from_room', {
            room_name: localStorage.game_name
        })
    })
}