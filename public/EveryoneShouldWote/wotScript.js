
function reactDone(){
    console.log("react is done loading");
    window.reactComponent.setGameName(localStorage.game_name, localStorage.Round);
    // Get voting information on page reload
	socket.emit('get_voting_rights', {
        game_name: localStorage.game_name,
    })
}

socket.on("here_dem_voting_rights", (data) => {
    //sets the visuals to what the voting should be on...
    console.log("reachde here...")
	console.log(data)
	
	if(data.vote_prompt_id != -1) {
		window.reactComponent.setQuestions(getPromptFromIdAndDisplay(data.vote_prompt_id));
		window.reactComponent.setResponses(data.response_one, 1);
		window.reactComponent.setResponses(data.response_two, 2);
	}

    //timer stuff
	if(data.time >= 0){
		// If timer is in valid state, show it
		document.getElementById('timer_display').style.visibility = 'visible'
		window.reactComponent.setTime(data.time);
		//set a time interval stuff. calls the function just above, atleast at the time of writing this.¯\_(ツ)_/¯
		timer = setInterval(() => { decTimeAndDisplay()}, 1000 );
	}
	else{
		// If timer is invalid (voting time is over), hide it
		document.getElementById('timer_display').style.visibility = 'hidden'
	}
})

// Check for connection
if(socket !== undefined) {
    console.log('Connected to socket...');
    //connect to room.
    socket.on('connect', () => {
        socket.emit('join_room', {
            room_name: localStorage.game_name
        })
    })
	
	// When voting starts on server, show the tiemr
    var timer;
    // set timer to initial count
    socket.on("start_timer", (data) => {
		document.getElementById('timer_display').style.visibility = 'visible'
        window.reactComponent.setTime(data.time);
         //set a time interval stuff. calls the function just above, atleast at the time of writing this.¯\_(ツ)_/¯
        timer = setInterval(() => { decTimeAndDisplay()}, 1000 );
    })
	
	// When voting ends on server, hide the timer
	socket.on("end_timer", (data) => {
		document.getElementById('timer_display').style.visibility = 'hidden'
    })

    //decrement time by uno;
    function decTimeAndDisplay(){
        window.reactComponent.decTime();
    }

    // Handle displaying prompt for voting
    socket.on('show_prompt', (data) => {
        window.reactComponent.setQuestions(getPromptFromIdAndDisplay(data.prompt_id))
    });

    // Handle displaying response for voting
    socket.on('show_response1', (data) => {
        window.reactComponent.setResponses(data.response_txt, 1);
    });
    
    socket.on('show_response2', (data) => {
        window.reactComponent.setResponses(data.response_txt, 2);
    });

    // Handle second voting iteration. Need to clear the answers from the first round
    socket.on('clear_answer_txt', () => {
        window.reactComponent.setResponses("", 1);
        window.reactComponent.setResponses("", 2);
    });

    // Handle showing voting buttons
    socket.on('show_voting_buttons', () => {
        // no butotns lol
    //    window.reactComponent.showButtons();
    });

    function votedLeft() {
        socket.emit('vote', {
            user_name: localStorage.user_name,
            vote_num: 1
        });
    }
    function votedRight(){
        socket.emit('vote', {
            user_name: localStorage.user_name,
            vote_num: 2
        });
        
    }

    //hides the two buttons...
    socket.on('hide_voting_buttons', () => {
        console.log('Ono. The buttons have gone into hiding.')
        window.reactComponent.setTime(0);
        // window.reactComponent.hideButtons();
        clearInterval(timer);
    });

    // Handling moving to scoreboard
    socket.on('move_to_scoreboard', () => {
        console.log('hi2');
        window.location.replace('../score/scoreboard.html');
    });

    // Handling showing who users voted for
    socket.on('show_users_votes', (data) => {
        var voters_names_for_p1 = data.votes_for_p1.map((user) => {
            return user.name
        })

        var voters_names_for_p2 = data.votes_for_p2.map((user) => {
            return user.name
        })
        //sends the arrays made above to the react file.
        window.reactComponent.setP1VoteArray(voters_names_for_p1);
        window.reactComponent.setP2VoteArray(voters_names_for_p2);
    })
    
    socket.on('hide_users_votes', () => {
        //sends empty arrays to the p1 and p2 arrays in the react script.
        window.reactComponent.setP1VoteArray([""]);
        window.reactComponent.setP2VoteArray([""]);
    })
}