class Bird{

    constructor(){
        this.x = 50; //x position
        this.y = 50; //y position
        this.vy = 0; //velocity of y
        this.width = 60; //bird width
        this.height = 45; //bird height
        this.weight = 0.5;
        this.image = document.getElementById('flappyBird');
    }

    update(){

        //ensures bird doesn't fall below bottom boundary
        if(this.y > canvas.height - this.height - ground.height){ 
            this.y = canvas.height - this.height - ground.height;
            this.vy = 0; //reset velocity
        }
        else{
            //gravity acceleration simulator, bird falling
            this.vy += this.weight;
            this.y += this.vy;
        }

        //ensures bird doesn't fall above top boundary
        if(this.y < 0){
            this.y = 0;
            this.vy = 0; //reset velocity
        }

        if(spacePressed){
            this.flap();
        }
        
    }

    draw(context){
        // // the following code is for testing
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);

        // ctx.fillStyle = 'black';
        // ctx.fillRect(this.x, this.y, 10, 10);

        // context.strokeRect(this.x, this.y, this.width, this.height); //outlines bird
        
        context.drawImage(this.image, this.x, this.y); //draw bird
        
    }

    //flap method
    flap(){
        this.vy -= 1; //bird accelerates up
    }
}

const bird = new Bird();
