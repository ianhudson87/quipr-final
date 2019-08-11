//god knows what this means
'use strict';

//a handy shortcut. get used to it.
const c = React.createElement;

class Lobii extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gameName:"ph",
        roundNumber:0,
        timer:0,
        Question:"\"Why did the chicken cross the road?\"",
        Response:"This is the left answer?",
        Response2:"This is the right (posfewfwefaewfafewitional) answer?",
        playersVote1:[],
        playersVote2:[],
    };
    window.reactComponent=this;
  }

  //sets the gameName state after recieving from the server and socket.
  setGameName (gameName) {
    this.setState({
      gameName:gameName,
      //roundNumber:roundNumber,
    });
  }
  //sets the time to max time. Then will count down to cero? yeah.
  setTime(time){
    this.setState({
      timer:time
    });
  }
  decTime(){
    this.setState({
      timer:this.state.timer-1 //sure hope this works...
    })
  }
  //sets question state to new question or current question.
  setQuestion(Question){
    this.setState({
        Question:Question
    });
  }
  setP1VoteArray(array){
    this.setState({
      playersVote1:array,
    })
  }
  setP2VoteArray(array){
    this.setState({
      playersVote2:array,
    });
  }
  //sets responses states to the proper ones. React displays them live.
  setResponses(res, num){
    if(num == 1){
        this.setState({
            Response:res,
        })
    }
    else{
        this.setState({
            Response2:res,
        });
    }
  }
  showButtons(){
    leftButton.style.visibility = "visible";
    rightButton.style.visibility = "visible";
}
  hideButtons(){
    leftButton.style.visibility = "hidden";
    rightButton.style.visibility = "hidden";
  }

  voteLeft = (e) => {
    e.preventDefault();
    votedLeft();//goes to wotScript.js function
  }
  voteRight = (e) => {
      e.preventDefault();
      votedRight();//goes to wotScript.js function
  }

  componentDidMount(){
    reactDone();//announces to the socket script that React is done mounting (god knows what tho...)
  }

  //renders to the "html" page to the web to your computer~...
  render() {

    const voter1List = this.state.playersVote1.map(player => {
      return(
        c("p",{key:player},player)
      );
    });

    const voter2List = this.state.playersVote2.map(player => {
      return (
        c("p", {key:player}, player)
      );
    });

    return(
      //c is React.createElement, btw. See line 2
        c("div", {id: "stage"}, 
            c("h1", {id: "GameTitle"}, "QuipR"),
            c("h2", {id: "game_name_display"}, "Room Name: " + this.state.gameName+" ",
            c("span", {id: "timer_display"}, " ;_; " + this.state.timer)),
            c("div", {id: "mainContent"},
                c("hr", null),
                c("h2", {id: "round_number"}, "Voting Round: "+this.state.roundNumber),
                c("hr", null),
                c("p", {id: "prompt_display"}, this.state.Question),
                c("br", null),
                c("div",{className:"row"},
                    c("div",{className:"column"},
                        c("p",{id:"answer1"},this.state.Response),
                        c("div",{id:"vote1"},voter1List)
                    ),
                    c("div",{className:"column"},
                        c("p",{id:"answer2"},this.state.Response2),
                        c("div",{id:"vote2"},voter2List)
                    )
                ),
                c("hr", null),
                c("div", {id: "button_Wrapper"},
                    c("button", {id: "answerLeft", className:"submit_btn", onClick:this.voteLeft}, "Vote-Left"),
                    c("button", {id: "answerRight", className:"submit_btn", onClick:this.voteRight}, "Vote-Right")
                )
            )
        )
    );//end of return
  }//end of render
}

const domContainer = document.querySelector('#root');
ReactDOM.render(c(Lobii), domContainer);
//creates variables to store references to the buttons..
var leftButton = document.getElementById("answerLeft");
var rightButton = document.getElementById("answerRight");