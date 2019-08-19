/*Just a setTimeout Wrapper... implements a queue that will fill
upp over time and empty over time as the users append the list
and the functions run to retract it.
*/
class TimeBomb {
    constructor(myFunc,args, timer){
        this.myFunction = myFunc;
        this.Time = timer * 1000;
        this.args = args;
    }
}

function check(object) {
    if(object != null) {
        if(object.TimeArray != null) {
            if(object.isFinished == true && object.TimeArray[0] != null) {
                object.time = object.TimeArray[0].Time;
                this.isFinished = false;
                object.start();
            }
            else {
                // console.log("object.TimeArray[0] is now null.");
            }
        }
    }
}

class Timer {
    constructor(TimeBomb) {
        this.TimeArray = [];
        this.TimeArray.push(TimeBomb);
        this.time = TimeBomb.Time;
        this.isFinished = false;
        this.timer;
        this.roundTimer;
    }
    
    start() {
        this.timer = setTimeout(() => {
            //runs the function with the arguments... function
            if(this.TimeArray[0].args != null){
                this.TimeArray[0].myFunction(this.TimeArray[0].args);
            }
            else {
                this.TimeArray[0].myFunction();
            }
            //removes the function and sets up the next one... if there is one..
            this.TimeArray.shift();
            this.isFinished = true;
            //check if there are items queued up in the queueue.
            check(this);
        }, this.time);
    }

    stop(){
        clearTimeout(this.timer);
        clearTimeout(this.roundTimer);
    }

    appendTB(TimeBomb){
        this.TimeArray.push(TimeBomb);
        check(this);
    }
}