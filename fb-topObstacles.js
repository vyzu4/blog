const topObstaclesArray = [];

class topObstacle {

    constructor(){
        this.x = canvas.width; 
        this.y = (-Math.random() * (background.height/4)) - 100;  
        this.width = 60; 
        this.height = 300;

        //score keeping variable
        this.counted = false;

        this.image = document.getElementById('topPipe');
    }

    update(){
        this.x -= gameSpeed;

        //score counter
        if (!this.counted && bird.x > this.x){
            score++;
            this.counted = true;
        }

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

function handleTopObstacles(){

    if(frame % 80 === 0){ //every 80 frames
        topObstaclesArray.unshift(new topObstacle); //add new instance of obstacle to beginning of array
    }

    for(let i = 0; i < topObstaclesArray.length; i++){
        topObstaclesArray[i].update();
    }

    //dont want obstacleArray to be too long
    //max 20 elements
    if(topObstaclesArray.length > 20){ //if longer than 20
        topObstaclesArray.pop(topObstaclesArray[0]); //remove 1 element
    }
}