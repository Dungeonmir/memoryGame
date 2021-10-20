let originDiv = document.getElementById("origin");

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
        this.node = originDiv.appendChild(div);
        this.node.addEventListener("click", ()=>{
            this.flip();
        })
    }
    setColor(color){
        this.node.style.backgroundColor = color;
    }
    flip(){
        if (this.flipped) {
            this.node.textContent = '';
            this.flipped=false;
        }
        else{
            this.node.textContent = this.tileValue;
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
    newTurn(){

        
        
            
        
    }
    start(){
        let value;
        let previousValue;
        this.state = 'start';
        for (let i = 0; i < this.tilesArray.length; i++) {
            this.tilesArray[i].node.addEventListener("click",()=>{
                this.tilesFlipped++;
                previousValue = value;
                value = this.tilesArray[i].tileValue;
                
                console.log(this.tilesFlipped);
                
                    
                    if (previousValue == value) {
                        for (let j = 0; j < this.tilesArray.length; j++) {
                            if (this.tilesArray[j].tileValue==value) {
                                this.tilesArray[j].done = true;
                                console.log(this.tilesArray[j]);
                            }
                            
                        }
                    }
                    if (this.tilesFlipped>1) {
                        setTimeout(() => {
                            for (let k = 0; k < this.tilesArray.length; k++) {
                            
                                if (this.tilesArray[k].flipped && !this.tilesArray[k].done) {
                                    this.tilesArray[k].flip();
                                    this.tilesFlipped = 0;
                                }
                            }
                        }, this.secondsToWaitUntilFlipp*1000);
                        
                    }
                    
                    
                
            });
        }
        
        
        /*while (this.tilesAll != this.tilesDone) {
            this.newTurn();
        }*/
        this.pause();
    }
    pause(){
        this.state = 'pause';
    }
}
let game = new Game(5, 6, 'easy', originDiv);
game.start();
console.log(game.tilesValueArray);