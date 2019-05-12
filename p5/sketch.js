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
    text("Hidden Systems", 40, height - 80);
    textFont(font, 16);
    text("View the YouTube viewers", 40, height - 60);

    // Translate to center of window to draw the sun.
    translate(width / 2, height / 2);

    // textFont(font, 14);
    // text('Ad Revenue', -38, -16);
    // textFont(font, 18);
    // text('$20.4 billion (2018)', -76, 16);
    fill(200)
    textFont(font, 24);
    text('$', -7, 7);
    // text('$20.4 billion (2018)', -76, 16);
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
        let alpha = planet['alpha'];
        let mooncount = planet['mooncount'];
        let label = planet['label'];

        let moondistance = [];
        let moondiameter = [];

        for (var j = 0; j < mooncount; j++) {
            moondistance[j] = 36 + 6 * j;
            // moondistance[j] = 36;
            moondiameter[j] = 6;
        }

        // Put object in array
        planets.push(new Planet(x, y, diameter, 0, orbitspeed, alpha, mooncount, moondistance, moondiameter, label));
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
    line(0, 0, 1000, -400)
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
    constructor(positionx, positiony, diameter, theta, orbitspeed, alpha, mooncount, moondistance, moondiameter, label) {
        this.positionx = positionx;
        this.positiony = positiony;
        this.diameter = diameter;
        this.theta = theta;
        this.orbitspeed = orbitspeed;
        this.alpha = alpha;
        this.planetColor = color(232, 169, 63, this.alpha);
        this.mooncount = mooncount;
        this.moons = [];
        // this.moondistance = [];
        // this.moondiameter = [];

        this.label = label;

        for (var i = 0; i < this.mooncount; i++) {
            // this.moons.push(new Moon(-this.theta * 4, this.orbitspeed, moondistance[i], moondiameter[i]));
            this.moons.push(new Moon(-this.theta * 2, 0, moondistance[i], moondiameter[i]));
        }
    }

    update() {
        this.theta += this.orbitspeed;

        for (let i = 0; i < this.moons.length; i++) {
            this.moons[i].theta = -this.theta * 2;
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

        // stroke(255, 40);
        // noFill();
        // ellipse(0, 0, this.diameter + 39, this.diameter + 39)

        rotate(-this.theta);
        for (let i = 0; i < this.moons.length; i++) {
            stroke(255, 40);
            noFill();
            ellipse(0, 0, this.diameter + 36 + 12 * i + 6, this.diameter + 36 + 12 * i + 6);
            this.moons[i].display(i);
        }
        fill(255);
        text(this.label, 46, -36);
        stroke(255, 40);
        line(0, 0, 40, -32);
        line(40, -32, 80, -32);

        pop();


    }
}