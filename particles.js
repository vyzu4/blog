const particles_array = [];

class Particle {
    constructor(){
        this.x = bird.x;
        this.y = bird.y;
        this.size = Math.random() * 7 + 3; //random size
        this.speedY = (Math.random() * 1) - 0.5; //speed at which partices move vertically
        this.color = 'hsla(' + hue + ', 100%, 50%, 0.8)'; //rainbow particles
    }
    update(){
        this.x -= game_speed; //particles moves to the left
        this.y += this.speedY; //particles moves up and down
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath(); //start drawing
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handle_particles(){
    particles_array.unshift(new Particle);
    for (i = 0; i < particles_array.length; i++){
        particles_array[i].update();
        particles_array[i].draw();
    }
    // if more than 200, remove 20
    if (particles_array.length > 200){
        for (let i = 0; i < 20; i++){
            particles_array.pop(particles_array[i]); //removes last element in array
        }
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------
