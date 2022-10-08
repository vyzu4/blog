class Bird {
    constructor(){
        this.x = 150; //x coordinate
        this.y = 200; //y coordinate
        this.vy = 0; //velocity of y
        this.width = 20;
        this.height = 20;
        this.weight = 1;
    }
    //simulates acceleration 
    update(){
        let curve = Math.sin(angle) * 20;
        //player always stays within canvas
        if (this.y > canvas.height - (this.height * 3) + curve){
            this.y = canvas.height - (this.height * 3) + curve;
            this.vy = 0;
        }
        else {
            this.vy += this.weight;
            this.vy *= 0.9; 
            this.y += this.vy;
        }
        if (this.y < 0 + this.height){
            this.y = 0 + this.height;
            this.vy = 0; //makes player fall instantly 
        }
        if (space_pressed && this.y > this.height * 3){
            this.flap();
        } 

    }
    draw(){
        ctx.fillStyle = 'red'; //player
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //every time the bird flaps, y velocity decreases (goes up)
    flap(){
        this.vy -=2;
    }
}

const bird = new Bird();

//-------------------------------------------------------------------------------------------------------------------------------------
