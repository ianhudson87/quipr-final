//god knows what this means
'use strict';

//a handy shortcut. get used to it.
const c = React.createElement;//I dont think i used it at all here...I do use it in future react files tho...

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "localhost:8080",
      createUserName: " ",
      createGameName: " ",
      joinUserName: " ",
      joinGameName: " "
    };
  }
  //whenever something is typed in create_username, this function runs and saves the new info as a state
  HandleCreateUserNameChange = (e) => {
    this.setState({
      createUserName: e.target.value,
    });
  }
//whenever something is typed in create_gamename, this function runs and saves the new info as a state
  HandleCreateGameNameChange = (e) => {
    this.setState({
      createGameName: e.target.value
    });
  }
//whenever something is typed in join_username, this function runs and saves the new info as a state
  HandleJoinUserNameChange = (e) => {
    this.setState({
      joinUserName: e.target.value
    });
  }
//whenever something is typed in join_Gamename, this function runs and saves the new info as a state
  HandleJoinGameNameChange = (e) =>{
    this.setState({
      joinGameName: e.target.value
    });
  }
  //event handelr for the create game button
  createGame= (e) => {
    e.preventDefault();
    if(this.state.createUserName != "" || this.state.createGameName != ""){
      CreateButtonClicked(this.state.createUserName,this.state.createGameName);
    }
    else{
      alert("You must've forgot to enter something into the field")
    }
  }
  //event handeler for the join game button
  joinGame= (e) =>{
    e.preventDefault();
    if(this.state.joinUserName != "" || this.state.joinGameName != ""){
      JoinButtonClicked(this.state.joinUserName, this.state.joinGameName);
    }
    else{
      alert("You must've forgot to enter something into the field")
    }
  }

  //react stuff. Don't look below or risk losing atleast 2.4 seconds of your life
  render() {
    return React.createElement("div", null, React.createElement("h1", {
      id: "GameTitle"
    }, "QuipR"), React.createElement("form", {
      id: "gameSetup",
	  onSubmit:"return false"
    }, React.createElement("h1", {
      id: "creGame"
    }, "Create a Game!"), React.createElement("hr", null), React.createElement("input", {
      id: "create_user_name_txt",
      onChange: this.HandleCreateUserNameChange,
      type: "text",
      name: "CU_Name",
      className: "dataForm",
      placeholder: "Enter username"
    }), React.createElement("input", {
      id: "create_game_name_txt",
      onChange: this.HandleCreateGameNameChange,
      type: "text",
      name: "CR_name",
      className: "dataForm",
      placeholder: "Enter room name"
    }), React.createElement("br", null), React.createElement("button", {
      id: "create_game_btn",
      onClick: this.createGame,
      className: "dataForm"
    }, "Create a Game!"), React.createElement("h1", {
      id: "joGame"
    }, "Join a game!"), React.createElement("hr", null), React.createElement("input", {
      id: "join_user_name_txt",
      onChange: this.HandleJoinUserNameChange,
      type: "text",
      name: "JU_Name",
      className: "dataForm",
      placeholder: "Enter username"
    }), React.createElement("input", {
      id: "join_game_name_txt",
      onChange: this.HandleJoinGameNameChange,
      type: "text",
      name: "JR_Name",
      className: "dataForm",
      placeholder: "Enter room name"
    }), React.createElement("br", null), React.createElement("button", {
      id: "join_game_btn",
      onClick: this.joinGame,
      className: "dataForm"
    }, "Join a game!")));
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(LikeButton), domContainer);