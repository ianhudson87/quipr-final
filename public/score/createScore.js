//god knows what this means
'use strict';

//a handy shortcut. get used to it.
const c = React.createElement;

class Lobii extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gameName:"ph",
        gold:"Bed",
        silver:"Chair",
        bronz:"Floor"
    };
    window.reactComponent=this;
  }

  setGameName(name){
    this.setState({
        gameName:name
    })
  }
  setGold(name){
    this.setState({
        gold:name
    })
  }
  setSilver(name){
    this.setState({
        silver:name
    })
  }
  setBronz(name){
    this.setState({
        bronz:name
    })
  }

  componentDidMount(){
    //reactDone();//announces to the socket script that React is done mounting (god knows what tho...)
  }

  //renders to the "html" page to the web to your computer~...
  render() {
    return(
      //c is React.createElement, btw. See line 2
        c("div", {id: "stage"}, 
            c("h1", {id: "GameTitle"}, "QuipR"),
            c("h2", {id: "game_name_display"}, "Room Name: " + this.state.gameName+"( ; _ ;)"),
            c("div", {id: "mainContent"},
                c("hr", null),
                c("h2", {id: "pageTitle"}, "Scoreboard"),
                c("hr", null),
                c("h2", {id:"winner"},"Winner: \n"+ this.state.gold),
                c("div",{className:"row"},
                    c("div",{className:"column"},
                        c("p",{id:"second_place"},"Second Place loser: \n"+this.state.silver)
                    ),
                    c("div",{className:"column"},
                        c("p",{id:"answer2"},"fake gold:\n"+this.state.bronz)
                    )
                ),
                c("hr", null),
                c("h2", null,"*clap,*clap,*clap! Applauses abound!")
            )
        )
    );//end of return
  }//end of render
}

const domContainer = document.querySelector('#root');
ReactDOM.render(c(Lobii), domContainer);