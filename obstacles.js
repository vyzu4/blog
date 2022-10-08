const obstacles_array = [];

class Obstacle {
    constructor(){
        this.top = (Math.random() * canvas.height/3) + 20;
        this.bottom = (Math.random() * canvas.height/3) + 20;
        this.x = canvas.width;
        this.width = 20;
        this.color = 'hsla(' + hue + ', 100%, 50%)';
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    update(){
        this.x -= game_speed;
        this.draw();
    }
}

function handle_obstacles(){
    if (frame % 50 === 0){ //distance between obstacles
        obstacles_array.unshift(new Obstacle);
    }
    for (let i = 0; i < obstacles_array.length; i++){
        obstacles_array[i].update();
    }
    if (obstacles_array.length > 20){
        obstacles_array.pop(obstacles_array[0]);
    }
}

//-------------------------------------------------------------------------------------------------------------
