// main.js

import Hand from '../insertHandClass/insertHand.js';

//const insertH = require("../insertHandClass/insertHand.js");

let result = '';
const suits = ["clubs", "diamonds", "hearts", "spades"];
const cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const cardValueKey = {"J": 10, "Q": 10, "K": 10, "A": 11};

let user = {name: 'user', cards: new Array(), total: 0};
let comp = {name: 'comp', cards: new Array(), total: 0};

document.addEventListener('DOMContentLoaded', main);

function postInitials(initials) {
    console.log(initials);
    // Form fields, see IDs above
    const params = {
        initials: initials,
        computerHand: handToString(comp.cards),
        userHand: handToString(user.cards),
        computerTotal: comp.total,
        userTotal: user.total,
        result: result,
    }
    console.log(params);
    const http = new XMLHttpRequest()
    http.open('POST', 'http://localhost:3000/api/hand')
    http.setRequestHeader('Content-type', 'application/json')
    http.send(JSON.stringify(params)) // Make sure to stringify
    http.onload = function() {
        // Do whatever with response
        
        alert(http.responseText);
        
    }
}

function handToString(cards){
    let ret = '';
    for(let i = 0; i < cards.length; i++){
        ret += cards[i].cardValue + cards[i].suit + ' ';
    }
    return ret;
}
function listenForInitalInsert(){
    const play = document.getElementById('dbUpload');  
    play.addEventListener('click', function(evt){
        evt.preventDefault();
        const initals = getInitialsInput();
        postInitials(initals);
            
    });
}

function toggleDbForm() {
    const f = document.getElementById("dbForm");
    f.style.display === "none" ? f.style.display = "block" : f.style.display = "none";
}

function rTable(){
    const head = "<tr><th>User's Initials</th><th>Result</th><th>User Hand</th><th>Computer's Hand</th></tr>";
    let obj, userHand, dbParam, xmlhttp, myObj, txt = "";
    obj = { table: "Hands", limit: 20 };
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);
            console.log(myObj);
            txt += "<table border='1'>" + head;
            //userHand = "<table border='1'>"
            for (let i = myObj["data"].length-1; i >  (myObj["data"].length - 6); i--) {
                const hand = myObj["data"][i];
                txt += "<tr><td>" + hand.initials + "</td><td>" + hand.result + "</td><td>" +
                hand.userHand + " = " +  hand.userTotal + "</td><td>" + hand.computerHand + " = " +  hand.computerTotal 
                + "</td></tr>";
                //userHand = "<tr>"
            }
            //userHand += "</table>"  
            txt += "</table>"    
            document.getElementById("demo").innerHTML += txt;
        }
    };
    xmlhttp.open("GET", "http://localhost:3000/api/hands", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("x=" + dbParam);
}

function main() {
    window.deck = createDeck();
    shuffle();
    listenForPlay();
    listenForPickForMe();  
}

function mainFuncs(){
    rTable();
    initializeHands();
    console.log(user.cards);
    console.log(comp.cards);
    getTotal(comp);
    getTotal(user);
    document.body.style.backgroundImage = "url('/stylesheets/felt.png')";
    createBtns();
    createText();
    document.getElementById('compInfo').innerHTML = "Computer Hand - Total: ?";
    displayUserTotal();
    renderDeal();
    removeForm('dform');
    givenBlackJack();
    listenForHit();
    listenForStand();
    listenForRestart();
}

function listenForPlay(){
    const play = document.getElementById('playBtn');  
    play.addEventListener('click', function(evt){
        const input  = getInput()
        window.deck = addToDeck(input);
        evt.preventDefault();
        mainFuncs();
            
    });
}


