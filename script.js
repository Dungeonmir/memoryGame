let originDiv = document.getElementById("origin");
let scoreNode = document.getElementById("score");
let state = 'init';
let fieldSizeInput = document.getElementById('fieldSize');

function generateRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array){
    //Тасование Фишера — Йетса
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
class Score{
    constructor(rootNode, tilesAll){
        this.rootNode = rootNode;
        this.tilesFlipped = 0;
        this.tilesDone = 0;
        this.tilesAll = tilesAll;
        
    }
    create(){
        let tilesFlippedP = document.createElement('p');
        let tilesDoneP = document.createElement('p');
        tilesFlippedP.textContent = 'Tiles done: 0' +  '/' + this.tilesAll;
        tilesDoneP.textContent = 'Tiles Flipped: 0';
        this.rootNode.appendChild(tilesDoneP);
        this.rootNode.appendChild(tilesFlippedP);
    }
    update(tilesDone, tilesFlipped, tilesAll){
        this.tilesAll = tilesAll;
        this.tilesDone = tilesDone;
        this.tilesFlipped = tilesFlipped; 
       
        let children = this.rootNode.childNodes;
        let tilesDoneP = children[0];
        let tilesFlippedP = children[1];
        tilesFlippedP.textContent = 'Tiles done: ' + this.tilesDone+ '/' + this.tilesAll;
        tilesDoneP.textContent = 'Tiles Flipped: '+ this.tilesFlipped ;
        

    }
    clear(){
        while (this.rootNode.firstChild) {
            this.rootNode.removeChild(this.rootNode.firstChild);
        }
    }
}
class Tile{
    constructor(id, width, height, tileValue){
        this.id = id;
        this.width = width;
        this.height = height;
        this.tileValue = tileValue;
        this.flipped = false;
        this.node = null;
        this.done = false;
        this.canFlip = false;
    }
    create(classId){
        
        let div = document.createElement('div');
        div.className = 'card';
        
        let divFront = document.createElement('div');
        divFront.style.width = '100px';
        divFront.style.height = '100px';
        divFront.id = 'flipCard' + classId;
        divFront.className = 'frontCard';

        let divBack = document.createElement('div');
        divBack.style.width = '100px';
        divBack.style.height = '100px';
        divBack.id = 'flipCardBack' + classId;
        divBack.className = 'backCard';
        div.appendChild(divFront);
        div.appendChild(divBack);
        
        let paragraph = document.createElement('p');
        divFront.appendChild(paragraph);
        this.node = originDiv.appendChild(div);
        this.node.addEventListener("click", ()=>{
            if (state=='new turn' || state =='start') {
                this.flip();
            }
            
        })
        
    }
    setColor(color){
        this.node.style.backgroundColor = color;
    }
    flip(){
        
        if (this.flipped && !this.done) {
            this.node.classList.remove("isFlipped");
            this.flipped=false;    
                     
        }
        else{
            this.node.classList.add("isFlipped");
            this.node.childNodes[1].textContent = this.tileValue;
            this.flipped = true;
        }
    }
}
class Game{
    constructor (fieldWidth, fieldHeight, gameMode, rootNode){
        this.fieldWidth = fieldWidth;
        this.fieldHeight = fieldHeight;
        this.gameMode = gameMode;
        this.gameTime = 0;
        this.tilesFlippedAll = 0;
        this.tilesFlipped = 0;
        this.tilesDone = 0;
        this.secondsToWaitUntilFlipp = 1;
        this.tilesAll = fieldHeight * fieldWidth;
        this.tilesValueArray = [];
        this.tilesArray = [];
        this.rootNode = rootNode;
        this.won = false;
        
        //console.log(this.tilesArray);
        this.makeField();
        this.score  = new Score(scoreNode, this.tilesAll);
    }
    createRandomArray(length){
        let array = [];
        for (let i = 0; i < length/2; i++) {
           array[i] = i;
            
        }
        for (let i = 0; i +length/2 < length; i++) {
            array[i + length/2] = i;
            
        }
        shuffle(array);
        return array;
    }    
    makeField(){
        this.tilesValueArray = this.createRandomArray(this.tilesAll);
        for (let i = 0; i < this.tilesAll; i++) {
            let tile = new Tile(i, 100, 100, this.tilesValueArray[i]);
            this.tilesArray[i] = tile; 
            tile.create();
        }
        //setTimeout(() => {console.log(this.tilesArray[0])}, 1000);
    }
    changeField(width, height){
        this.fieldWidth = width;
        this.fieldHeight = height;
        this.tilesAll = width * height;
        this.makeField();
    }
    start(){
        this.score.create();
        this.score.update(this.tilesDone, this.tilesFlippedAll, this.tilesAll)

        let newTile;
        let previousTile;
        state = 'start';
        for (let i = 0; i < this.tilesArray.length; i++) {
            this.tilesArray[i].node.addEventListener("click",()=>{
                if (this.tilesArray[i].flipped && !this.tilesArray[i].done) {
                    
                
                this.tilesFlipped++;
                this.tilesFlippedAll++;
                previousTile = newTile;
                newTile = this.tilesArray[i];
                
                console.log(this.tilesFlipped);
                if (previousTile!=null) {
                    
                
                    
                    if (previousTile.tileValue == newTile.tileValue &&
                        previousTile.id !=newTile.id &&!newTile.done && newTile!=null) {
                        previousTile.done = true;
                        newTile.done = true;
                        newTile.node.classList.add('done');
                        previousTile.node.classList.add('done');
                        this.tilesDone+=2;
                        this.tilesFlipped = 0;
                        console.log('Tiles done: ' + this.tilesDone);
                        state = 'new turn';
                        if (this.tilesAll == this.tilesDone) {
                            this.won = true;
                            this.stop();
                        }
                    }
                    if (this.tilesFlipped>1) {
                        state = 'animation';
                        console.log('state: ' + state);
                        if (!newTile.done && !previousTile.done && newTile.flipped &&previousTile.flipped) {
                            setTimeout(() => {
                                newTile.flip();
                                previousTile.flip();
                                newTile = null;
                                previousTile = null;
                                this.tilesFlipped=0;
                                state = 'new turn';
                                console.log('state: ' + state);
                            }, this.secondsToWaitUntilFlipp*1000);
                            
                        }
                        
                    }
                    
                    
                }
            } this.score.update(this.tilesDone, this.tilesFlippedAll, this.tilesAll);
            });
        }
        
        
        /*while (this.tilesAll != this.tilesDone) {
            this.newTurn();
        }*/
        
        
    }
    stop(){
        this.tilesDone = 0;
        while (this.rootNode.firstChild) {
            this.rootNode.removeChild(this.rootNode.firstChild);
        }
        this.score.clear();
        state = 'pause';
        console.log('Игра окончена');
    }
}

let game = new Game(3, 6, 'easy', originDiv);
game.start();
fieldSizeInput.addEventListener('change', ()=>{
    game.stop();
    switch (fieldSizeInput.valueAsNumber) {
        case 0:
            game.changeField(2, 3);
            break;
        case 1:
            game.changeField(3, 4);
            break;
        case 2:
            game.changeField(3,6);
            break;
        case 3:
            game.changeField(4,5);
            break;
        case 4:
            game.changeField(5,6);
            break;
        case 5:
            game.changeField(6,6);
            break;
    
        default:
            game.changeField(2,2);
            break;
    }
    game.start();
    
    console.log('input value: ' + fieldSizeInput.valueAsNumber)
})
console.log(game.tilesValueArray);