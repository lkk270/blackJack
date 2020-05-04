//const api = require("../api/index.js")
//import api from '../api/index.js';

//const fetch = require("node-fetch");
class Hand{
    
    p(obj){
        const url = "http://localhost:3000/api/hands";
        fetch(url, {
            method : "POST",
            //body: new FormData(document.getElementById("inputform")),
            // -- or --
            body : JSON.stringify({
                initials : obj.initials,
                computerHand: obj.computerHand,
                userHand: obj.userHand,
                computerTotal: obj.computerTotal,
                userTotal: obj.userTotal,
                result: obj.result
            })
        }).then(
            response => response.text() // .json(), etc.
            // same as function(response) {return response.text();}
        ).then(
            html => console.log(html)
        );
    }

    insertHand= payload => $.post("http://localhost:3000/api/hand", payload);
    //getAllHands = () => api.get(`/hands`);
   //getHandById = id => api.get(`/hand${id}`);


    constructor(initials, computerHand, userHand, computerTotal, userTotal, result) {
        this.initials = initials;
        this.computerHand = computerHand;
        this.userHand = userHand;
        this.computerTotal = computerTotal;
        this.userTotal = userTotal;
        this.result = result;
    }
       
  
    addInitials = async event => {
        const initials = event.target.value;
        this.initials = initials;
    }

    addComputerHand= async event => {
        const computerHand = event.target.value;
        this.computerHand = computerHand;
    }

    addUserHand = async event => {
        const userHand = event.target.value;
        this.userHand = userHand;
    }

    addComputerTotal= async event => {
        const computerTotal = event.target.value;
        this.computerTotal = computerTotal;
    }

    addUserTotal= async event => {
        const userTotal = event.target.value;
        this.userTotal = userTotal;
    }

    addResult= async event => {
        const result = event.target.value;
        this.result = result;
    }

    handleIncludeHand= async () => {
        const {initials, computerHand, userHand, computerTotal, userTotal, result } = this;
        const payload = {initials, computerHand, userHand, computerTotal, userTotal, result };

        await this.insertHand(payload).then(res => {
            window.alert(`Hand inserted successfully`);
        });
    }
    
}

export default Hand;