window.addEventListener('load', function(){ //fires when the whole page loads (includes all dependent resources like style sheets and images)
    //canvas setup (html canvas1, where everything happens)
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d'); //object that contains methods and properties to draw and animate on html canvas
    canvas.width = 1000;
    canvas.height = 500;

    //javascript is a prototype based oop language
    //it has prototypes, NOT classes
    //can use modern javascript syntax that introduced classes as "syntactical sugar"
    //it's just working with prototype based inheritance 

    //keeps track of user entered inputs
    class InputHandler{

        //constructor is a special method on js class
        //when the class is called later, constructor will create a new blank js object 
        constructor(game){

            //objects in js are reference data types
            this.game = game;

            //arrow function used
            //"this" inside arrow function always represents the object in which the arrow function is defined in 
            //can access this.game

            //listens for event
            //variable e is chosen as a custom variable name to represent the event, but can be anything
            window.addEventListener('keydown', e => {
                if( ((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && (this.game.keys.indexOf(e.key) === -1) ){ //add ArrowUp or ArrowDown key to array, and ensures that key is only added once to array
                    this.game.keys.push(e.key); 
                }
                else if(e.key === ' '){ //spacebar
                    this.game.player.shootTop(); //activate shootTop()
                }
                else if(e.key === 'd'){ //toggle
                    this.game.debug = !this.game.debug; //opposite
                }
                            
            });

            //listens for released key
            //use arrow function so "this" is recognized as class InputHandler, not a global object
            window.addEventListener('keyup', e => {

                //indexOf() method returns first index at which given element can be found in array
                //indexOf() method returns -1 if element is not present 
                if (this.game.keys.indexOf(e.key) > -1){ //determines if key has been released 

                    //splice() method removes/replaces existing elements 
                    //removes 1 element at index this.game.keys.indexOf(e.key) 
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                
            });

        }

    }

    //lasers
    class Projectile{

        //constructor method
        constructor(game, x, y){
            this.game = game;
            this.x = x; 
            this.y = y; 
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
        }
        
        //update method
        update(){
            this.x += this.speed; //updates position according to speed

            //if projectile has moved across 80% of game area, it can be deleted
            //so enemies aren't killed off screen
            if (this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
        }

        //draw method
        //here, context is just a variable name
        draw(context){
            context.drawImage(this.image, this.x, this.y);
        }

    }

    //falling stuff from enemies
    class Particle{

        //constructor method
        constructor(game, x, y){
            this.game = game;
            this.x = x; 
            this.y = y; 
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3); //between 0 -> 3
            this.frameY = Math.floor(Math.random() * 3); //between 0 -> 3
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3; //between -3 -> +3
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0; //rotation angle
            this.va = Math.random() * 0.2 - 0.1; //velocity of angle rotation, between -1 -> +1
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 80 + 60; //boundary where particles will bounce, between 60 -> 140
        }

        //update method
        update(){
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;

            if( (this.y > this.game.height + this.size) || (this.x < 0 - this.size) ){ //if particle falls off screen
                this.markedForDeletion = true;
            }

            if( (this.y > this.game.height - this.bottomBounceBoundary) && (this.bounced < 2) ){
                this.bounced++;
                this.speedY *= -0.5;
            }

        }

        //draw method
        draw(context){
            context.save(); //wrap to ensure that the following statements only effect 1 particle at a time
            
            context.translate(this.x, this.y); //translate rotation centerpoint (usually top left of canvas) to object to be rotated
            context.rotate(this.angle); //angle is in rad
            // context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, 0, 0, this.size, this.size); // rotates around top left corner, aka (0, 0) of the gears
            context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size); //rotates around the gears' center points
            
            context.restore();
            //everything resets after .restore()
        }
    }

    //main character
    class Player{
       
        //constructor is a special method on js class
        //when the class is called later, constructor will create a new blank js object 
        constructor(game){
            //class properties
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20; //x position
            this.y = 100; //y position
            this.frameX = 0; //individual player frame in spreadsheet
            this.frameY = 0; //options: 0 & 1 to change player appearance
            this.maxFrame = 37; //number of player frames in spreadsheet
            this.speedY = 0; //player can move up/down
            this.maxSpeed = 3;
            this.projectiles = []; //projectiles array
            this.image = document.getElementById('player'); //player spreadsheet to get image
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }
        
        //update method
        //controls player's movements
        //controls player's vertical boundaries
        //handles the projectiles shot from player
        update(deltaTime){
            //includes() method determines if an array includes a certain value among its entries
            //includes() method returns true or false
            //ArrowUp and ArrowDown will make block move
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed; //player goes up
            }
            else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed; //player goes down
            }
            else{
                this.speedY = 0; //player stays still
            }

            //player position will change based on speedY
            this.y += this.speedY; 

            //checking vertical boundaries

            //bottom boundary
            if(this.y > this.game.height - this.height * 0.5){
                this.y = this.game.height - this.height * 0.5;
            }
            //top boundary
            else if(this.y < -this.height * 0.5){ 
                this.y = -this.height * 0.5;
            }

            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update(); //activate update() method in projectile class
            });

            //filter() method creates new array with all elements that pass the test implemented by provided function
            //every time markedForDeletion == true on a projectile, it will get removed from projectiles[]
            //new projectiles array will rid of projectiles with markedForDeletion = true
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            
            //sprite animation
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }
            else{
                this.frameX = 0;
            }

            //power up
            if(this.powerUp){
                if(this.powerUpTimer > this.powerUpLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0; //normal animation
                }
                else{
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1; //power up animation
                    this.game.ammo += 0.1; //ammo recharges fast
                }
            }
        }


        //draw method
        //takes in a context as an argument
        //context specifies which canvas element to draw on
        draw(context){

            if(this.game.debug){ //if in debug mode
                context.strokeRect(this.x, this.y, this.width, this.height); //show rectangular outline around player
            } 

            this.projectiles.forEach(projectile => {
                projectile.draw(context); 
            });
    
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            
        }

        shootTop(){
            if(this.game.ammo > 0){
                //push new projectiles in array
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                // console.log(this.projectiles);

                //ammo reduced everytime it gets used
                this.game.ammo--;
            }

            if(this.powerUp){
                this.shootBottom();
            }
        }
        shootBottom(){
            if(this.game.ammo > 0){
                //push new projectiles in array
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
                // console.log(this.projectiles);

                //ammo reduced everytime it gets used
                this.game.ammo--;
            }
        }

        enterPowerUp(){
            this.powerUpTimer = 0;
            this.powerUp = true;

            if(this.game.ammo < this.game.maxAmmo){
                this.game.ammo = this.game.maxAmmo; //ammo is refilled
            }
        }
    }

    //enemy types
    //parent class (super)
    class Enemy{

        //constructor method
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;

        }
         
        //update method
        update(){
            this.x += this.speedX - this.game.speed;
 
            //check if enemy has moved across the game
            if (this.x + this.width < 0){
                this.markedForDeletion = true; 
            }

            //sprite animation
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }
            else{
                this.frameX = 0;
            }

        }

        //draw method
        draw(context){
            if(this.game.debug){ //if in debug mode
                context.strokeRect(this.x, this.y, this.width, this.height); //show rectangular outline around enemy
            }       
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            
            if(this.game.debug){ //if in debug mode
                context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
            }
        }
    }

    //child class (sub) 
    //child of class Enemy
    //has access to class Enemy's properties and methods
    //"inheritance"
    class Angler1 extends Enemy{

        //constructor method
        constructor(game){
            super(game); //ensures that super class Enemy's constructor is executed, otherwise this constructor will override it
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.95 - this.height); //random y position offset by the height
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3); //between 0 & 1, refer to spreadsheet
            this.lives = 5;
            this.score = this.lives;
            
        }

    }

    class Angler2 extends Enemy{

        //constructor method
        constructor(game){
            super(game); //ensures that super class Enemy's constructor is executed, otherwise this constructor will override it
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.95 - this.height); //random y position offset by the height
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2); //between 0 & 2, refer to spreadsheet
            this.lives = 6;
            this.score = this.lives;
        }

    }

    class Lucky extends Enemy{

        //constructor method
        constructor(game){
            super(game); //ensures that super class Enemy's constructor is executed, otherwise this constructor will override it
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.95 - this.height); //random y position offset by the height
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2); //between 0 & 2, refer to spreadsheet
            this.lives = 5;
            this.score = 15;
            this.type = 'lucky';
        }

    }

    class Hivewhale extends Enemy{

        //constructor method
        constructor(game){
            super(game); //ensures that super class Enemy's constructor is executed, otherwise this constructor will override it
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.95 - this.height); //random y position offset by the height
            this.image = document.getElementById('hivewhale');
            this.frameY = 0; 
            this.lives = 20;
            this.score = this.lives;
            this.type = 'hive';
            this.speedX = Math.random() * -1.2 - 0.2;
        }

    }

    class Drone extends Enemy{

        //constructor method
        constructor(game, x, y){
            super(game); //ensures that super class Enemy's constructor is executed, otherwise this constructor will override it
            this.width = 115;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('drone');
            this.frameY = Math.floor(Math.random() * 2); 
            this.lives = 3;
            this.score = this.lives;
            this.type = 'drone';
            this.speedX = Math.random() * -4.2 - 0.5;
        }

    }

    //background layers
    class Layer{

        //constructor method
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0; //x position
            this.y = 0; //y position
        }

        //update method
        update(){
            if(this.x <= -this.width){
                this.x = 0; //reset the background
            }

            //the following the commented out to make transition smoother
            // else{
            //     this.x -= this.game.speed * this.speedModifier;
            // }
            this.x -= this.game.speed * this.speedModifier; //continue background scrolling
        }

        //draw method
        draw(context){
            context.drawImage(this.image, this.x, this.y); //draws the layer image
            context.drawImage(this.image, this.x + this.width, this.y); //second image drawn to allow endless scrolling while the first image re-adjusts 
        }
    }

    //put all layers together
    class Background{

        //constructor method
        constructor(game){
            this.game = game;

            //extract the images from index.html
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            //make new stance of the layers
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);

            //layers array
            this.layers = [this.layer1, this.layer2, this.layer3]; //does not include layer4 because we want to draw it at a later stage
        }

        //update method
        update(){
            this.layers.forEach(layer => layer.update()); //for each layer, update
        }

        //draw method
        draw(context){
            this.layers.forEach(layer => layer.draw(context)); //draw each layer, draw
        }
    }

    class Explosion{

        //constructor method
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
            this.fps = 30;
            this.timer = 0;
            this.interval = 100/this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8; 
        }

        //update method
        update(deltaTime){
            this.x -= this.game.speed;
            if(this.timer > this.interval){
                this.frameX++;
                this.timer = 0;
            }
            else{
                this.timer += deltaTime;
            }

            if(this.frameX > this.maxFrame){
                this.markedForDeletion = true;
            }
        }

        //draw method
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class SmokeExplosion extends Explosion{

        //constructor method
        constructor(game, x, y){
            super(game, x, y); //mandatory line for  child classes
            this.image = document.getElementById('smokeExplosion');
        }
    }

    class FireExplosion extends Explosion{

        //constructor method
        constructor(game, x, y){
            super(game, x, y); //mandatory line for  child classes
            this.image = document.getElementById('fireExplosion');
        }
    }

    //score, timer, etc
    class UI{

        //constructor method
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }
        
        //draw method
        draw(context){
            //save this state of canvas at only this point
            //have it between context.save() & context.restore() methods
            //context.save() & context.restore() methods only work when used together
            context.save();

            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;

            //score shown on canvas
            context.fillText("Score: " + this.game.score, 20, 40);

            // timer shown on canvas

            // .toFixed() method formats a number using fixed point notation
            // takes in number of desired decimal points
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1); //* 0.001 so the timer shows s instead of ms
            context.fillText('Timer: ' + formattedTime, 20, 100);

            //game over messages
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                    
                if(this.game.score > this.game.winningScore){
                    message1 = 'You Win!';
                    message2 = 'Well Done!';
                }
                else{
                    message1 = 'You Lose!';
                    message2 = 'Try Again Next Time!';
                }

                context.font = '70px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }

            //ammo
            if(this.game.player.powerUp){
                context.fillStyle = '#ffffbd';
            }

            //drawing the ammo count 
            for(let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20); //multiply by i to make the ammo line with each other
            }

            context.restore();
        }
    }
 

    //main brain
    class Game{

        //constructor method
        //run once the class is instantiated using the "new" keyword
        //will create a new blank object with the values and properties defined inside the blueprint
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this); //creates a new instance of Background, passes game as argument (aka this)
            this.player = new Player(this); //creates a new instance of Player
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = []; //keeps track of pressed keys
            this.enemies = []; //holds active enemies
            this.particles = []; 
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.ammo = 20; //start out with 20
            this.maxAmmo = 50; //max ammo 
            this.ammoTimer = 0; //timer 
            this.ammoInterval = 350; //interval to replenish ammo
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 50;
            this.gameTime = 0;
            this.timeLimit = 30000;
            this.speed = 1;
            this.debug = false;
        } 

        //update method
        update(deltaTime){

            if(!this.gameOver){
               this.gameTime += deltaTime; 
            }

            if(this.gameTime > this.timeLimit){
                this.gameOver = true;
            }

            this.background.update();
            this.background.layer4.update();
            
            this.player.update(deltaTime);

            if (this.ammoTimer > this.ammoInterval){ 
                if(this.ammo < this.maxAmmo){
                    this.ammo++; //increase ammo if ammo timer has surpased ammo interval and if max ammo number has not been reached
                }
                this.ammoTimer = 0; //reset ammo timer
            }
            else{
                this.ammoTimer += deltaTime; //ammoTimer increments
            }

            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

            this.enemies.forEach(enemy => { //for each enemy in enemies array

                enemy.update();

                if (this.checkCollision(this.player, enemy)){ //if player has collided with enemy
                    
                    enemy.markedForDeletion = true; //mark flag as true for enemy deletion

                    this.addExplosion(enemy); //adds explosion to enemy position

                    for(let i = 0; i < enemy.score; i++){
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)); //add new instances of Particle object to the particles array according to enemy score
                    }
                    
                    if(enemy.type === 'lucky'){
                        this.player.enterPowerUp();
                    }
                    else if(!this.gameOver){ //if game is not over 
                        this.score--; //decrease score
                    }
                }

                this.player.projectiles.forEach(projectile => { //for each projectile in projectiles array
                    
                    if (this.checkCollision(projectile, enemy)){ //if projectile hits enemy
                        enemy.lives--; //enemy loses 1 life
                        projectile.markedForDeletion = true; //mark flag for delete

                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

                        if (enemy.lives <= 0){ //if enemy is dead

                            for(let i = 0; i < enemy.score; i++){
                                this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }

                            enemy.markedForDeletion = true;  

                            this.addExplosion(enemy);

                            //special effects for special enemy
                            if(enemy.type === 'hive'){
                                for(let i = 0; i < 4; i++){ //push 4 drones
                                    this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height));
                                }
                            }

                            if(!this.gameOver){ //only incrememnt score is game is not over
                                this.score += enemy.score;
                            }

                            if(this.score > this.winningScore){ //wins game after achieving past the winning score
                                this.gameOver = true;
                            }
                        }
                    }
                })

            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); //filters out dead enemies

            if((this.enemyTimer > this.enemyInterval) && (!this.gameOver)){ //when timer has run enough time and game is not over
                this.addEnemy(); //execute addEnemy() method
                this.enemyTimer = 0; //reset timer
            }
            else{
                this.enemyTimer += deltaTime; //keep timing 
            }
        }

        //draw method
        draw(context){
            //draw layers in strategic order
            //draw background first so the player doesn't get covered
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.explosions.forEach(explosion => {
                explosion.draw(context);
            });

            //draw layer4 last so that it appears in front of player
            this.background.layer4.draw(context);
        }

        //adds random enemy
        addEnemy(){
            const randomize = Math.random(); // 0 < randomize < 1

            if(randomize < 0.3){
                this.enemies.push(new Angler1(this)); //pushes Angler1 to enemies array
            }
            else if (randomize < 0.6){
                this.enemies.push(new Angler2(this)); //pushes Angler2 to enemies array
            }
            else if (randomize < 0.7){
                this.enemies.push(new Hivewhale(this)); //pushes HiveWhale to enemies array
            }
            else{
                this.enemies.push(new Lucky(this)); //pushes Lucky to enemies array
            }
        }

        addExplosion(enemy){
            const randomize = Math.random(); // 0 < randomize < 1

            //50% chance of smoke and 50% chanceof fire
            if(randomize < 0.5){
                this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            }
            else{
                this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            }

            console.log(this.explosions);
        }

        //method contains algorithm for checking for collisions between rect1 & rect2
        //x and y coordinates of rect1 & rect2 are at the upper left edge
        checkCollision(rect1, rect2){
            return( (rect1.x < rect2.x + rect2.width) && 
                    (rect1.x + rect1.width > rect2.x) && 
                    (rect1.y < rect2.y + rect2.height) && 
                    (rect1.height + rect1.y > rect2.y) )
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    //custom function, animation loop
    //update positions and redraw game
    //chose timeStamp as variable name for requestAnimationFrame() time stamp 
    function animate(timeStamp){

        //timeStamp comes from requestAnimationFrame(), which passes a time stamp as an argument to the function is calls
        const deltaTime = timeStamp - lastTime; //difference in ms

        // console.log(deltaTime); //use this to figure out how fast the game is animating in fps
        // around 16.6ms, (1000ms/16.6ms) = 60FPS

        lastTime = timeStamp; //update lastTime for next loop

        //deletes all canvas drawings between each animation frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //takes instance of game and calls its associated draw() method
        //draw() method takes in context as a variable
        game.draw(ctx);

        //takes instance of game and calls its associated update() method
        //run periodic events in game or measure game time
        game.update(deltaTime); 

        //requests browser to call a specified funtion to update an animation before the next repaint
        //the argument passed as a variable is what we want to call before the repaint
        //passed argument aka variable: animate() (parent function) to create an endless animation loop
        requestAnimationFrame(animate);
    }

    animate(0); //pass zero as the first time stamp

});
