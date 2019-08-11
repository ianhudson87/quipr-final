'use strict';

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

  HandleCreateUserNameChange = (e) => {
    this.setState({
      createUserName: e.target.value,
    });
  }

  HandleCreateGameNameChange = (e) => {
    this.setState({
      createGameName: e.target.value
    });
  }

  HandleJoinUserNameChange = (e) => {
    this.setState({
      joinUserName: e.target.value
    });
  }

  HandleJoinGameNameChange = (e) =>{
    this.setState({
      joinGameName: e.target.value
    });
  }

  createGame= (e) => {
    e.preventDefault();
    CreateButtonClicked(this.state.createUserName,this.state.createGameName);
  }

  joinGame= (e) =>{
    e.preventDefault();
    JoinButtonClicked(this.state.joinUserName, this.state.joinGameName);
  }

  render() {
    return React.createElement("div", null, React.createElement("h1", {
      id: "GameTitle"
    }, "QuipR"), React.createElement("form", {
      id: "gameSetup"
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