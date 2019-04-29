let theta = 0;
let planets = [];
let data = {};
let font;

function preload() {
    data = loadJSON('assets/data.json');
    font = loadFont('assets/Lato-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadData();
}

function draw() {
    let bgcolor = color(53, 53, 53);
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
    text('Ad Revenue', -42, -12);
    textFont(font, 18);
    text('$20.4 billion (2018)', -104, 12);
    circularSystem();

    for (let i = 0; i < planets.length; i++) {
        planets[i].update();
        planets[i].display();
    }
}

function loadData() {
    let planetData = data['planets'];

    for (let i = 0; i < planetData.length; i++) {
        // Get each object in the array
        let planet = planetData[i];
        // Get a position object
        let position = planet['position'];
        // Get x,y from position
        let x = position['x'];
        let y = position['y'];

        console.log(x, y);

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
        // bubbles.push(new Bubbles(x, y, diameter, label));
        planets.push(new Planet(x, y, diameter, 0, orbitspeed, mooncount, moondistance, moondiameter, label));
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Moon {
    constructor(theta, orbitspeed, distance, diameter) {
        this.theta = theta;
        this.orbitspeed = orbitspeed;
        this.distance = distance;
        this.diameter = diameter;
        this.moonColor = color(232, 169, 63);
    }

    update() {}

    display(index) {
        push();
        rotate(this.theta);
        translate(this.distance * cos(PI / 3 * index), this.distance * sin(PI / 3 * index));
        fill(this.moonColor);
        ellipse(0, 0, this.diameter, this.diameter);
        pop();
    }
}

class Planet {
    constructor(positionx, positiony, diameter, theta, orbitspeed, mooncount, moondistance, moondiameter, label) {
        this.positionx = positionx;
        this.positiony = positiony;
        this.diameter = diameter;
        this.theta = theta;
        this.orbitspeed = orbitspeed;
        this.planetColor = color(232, 169, 63);
        this.mooncount = mooncount;
        this.moons = [];
        this.moondistance = [];
        this.moondiameter = [];

        this.label = label;

        for (var i = 0; i < this.mooncount; i++) {
            this.moons.push(new Moon(-this.theta_ * 4, this.orbitspeed_, this.moondistance[i], this.moondiameter[i]));
        }
    }

    update() {
        this.theta += this.orbitspeed;

        for (let i = 0; i < this.moons.length; i++) {
            this.moons[i].theta = -this.theta * 4;
        }
    }

    display() {
        push();
        rotate(this.theta);
        translate(this.positionx, this.positiony);

        // diameter 32
        fill(this.planetColor);
        ellipse(0, 0, this.diameter, this.diameter);
        textFont(font, 10);
        fill(255);
        text(this.label, 0, 0);

        for (let i = 0; i < this.moons.length; i++) {
            this.moons[i].display(i);
        }

        pop();
    }
}