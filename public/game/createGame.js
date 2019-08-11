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
        questionNumber:0,
        timer:0,
        Question:"",
        Response:"",
    };
    window.reactComponent=this;
  }

  componentDidMount(){
    reactDone();//announces to the socket script that React is done mounting (god knows what tho...)
  }
  //sets the gameName state after recieving from the server and socket.
  setGameName (gameName) {
    this.setState({
      gameName:gameName
    });
  }
  //sets the time to max time. Then will count down to cero? yeah.
  startTime(time){
    this.setState({
      timer:time
    });
  }
  decTime(){
    this.setState({
      timer:this.state.timer-1//sure hope this works...
    })
  }
  //This sets the roundnumber. I think its not implemented into the server side yet, but will maybe be done soon?
  setRoundNumber(roundNum) {
    this.setState({
      roundNumber:roundNum
    });
  }
  //sets the question for the person.
  setQuestions(prompt, number) {
    this.setState({
      Question:prompt,
      questionNumber: number,
    });
  }

  submitAnswer = (e) => {
    e.preventDefault();
    SubmitScriptRun(this.state.Response);
    
  }
  emptyResp(string) {
    console.log("here");
    document.getElementById("response_txt").innerHTML = "";
  }

  setResponse = (e) =>{
    this.setState({
      Response: e.target.value,
    });
  }

  //renders to the "html" page to the web to your computer~...
  render() {
    return(
      //c is React.createElement, btw. See line 2
        c("div", {id: "stage"}, 
            c("h1", {id: "GameTitle"}, "QuipR"),
            c("h2", {id: "game_name_display"}, "Room Name: " + this.state.gameName+" ",
            c("span", {id: "timer_display"}, " ;_; " + this.state.timer)),
            c("div", {id: "mainContent"},
                c("hr", null),
                c("h2", {id: "round_number"}, "Round "+this.state.roundNumber),
                c("hr", null),
                c("p", {id: "prompt_display"}, this.state.Question),
                c("br", null),
                c("input", {id: "response_txt", type: "text", placeholder: "Response Goes Here.", onChange:this.setResponse}),
                c("hr", null),
                c("div", {id: "button_Wrapper"},
                    c("button", {id: "submit_btn", onClick:this.submitAnswer}, "OOF!")
                )
            )
        )
    );//end of return
  }//end of render
}

const domContainer = document.querySelector('#root');
ReactDOM.render(c(Lobii), domContainer);