function listenForRestart(){
    toggleDbForm();
    const restrt = document.getElementById("gameCont");
    restrt.addEventListener('click', function(evt){
        document.getElementById("g").innerHTML = ""; 
        reCreatePlayDiv();
        result = '';
        user = {name: 'user', cards: new Array(), total: 0};
        comp = {name: 'comp', cards: new Array(), total: 0};
        deck = createDeck();
        console.log(deck)
        shuffle();
        //evt.preventDefault();
        mainFuncs();
        console.log('yooo')
    })
}

function listenForPickForMe(){
    const noPlay = document.getElementById('noPlayBtn');  
    noPlay.addEventListener('click', function(evt){
        evt.preventDefault();
        mainFuncs();
    });
}

function listenForHit(){
    const hit = document.getElementById('hit'); 
    hit.addEventListener('click', function(evt){
        hitPress(user);
        displayUserTotal();
        
    });
}

function listenForStand(){
    const stand = document.getElementById("stand");
    stand.addEventListener('click', function(evt){
        displayUserTotal();
        hideActionBtns();
        addOneCard(comp.cards, comp, 1, true);
        compHit();
        
    });
}


function hitPress(player){
    console.log(user);
    console.log(comp)
    player.cards.push(window.deck[0]);
    addOneCard(player.cards, player, player.cards.length, false);
    window.deck.splice(0,1);
    if(user.total === 21){
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
        addOneCard(comp.cards, comp, 1, true);
        compHit();
    }
    else if(user.total > 21){
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
        addOneCard(comp.cards, comp, 1, true);
        displayCompTotal();
        addStatusText(-1);
        return;
    }
    
}

function compHit(){
    let limit = 17;
    let cHit = false;
    while(comp.total < 17){
        hitPress(comp);
        cHit = true;
    }
    if(!cHit)
    {
        console.log(cHit);
        if(user.total < comp.total && user.total !== 21){
            addStatusText(-1);
        }
        else if(user.total === 21 && comp.total !== 21){
            addStatusText(1);
        }
        else if(user.total > 21){
            addStatusText(-1);
        }
        else if(user.total < 21 && user.total === comp.total){
            addStatusText(0);
        }
        else if(user.total < 21 && user.total > comp.total){
            addStatusText(1);
        }
    }
    else{
        if(comp.total === 21 && user.total !== 21){
            addStatusText(-1);
        }
        else if(comp.total === 21 && user.total === 21){
            addStatusText(0);
        }
        else if(user.total <= 21 && user.total > comp.total){
            addStatusText(1);
        }
        else if(user.total <= 21 && user.total === comp.total){
            addStatusText(0);
        }
        else if(comp.total > 21 && user.total <= 21){
            addStatusText(1);
        }
        else if(comp.total < 21 && user.total < comp.total){
            addStatusText(-1);
        }
    }
   
    console.log('compHit');
    displayCompTotal();
}

function showHiddenCard(){
    document.getElementById("compName0").innerHTML = '?'
    document.getElementById("compName2").innerHTML = '?'
}

function givenBlackJack(){
    if(user.total === 21){
        hideActionBtns();
        compHit();
    }
}


function hideActionBtns(){
    document.getElementById('hit').style.display = "none";
    document.getElementById('stand').style.display = "none";
}

function disableActionBtns(){
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}


function addStatusText(win){
    toggleDbForm();
    let head = document.createElement("H3");
    head.setAttribute('class', 'status');
    head.setAttribute('id', 'statusText');
    document.body.appendChild(head);
    document.getElementById('play').appendChild(head);

    if(win === 1)
    {
        document.getElementById('statusText').innerHTML += "  YOU WON!!!! :)";
        result = 'WIN';   
    }
    else if(win === 0){
        document.getElementById('statusText').innerHTML += "  YOU TIED";
        result = 'TIE';
    }
    else if(win === -1){
        document.getElementById('statusText').innerHTML += "  YOU LOST :((";
        result = 'LOSS';
    }

    hideActionBtns();       
    document.getElementById('gameCont').style.display = "block";
    listenForInitalInsert();
}


function getInput(){
    const i = document.getElementById('startValues').value;
    return i;
}

