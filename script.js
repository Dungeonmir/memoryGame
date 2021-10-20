let originDiv = document.getElementById("origin");
let scoreNode = document.getElementById("score");

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
    constructor(rootNode){
        this.rootNode = rootNode;
        this.tilesFlipped = 0;
        this.tilesDone = 0;
        let tilesFlippedP = document.createElement('p');
        let tilesDoneP = document.createElement('p');
        tilesFlippedP.textContent = 'Tiles done: 0' ;
        tilesDoneP.textContent = 'Tiles Flipped: 0';
        this.rootNode.appendChild(tilesDoneP);
        this.rootNode.appendChild(tilesFlippedP);
    }
    update(tilesDone, tilesFlipped){
        this.tilesDone = tilesDone;
        this.tilesFlipped = tilesFlipped; 
       
        let children = this.rootNode.childNodes;
        let tilesDoneP = children[0];
        let tilesFlippedP = children[1];
        tilesFlippedP.textContent = 'Tiles done: ' + this.tilesDone;
        tilesDoneP.textContent = 'Tiles Flipped: '+ this.tilesFlipped;
        

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
    }
    create(classId){
        let div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.id = 'flipCard' + classId;
        div.className = 'card';
        let paragraph = document.createElement('p');
        div.appendChild(paragraph);
        this.node = originDiv.appendChild(div);
        this.node.addEventListener("click", ()=>{
            this.flip();
        })
    }
    setColor(color){
        this.node.style.backgroundColor = color;
    }
    flip(){
        if (this.flipped && !this.done) {
            this.node.firstChild.textContent = '';
            this.flipped=false;
        }
        else{
            this.node.firstChild.textContent = this.tileValue;
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
        this.state = 'init';
        this.rootNode = rootNode;
        this.tilesValueArray = this.createRandomArray(this.tilesAll);
        //console.log(this.tilesArray);
        this.makeField();
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
        for (let i = 0; i < this.tilesAll; i++) {
            let tile = new Tile(i, 100, 100, this.tilesValueArray[i]);
            this.tilesArray[i] = tile; 
            tile.create();
            tile.setColor('gray');
        }
        //setTimeout(() => {console.log(this.tilesArray[0])}, 1000);
    }
    
    start(){
        let score  = new Score(scoreNode);
        let newTile;
        let previousTile;
        this.state = 'start';
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
                        previousTile.id !=newTile.id &&!newTile.done) {
                        previousTile.done = true;
                        newTile.done = true;
                        this.tilesDone+=2;
                       
                        console.log('Tiles done: ' + this.tilesDone);
                        
                        if (this.tilesAll == this.tilesDone) {
                            this.pause();
                        }
                    }
                    if (this.tilesFlipped>1) {
                        setTimeout(() => {
                            for (let k = 0; k < this.tilesArray.length; k++) {
                            
                                if (this.tilesArray[k].flipped && !this.tilesArray[k].done) {
                                    this.tilesArray[k].flip();
                                    this.tilesFlipped = 0;
                                    newTile = null;
                                    previousTile = null;
                                }
                            }
                        }, this.secondsToWaitUntilFlipp*1000);
                        
                    }
                    
                    
                }
            } score.update(this.tilesDone, this.tilesFlippedAll);
            });
        }
        
        
        /*while (this.tilesAll != this.tilesDone) {
            this.newTurn();
        }*/
        
        
    }
    pause(){
        this.state = 'pause';
        console.log('Игра окончена');
    }
}

let game = new Game(3, 4, 'easy', originDiv);
game.start();
console.log(game.tilesValueArray);