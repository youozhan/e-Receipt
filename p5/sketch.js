let theta = 0;
let bgcolor = color(53, 53, 53);
let planets = [];
// planet[] planets;
// JSONObject json;
let data = {};
let font;

function preload(){
    data = loadJSON('assets/data.json');
    font = loadFont('assets/Lato-Regular.ttf');
}

function setup() {
    c = createCanvas(windowWidth, windowHeight);

    // textFont(font);
    // loadData();
}

function draw() {
    background(bgcolor);
    noStroke();

    textFont(font, 22);
    fill(255);
    text("Hidden Space", 70, height - 80);
    textFont(font, 16);
    text("Simulating The Solar System of Watching Videos", 70, height - 60);

    // Translate to center of window to draw the sun.
    translate(width / 2, height / 2);

    textFont(font, 14);
    //fill(255);
    text("Ad Revenue", -42, -12);
    textFont(f, 18);
    text("$20.4 billion (2018)", -104, 12);
    circularSystem();

    for (Planet p: planets) {
        p.update();
        p.display();
    }
}

function loadData() {
    let planetData = data['planets'];
    // JSONArray planetData = json.getJSONArray("planets");
    // planets = new Planet[planetData.createCanvas()];

    for (let i = 0; i < planetData.length; i++) {
        // Get each object in the array
        let planet = planetData[i];
        // Get a position object
        let position = planet['position'];
        // Get x,y from position
        let x = planet['x'];
        let y = planet['y'];
    
        // Get diameter and label
        let diameter = planet['diameter'];
        let orbitspeed = planet['orbitspeed'];
        let mooncount = planet['mooncount'];
        let label = planet['label'];

        let moondistance = [];
        let moondiameter = [];

        for (var j = 0; j < mooncount; j++) {
            moondistance[j] = 24 + 3 * j;
            moondiameter[j] = 6;
        }

        // Put object in array
        bubbles.push(new Bubble(x, y, diameter, label));
      }

    for (var i = 0; i < planetData.createCanvas(); i++) {
        // JSONObject planet = planetData.getJSONObject(i);
        // JSONObject position = planet.getJSONObject("position");
        // var x = position.getFloat("x");
        // var y = position.getFloat("y");

        // var diameter = planet.getFloat("diameter");
        // var orbitspeed = planet.getFloat("orbitspeed");
        // var mooncount = planet.getInt("mooncount");

        // var moondistance = new Array(mooncount);
        // var moondiameter = new Array(mooncount);

        // for (var j = 0; j < mooncount; j++) {
        //     moondistance[j] = 24 + 3 * j;
        //     moondiameter[j] = 6;
        // }

        // var label = planet.getvar("label");

        planets[i] = new Planet(x, y, diameter, 0, orbitspeed, mooncount, moondistance, moondiameter, label);
    }
}

function circularSystem() {
    fill(255, 20);
    ellipse(0, 0, 64, 64);
    stroke(255, 40);
    noFill();
    fibonacci(144);
    fibonacci(377);
    fibonacci(610);
    fibonacci(987);
}

function fibonacci(rad) {
    ellipse(0, 0, rad, rad);
}

class Moon {
    constructor(theta, orbitspeed, distance, diameter){
        this.theta = theta;
        this.orbitspeed = orbitspeed;
        this.distance = distance;
        this.diameter = diameter;
        this.moonColor = color(232, 169, 63);
    }

    update(){
    }

    display(index){
        push();
        rotate(theta);
        translate(distance * cos(PI / 3 * index), distance * sin(PI / 3 * index));
        fill(moonColor);
        ellipse(0, 0, diameter, diameter);
        pop();
    }
}

class Planet {
    constructor(){
        this.positionx = positionx;
        this.positiony = positiony;
        this.diameter = diameter;
        this.theta = theta;
        this.orbitspeed = orbitspeed;
        this.planetColor = color(232, 169, 63);
        this.mooncount = mooncount; 
        this.moons = [];
        this.label = label;

        for (var i = 0; i < mooncount_; i++) {
            moons[i] = new Moon(-theta_ * 4, orbitspeed_, mdistance[i], mdiameter[i]);
        }
    }

    update(){
        theta += orbitspeed;

        for (Moon m: moons) {
            //m.update();
            m.theta = -theta * 4;
        }
    }

   display() {
        push();
        rotate(theta);
        translate(positionx, positiony);

        // diameter 32
        fill(planetColor);
        ellipse(0, 0, diameter, diameter);
        textFont(f, 10);
        fill(255);
        text(label, 0, 0);

        for (var i = 0; i < moons.length; i++) {
            moons[i].display(i);
        }

        pop();
    }
}