function getInitialsInput(){
    const i = document.getElementById('intials').value;
    return i;
}


function removeElement(id) {
    // Removes an element from the document
    const element = document.getElementById(id);
    element.remove();
}


function removeForm(id){
    document.getElementById(id).style.display = "none";
}


function createDeck(){
    let deck = new Array();
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < cardValues.length; j++){
            const card = {suit: suits[i], cardValue: cardValues[j]}
            deck.push(card);
        }
    }
    return deck;
}


function shuffle(){
    for (let i = 0; i < 500; i++)
    {
        const place1 = Math.floor((Math.random() * window.deck.length));
        const place2 = Math.floor((Math.random() * window.deck.length));
        const temp = window.deck[place1];

        window.deck[place1] = window.deck[place2];
        window.deck[place2] = temp;
    }
}


function toArray(input){
    return input.toUpperCase().replace(/\s/g, '').split(',');
}


function addToDeck(input){
    let randomArr = new Array();
    let inputArr = new Array();
    let addArr = new Array();
    if(input !== ''){
        inputArr = toArray(input);
    }
    for(let i = 0; i < inputArr.length; i++){
        const num = Math.floor((Math.random() * suits.length));
        randomArr.push(num);
    }
    for(let i = 0; i < inputArr.length; i++){
        const card = {suit: suits[randomArr[i]], cardValue: inputArr[i]}
        addArr.push(card);
    }
    return addArr.concat(window.deck);  
}


function initializeHands(){
    for(let i = 0; i < 4; i++){
        i%2 === 0 ? comp.cards.push(window.deck[i]) : user.cards.push(window.deck[i]);
    }
    window.deck.splice(0,4);
}


function getTotal(player){
    let total = 0;
    for(let i = 0; i < player.cards.length; i++){
        let cardVal = player.cards[i].cardValue;
        if(cardVal === "J" || cardVal === "Q" || cardVal === "K" || cardVal === "A"){
            total += cardValueKey[player.cards[i].cardValue];
        }
        else{
            total += parseInt(player.cards[i].cardValue);
        } 
    }
    for(let i = 0; i < player.cards.length; i++){
        let cardVal = player.cards[i].cardValue;
        if(total > 21 && cardVal === "A"){
            total -= 10;
        }
    }
    player.total = total;
}


function reCreatePlayDiv(){
    let playDiv = document.createElement("div");
    playDiv.setAttribute('class', 'run');
    playDiv.setAttribute('id', 'play');
    document.getElementById('g').appendChild(playDiv);
}

function createBtns(){
    let hitBtn = document.createElement("INPUT");
    let standBtn = document.createElement("INPUT");
    let restartBtn = document.createElement("INPUT");
    hitBtn.setAttribute('class', 'moves');
    standBtn.setAttribute('class', 'moves');
    hitBtn.setAttribute('id', 'hit');
    standBtn.setAttribute('id', 'stand');
    hitBtn.setAttribute('value', 'Hit');
    standBtn.setAttribute('value', 'Stand');
    hitBtn.setAttribute('type', 'button');
    standBtn.setAttribute('type', 'button');
    restartBtn.setAttribute('class', 'restart');
    restartBtn.setAttribute('id', 'gameCont');
    restartBtn.setAttribute('value', 'Restart!');
    restartBtn.setAttribute('type', 'button');

    document.body.appendChild(hitBtn);
    document.body.appendChild(standBtn);
    document.getElementById('g').appendChild(hitBtn);
    document.getElementById('g').appendChild(standBtn);

    document.body.appendChild(restartBtn);
    document.getElementById('g').appendChild(restartBtn);
    document.getElementById('gameCont').style.display = "none";
}


