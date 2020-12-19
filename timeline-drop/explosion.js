/// <reference types="matter-js" />
// @ts-check

  // module aliases
  var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
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
        // wireframes: false
      },
      
  });
  
  const ground = Bodies.rectangle(400, 410, 810, 20, { isStatic: true });
  const left = Bodies.rectangle(-10, 200, 20, 400, { isStatic: true });
  const right = Bodies.rectangle(810, 200, 20, 400, { isStatic: true });
    World.add(engine.world, [ground, left, right]);

    const colors = ["#40c463", "#216e39", "#30a14e", "#9be9a8", "#ebedf0"]
    setInterval(() => {
        const bodies = []
        for (let index = 0; index < 15; index++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const xSpawn = (Math.random() * 80) - 40
            const square = Bodies.rectangle(400 - xSpawn, -30, 10, 10, {
                 render: { fillStyle: color },
                density: 20
                 
            })
            square.angle = (Math.random() * 2) - 4
            bodies.push(square)
        }
        World.add(engine.world, bodies);

    }, 200)


  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 10, 10, { render: { fillStyle: "#40c463" }});
  var boxB = Bodies.rectangle(450, 50, 10, 10, { render: { fillStyle: "#216e39" }});
  ground
  
  
  
  // run the engine
  Engine.run(engine);
  
  // run the renderer
  Render.run(render);
