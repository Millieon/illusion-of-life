let feeding=false;
let foodOn=false
let index;
let food;

class Food{
  constructor(x,y,diam)
  {
    this.x=x;
    this.y=y;
    this.diam=diam;
    this.eaten=false;
  }
  display()
  {
    if(!this.eaten)
    {
    beginShape();
    noStroke();
    fill(0,255,255);
    ellipse(this.x,this.y,this.diam);
    endShape();
    }
    
    
  }
  disappear()
  {
    this.eaten=true;
  }

}
// create our creature class

class Creature {
  // this constructor is called when we define new Creature(...)
  constructor(_x, _y) {
    this.location = new createVector(_x, _y);  // Location of shape
    this.velocity = new createVector(random(-2,2),random(-2,2));  // Velocity of shape
    this.friction = new createVector(0, 0); 
    this.desired = new createVector(0, 0); 
    this.diameter = random(10,40);
    this.speedLimit = random(1,this.diameter/10);
    this.feed=false;
    this.energy=10;
  }

  moveToFood(x, y){
    if(!this.feed)
    {
    this.desired.x = x;
    this.desired.y = y;
    let direction = p5.Vector.sub(this.desired, this.location); // gets vector between these two points

    // mag / magnitude is the length of the distance between the two points
    if (direction.mag() < this.diameter/2){
      return true; //stops moving as it returns before adding direction to velocity below
    } 
  
    //only move if they are close to the target x & y locations
    if(direction.mag() < 200){
      direction.normalize(); //normalize gives us the unit vector of length 1 (i.e. just the direction )
      this.velocity.add(direction);
    }

    return false;

    }
    
  } 
 
  update() {

    this.friction.x = this.velocity.x * -1;
    this.friction.y = this.velocity.y * -1;
    this.friction.normalize();
    this.friction.mult(0.01);
    this.velocity.add(this.friction);

    //limit how fast each one can go
    this.velocity.limit(this.speedLimit);
    // Add velocity to the location.
    this.location.add(this.velocity);


    // Bounce off edges (updated from last term to work better with canvas resize)
    if (this.location.x > width){
      this.location.x = width;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.x < 0) {
      this.location.x = 0;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y < 0) {
      this.location.y = 0;
      this.velocity.y = this.velocity.y * -1;
    }
    if (this.location.y > height) {
      this.location.y = height;
      this.velocity.y = this.velocity.y * -1; 
    }
    if(!this.feed)
    // Display circle at location vector
    {noStroke();
    fill(0,0,255);
    circle(this.location.x,this.location.y,this.diameter);}
    else{
      noStroke();
    fill(25.5*this.energy,0,255);
    this.energy=10;
    circle(this.location.x,this.location.y,this.diameter+10);
    }

  }

  shrink()
  {
    if(this.feed)
    {
      // if(this.energy>0)
      // {this.energy-=1;
        
      // }
      // else{
      //   this.diameter=0;
      //   this.feed=false;
      // }
      this.energy-=1;
      
    }
    for(let i=0;i<int(10-this.energy);i++)
    {
      if(this.energy)
      {this.diameter-=i;}
    }
    
  }
}

//Main sketch below
// an array to store the creatures
let creatures = [];
let foodbank=[];

function setup() {

  canvas = createCanvas(600, 600);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element


food= new Food(random(width),random(height),random(10,20));

  for(let i = 0; i < 50; i++){
    let c = new Creature(random(width), random(height));
    creatures.push(c);
    
  }

  // for(let i=0;i<20;i++)
  // {
  //   let food= new Food(random(width),random(height),random(100));
  //   foodbank.push(food);

  // }

  index=int(random(20));

  addGUI();
}

function draw() {
  background(200);
  
    // loop through all the creatrure and animate them each frame by accessing their update function
  for (let c of creatures) {
    c.update();
    

    if(c.moveToFood(food.x,food.y)){

      //You will need to think about
      //a) managing food in the main sketch
      //b) keeping track of FED or FULL state in your creature class

      console.log("Arrived");
      c.feed=true;
      food.disappear();
      

    }
    else{
      
      food.display();
    }
    
  
  }
  for(let c of creatures)
  {
    c.shrink();
    console.log(c.energy);
    console.log(c.feed);
  }

  // if(!foodOn)

  // {foodbank[index].display();}

  

  

}

function addGUI()
{
  button=createButton("FEED");
  button.addClass("button");
  button.mousePressed(handleButtonPress);
} 

function handleButtonPress()
{
  if(!feeding){

    food= new Food(random(width),random(height),random(10,20));
foodbank.push(food);

  }
}

// function mousePressed() {

 
// // foodOn= !foodOn;
// // console.log(foodOn);
// food= new Food(random(width),random(height),random(10,20));
// foodbank.push(food);

// }