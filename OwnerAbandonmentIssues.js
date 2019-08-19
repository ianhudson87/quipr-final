function ownerAbandon() {
    // console.log(data);
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
}