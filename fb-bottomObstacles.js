const bottomObstaclesArray = [];

class bottomObstacle {

    constructor(){
        this.x = canvas.width; 
        this.y = (Math.random() * (background.height/4)) + (background.height * 0.66); 
        this.width = 60; 
        this.height = 300;
        
        this.image = document.getElementById('bottomPipe');
    }

    update(){
        this.x -= gameSpeed;
        this.draw(ctx); //pass ctx as context
    }

    draw(context){
        // // the following code is for testing
        // ctx.fillStyle = 'green'; //colour of bar
        // ctx.fillRect(this.x, this.y, this.width, this.height); //draws bottom bar
        
        // ctx.fillStyle = 'black';
        // ctx.fillRect(this.x, this.y, 10, 10);

        context.drawImage(this.image, this.x, this.y, this.width, this.height); //draws bottom bar
    }

}

function handleBottomObstacles(){

    if(frame % 80 === 0){ //every 80 frames
        bottomObstaclesArray.unshift(new bottomObstacle); //add new instance of obstacle to beginning of array
    }

    for(let i = 0; i < bottomObstaclesArray.length; i++){
        bottomObstaclesArray[i].update();
    }

    //dont want obstacleArray to be too long
    //max 20 elements
    if(bottomObstaclesArray.length > 20){ //if longer than 20
        bottomObstaclesArray.pop(bottomObstaclesArray[0]); //remove 1 element
    }
}
