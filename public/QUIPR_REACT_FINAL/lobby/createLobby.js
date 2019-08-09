'use strict';
const c=React.createElement;

class Lobii extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      gameName:"placeHolder",
      playerList:[""],
    };
    window.reactComponent=this;
  }
  
  changeGameName(name) {
    this.setState({
      gameName: name,
    });
  }

  changeList(users){
    this.setState({
      playerList:users,
    });
  }

  componentDidMount(){
    reactDone();
  }

  startBotton = (e) => {
    e.preventDefault();
    startGame();// function from lobbyScript.js
  }

  render() {

    const ninjaList = this.state.playerList.map(ninja => {
      return(
        c("p",{key:ninja},ninja)
      );
    });

    return(
      c("div", {id: "stage"}, 
        c("h1", {id: "GameTitle"}, "QuipR"),
        c("h2", {id: "game_name_display"}, "Room Name: " + this.state.gameName),
        c("div", {id: "mainContent"},
          c("hr", null),
          c("h2", null, "Player's List"),
          c("hr", null),
          c("div",{id: "users_txt"},ninjaList), //printing the list of users.
          c("br", null),
          c("hr", null),
          c("div", {id:"button_Wrapper"},
            c("button",{id:"start_game", onClick:this.startBotton},"Start Game!. Mr. Owner.")
          )
        )
      )
    );//end of return
  }//end of render
}

const domContainer = document.querySelector('#root');
ReactDOM.render(c(Lobii), domContainer);