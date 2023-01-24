class Background{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 500;
        this.height = 580;
        this.image = document.getElementById('background');
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

const background = new Background();

class Ground{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 500;
        this.height = 150;
        this.image = document.getElementById('bottom');
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y + canvas.height - this.height - 5, this.width, this.height + 5); //the 5s are to make it look good
    }
}

const ground = new Ground();