function createText(){
    let compArea = document.createElement("div");
    compArea.setAttribute('class', 'area');
    compArea.setAttribute('id', 'compArea');
    document.getElementById('g').appendChild(compArea);
    let head1 = document.createElement("H3");
    head1.setAttribute('class', 'info');
    head1.setAttribute('id', 'compInfo');
    document.body.appendChild(head1);
    document.getElementById('compArea').appendChild(head1);


    let userArea = document.createElement("div");
    userArea.setAttribute('class', 'area');
    userArea.setAttribute('id', 'userArea');
    document.getElementById('g').appendChild(userArea);
    let head2 = document.createElement("H3");
    head2.setAttribute('class', 'info');
    head2.setAttribute('id', 'userInfo');
    document.body.appendChild(head2);
    document.getElementById('userArea').appendChild(head2);

    let compInfo = document.createTextNode("");
    document.getElementById('compInfo').appendChild(compInfo);

    let userInfo = document.createTextNode("");
    document.getElementById('userInfo').appendChild(userInfo);
}


function displayUserTotal(){
    document.getElementById('userInfo').innerHTML = "User Hand - Total: ";
    let userTotal = user.total.toString();

    let userInfoNode = document.getElementById('userInfo');
    let userInfoText = document.createTextNode(userTotal);
    userInfoNode.appendChild(userInfoText);
}


function displayCompTotal(){
    document.getElementById('compInfo').innerHTML = "Computer Hand - Total: ";
    let compTotal = comp.total.toString();
    let compInfoNode = document.getElementById('compInfo');
    let compInfoText = document.createTextNode(compTotal);
    compInfoNode.appendChild(compInfoText);

}


function renderDeal()
{
    const compCards = comp.cards;
    const userCards = user.cards;
    for(let i = 0; i < compCards.length; i++){
        addOneCard(compCards, comp, i+1, false);
    }  
    for(let j = 0; j < userCards.length; j++){
        addOneCard(userCards, user, j+1, false);
    }  
    document.getElementById("compName0").innerHTML = '?'
    document.getElementById("compName2").innerHTML = '?'
}


function runSwitch(suit){
    let pic = '';
    switch(suit){
        case 'clubs':
            pic = "<img src= /stylesheets/club.png width=\"16\" height=\"16\">";
            break;
        case 'diamonds':
            pic = "<img src= /stylesheets/diamond.png width=\"16\" height=\"16\">";
            break;
        case 'hearts':
            pic = "<img src= /stylesheets/heart.jpg width=\"16\" height=\"16\">";
            break;
        case 'spades':
            pic = "<img src= /stylesheets/spade.png width=\"16\" height=\"16\">";
            break;
    }

    return pic
}

function addOneCard(cards, player, num, show){
    let card = document.createElement("div");
    const pic = runSwitch(cards[num - 1].suit)
    if(show === true){
        document.getElementById("compName0").innerHTML = cards[num - 1].cardValue + '' + pic;
        document.getElementById("compName2").innerHTML = cards[num - 1].cardValue + '' + pic;
    }
    
    else{
        const divId = player.name + 'Area';
        let name = document.createElement("div");
        name.setAttribute('class', 'name1');
        name.setAttribute('id', player.name + 'Name' + (num-1));
        name.innerHTML = cards[num - 1].cardValue + '' + pic;

        card.className = player.name + 'Cards';
        card.id = player.name + " " + cards[num - 1].cardValue + " " + cards[num - 1].suit + cards.length;
        document.getElementById(divId).appendChild(card);
        document.getElementById(card.id).appendChild(name);

        let name2 = document.createElement("div");
        name2.setAttribute('class', 'name2');
        name2.setAttribute('id', player.name + 'Name' + (num+1));
        name2.innerHTML = cards[num - 1].cardValue + '' + pic;

        card.className = player.name + 'Cards';
        card.id = player.name + " " + cards[num - 1].cardValue + " " + cards[num - 1].suit + cards.length;
        document.getElementById(divId).appendChild(card);
        document.getElementById(card.id).appendChild(name2);

        getTotal(player); 
    }     
}


