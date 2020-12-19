/// <reference types="matter-js" />
// @ts-check

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Svg = Matter.Svg,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 400,
    background: "#fafafa",
    wireframes: false
  },
});

const ground = Bodies.rectangle(400, 410, 810, 20, { isStatic: true });
const left = Bodies.rectangle(-10, 200, 20, 400, { isStatic: true });
const right = Bodies.rectangle(810, 200, 20, 400, { isStatic: true });
World.add(engine.world, [ground, left, right]);

const colors = ["#40c463", "#216e39", "#30a14e", "#9be9a8", "#ebedf0"];
const weeks = 52;
const days = 7;
const xOffset = 40;
const yOffset = -80;
const xMargin = 4;
const yMargin = 4;

const font = [];
const letters = document.getElementById("orta")?.querySelectorAll("path");
letters.forEach(path => {
  font.push(Svg.pathToVertices(path, 10))
});
World.add(engine.world, Bodies.fromVertices(390, 150, font, { isStatic: true, render: { fillStyle: "fafafa"} }));


// Timeline
const bodies = [];
for (let i = 0; i < weeks; i++) {
  for (let j = 0; j < days; j++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = xOffset + (i * 10) + ((i - 1) * xMargin)
    const y = yOffset + (j * 10) + ((j - 1) * yMargin)
    const square = Bodies.rectangle(x, y, 10, 10, {
      render: { fillStyle: color },
      density: 20,
    });
    // square.angle = Math.random() * 2 - 4;
    bodies.push(square);
  }
}
World.add(engine.world, bodies);

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 10, 10, { render: { fillStyle: "#40c463" } });
// var boxB = Bodies.rectangle(450, 50, 10, 10, { render: { fillStyle: "#216e39" } });
// ground;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
