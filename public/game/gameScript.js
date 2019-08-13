function reactDone() {
    //this function is in createGame.js, same folder. This is noted by the 'window.reactocmponent' part before it...
    //look for similar stuff later in this script.
    window.reactComponent.setGameName(localStorage.game_name, localStorage.Round);
    //get timer initial count
    socket.emit('get_timer', {
        game_name: localStorage.game_name
    })
    //sendPromptRequest(1);
    
	
	// Get the number of responses completed by user upon reload. Then display the correct prompt stuff based on it.
	// Prevents users from getting incorrect prompt if they reload
	socket.emit('get_num_reponses_completed', {
		user_name: localStorage.user_name,
		game_name: localStorage.game_name
	})
	
	socket.on('get_num_reponses_completed', (data) => {
		console.log(data.num_completed)
		if(data.num_completed == 0){
			sendPromptRequest(1);
		}
		else if(data.num_completed == 1){
			sendPromptRequest(2);
		}
		else{
			document.getElementById('prompt_display').innerHTML = "Please wait for the Round to End.";
			document.getElementById('response_txt').style.visibility='hidden';
			document.getElementById('submit_btn').style.visibility = 'hidden';
		}
    })
    
    //set a time interval stuff. calls the function just above, atleast at the time of writing this.¯\_(ツ)_/¯
    setInterval(() => {decTimeAndDisplay()}, 1000);

    document.getElementById('response_txt').style.visibility= 'visible';
    document.getElementById('submit_btn').style.visibility = 'visible';

}

// Connect to socket.io
var socket = returnSocket();

// Check for connection
if(socket !== undefined) {
    console.log("Connected to socket...");
    
    // Connect to room  
    socket.on('connect', () => {
		console.log('join_room')
        socket.emit('join_room', {
            room_name: localStorage.game_name
        })
    })
    
    // set timer to initial count
    socket.on('update_timer_display', (data) => {
        window.reactComponent.startTime(data.time);
    });

    //decrement time by uno;
    function decTimeAndDisplay(){
        window.reactComponent.decTime();
    }

    /* If serverside timer update is wanted: delete sockets from above and uncomment this
    socket.on('update_timer', () => {
        socket.emit('get_timer', {
            game_name: localStorage.game_name
        });
    })
    socket.on('update_timer_display', (data) => {
        console.log(data)
        window.reactComponent.startTime(data.time);
    })
    */

    // when timer runs down to 0 on server side
    socket.on('move_to_voting', () => {
        //console.log("You probably expected the voting pages, but it was I...");
        window.location.replace('../EveryoneShouldWote/voting.html')
    });

    //goodness, ian cant put a semicolon at the end of his sentenes!!.

    //Ian didn't put a comment on this one so I have no idea what it does... Haha,
    //just kidding. I think it sends out a request to server to get the questions?
    function sendPromptRequest(prompt_num) {
        socket.emit('get_prompt', {
            prompt_num: prompt_num,//i think this is question number(i.e. 1 or 2) requesquated.
            user_name: localStorage.user_name,
            game_name: localStorage.game_name
        });
    }

    // below function Handles submit response button's needs
    function SubmitScriptRun(Response) {
        sendPromptRequest(2);
        socket.emit('response_submited', {
            response: Response,
            user_name: localStorage.user_name,
            game_name: localStorage.game_name,
            room_name: localStorage.game_name
        });
        window.reactComponent.emptyResp();
    }

    // Handle when two answers are submitted
    socket.on('both_responses_done', () => {
        //this hides the question, the
        document.getElementById('prompt_display').innerHTML = "Please wait for the Round to End.";
        document.getElementById('response_txt').style.visibility='hidden';
        document.getElementById('submit_btn').style.visibility = 'hidden';
    })

    // Handle getting prompt id number
    socket.on('display_prompt', (data) => {
        window.reactComponent.setQuestions(getPromptFromIdAndDisplay(data.prompt_id), data.prompt_num);
        //prompt_display.innerHTML = data.prompt_id
    })
}
