const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 730;

let spacePressed = false;
let frame = 0;

let score = 0;
let gameSpeed = 2;


function animate(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.draw(ctx); //draw background

    handleTopObstacles();
    handleBottomObstacles();

    bird.update(); //gives bird movement
    bird.draw(ctx); //draws bird

    ground.draw(ctx); //draw ground

    ctx.font = "25px Georgia";
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 5, 30);

    topCollision();
    bottomCollision();
  
    if (topCollision() || bottomCollision()){
        return;
    }

    requestAnimationFrame(animate);

    frame++;
}

animate();

window.addEventListener('keydown', function(e){

    if(e.code === 'Space'){
        spacePressed = true;
    }

});

window.addEventListener('keyup', function(e){

    if(e.code === 'Space'){
        spacePressed = false;
    }

});

function topCollision(){

    for(let i = 0; i < topObstaclesArray.length; i++){

        if ((bird.x < topObstaclesArray[i].x + topObstaclesArray[i].width) &&
            (bird.x + bird.width > topObstaclesArray[i].x) &&
            (bird.y < topObstaclesArray[i].y + topObstaclesArray[i].height) &&
            (bird.y + bird.height > topObstaclesArray[i].y)){

                ctx.font = "25px Georgia";
                ctx.fillStyle = 'black';
                ctx.fillText('Game Over', canvas.width/2 - 50, canvas.height/2);
                
                return true;
                
        }
    }
}

function bottomCollision(){

    for(let i = 0; i < bottomObstaclesArray.length; i++){

        if ((bird.x < bottomObstaclesArray[i].x + bottomObstaclesArray[i].width) &&
            (bird.x + bird.width > bottomObstaclesArray[i].x) &&
            (bird.y < bottomObstaclesArray[i].y + bottomObstaclesArray[i].height) &&
            (bird.y + bird.height > bottomObstaclesArray[i].y)){

                ctx.font = "50px Georgia";
                ctx.fillStyle = 'black';
                ctx.fillText('Game Over', canvas.width/2 - 123, canvas.height/2 - 50);
                return true;
        }
    }
}
