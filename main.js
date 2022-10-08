const canvas = document.getElementById("canvas1"); //bird
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let space_pressed = false; //for space bar and clicks
let angle = 0; //make bird move up/down
let hue = 0; //colour
let frame = 0; //keep track of frame count
let score = 0; //score count (passing obstacles)
let game_speed = 2; 

let temp = canvas.height - 90;

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas
    //ctx.fillRect(10, canvas.height - 90, 50, 50); //draws reactangle
    handle_obstacles(); 
    handle_particles();
    bird.update();
    bird.draw();
    handle_collisions();

    //if collision is detected, stop game!
    if (handle_collisions()){
        return;
    }

    requestAnimationFrame(animate); //recursive animation loop
    angle += 0.12;
    hue++;
    frame++;
}

animate(); //calls function

window.addEventListener('keydown', function(e){ 
    if (e.code === 'Space'){
        space_pressed = true; //space key is pressed 
    } 
});

window.addEventListener('keyup', function(e){ 
    if (e.code === 'Space'){
        space_pressed = false; //space key is released
    }
});

const bang = new Image();
bang.src = 'images/bang.png';

function handle_collisions(){
    for(let i = 0; i < obstacles_array.length; i++){
        //collision detected
        if (bird.x < obstacles_array[i].x + obstacles_array[i].width &&
            bird.x + bird.width > obstacles_array[i].x &&
            ((bird.y < 0 + obstacles_array[i].top && bird.y + bird.height > 0) || (bird.y > canvas.height - obstacles_array[i].bottom && bird.y + bird.height < canvas.height))){
                ctx.drawImage(bang, bird.x, bird.y, 50, 50);
                return true;
            }
    }
}
