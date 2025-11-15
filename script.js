let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d");

let seasonList=["winter","spring","summer","autumn"];
let seasonIndex=0;
let season=seasonList[seasonIndex];
let objects=[];

// ---- OBJECT GENERATORS ----

function createWhiteSnowflake(){
    return{
        type:"snow",
        x:Math.random()*canvas.width,
        y:Math.random()*-200,
        size:10+Math.random()*10,
        speed:0.5+Math.random()*1.2,
        angle:Math.random()*Math.PI*2,
        spin:(Math.random()*0.02)-0.01
    };
}

function createPetal(){
    return{
        type:"petal",
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        size:4+Math.random()*3,
        speed:0.5+Math.random()*1
    };
}

function createFlower(x,y){
    return{type:"flower",x,y,size:12,pulse:Math.random()*Math.PI*2};
}

function createSunParticle(){
    return{
        type:"sun",
        angle:Math.random()*Math.PI*2,
        radius:60,
        speed:0.01+Math.random()*0.02
    };
}

function createLeaf(){
    return{
        type:"leaf",
        x:Math.random()*canvas.width,
        y:Math.random()*-20,
        size:6+Math.random()*4,
        speed:1+Math.random()*2,
        angle:Math.random()*360
    };
}

// ---- INIT SEASON ----

function initSeason(){
    objects=[];

    if(season==="winter"){
        for(let i=0;i<80;i++)objects.push(createWhiteSnowflake());
    }

    if(season==="spring"){
        for(let i=0;i<40;i++)objects.push(createPetal());
    }

    if(season==="summer"){
        for(let i=0;i<40;i++)objects.push(createSunParticle());
    }

    if(season==="autumn"){
        for(let i=0;i<40;i++)objects.push(createLeaf());
    }

    document.getElementById("seasonName").innerText=
        season.charAt(0).toUpperCase()+season.slice(1);
}

// ---- DRAW SNOWFLAKE ----

function drawSnowflake(o){
    ctx.save();
    ctx.translate(o.x,o.y);
    ctx.rotate(o.angle);
    ctx.strokeStyle="white";
    ctx.lineWidth=2;

    let r=o.size;

    for(let i=0;i<6;i++){
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(r,0);
        ctx.stroke();
        ctx.rotate(Math.PI/3);
    }
    ctx.restore();
}

// ---- DRAW SEASONS ----

function drawWinter(){
    let g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,"#001f3f");
    g.addColorStop(1,"#004f7a");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#fff";
    ctx.fillRect(0,canvas.height-60,canvas.width,60);

    objects.forEach(o=>{
        drawSnowflake(o);

        o.y+=o.speed;
        o.angle+=o.spin;

        if(o.y>canvas.height-60){
            o.y=Math.random()*-200;
            o.x=Math.random()*canvas.width;
        }
    });
}

function drawSpring(){
    let g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,"#d4f7ff");
    g.addColorStop(1,"#b6f2c2");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    objects.forEach(o=>{
        if(o.type==="petal"){
            ctx.fillStyle="#ffb6c1";
            ctx.beginPath();
            ctx.ellipse(o.x,o.y,o.size,o.size/2,0,0,Math.PI*2);
            ctx.fill();

            o.y+=o.speed;
            o.x+=Math.sin(o.y*0.02);

            if(o.y>canvas.height){
                o.y=-10;
                o.x=Math.random()*canvas.width;
            }
        }

        if(o.type==="flower"){
            o.pulse+=0.05;
            let r=o.size+Math.sin(o.pulse)*2;

            ctx.fillStyle="#ff4fa3";
            ctx.beginPath();
            ctx.arc(o.x,o.y,r,0,Math.PI*2);
            ctx.fill();

            ctx.fillStyle="#ffd700";
            ctx.beginPath();
            ctx.arc(o.x,o.y,r/3,0,Math.PI*2);
            ctx.fill();
        }
    });
}

function drawSummer(){
    ctx.fillStyle="#87cefa";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#2ecc71";
    ctx.fillRect(0,canvas.height-80,canvas.width,80);

    ctx.fillStyle="yellow";
    objects.forEach(o=>{
        o.angle+=o.speed;
        let x=350+Math.cos(o.angle)*o.radius;
        let y=100+Math.sin(o.angle)*o.radius;

        ctx.beginPath();
        ctx.arc(x,y,6,0,Math.PI*2);
        ctx.fill();
    });
}

function drawAutumn(){
    let g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,"#f5deb3");
    g.addColorStop(1,"#d2691e");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="orange";
    objects.forEach(o=>{
        ctx.beginPath();
        ctx.ellipse(o.x,o.y,o.size,o.size/2,o.angle,0,Math.PI*2);
        ctx.fill();

        o.y+=o.speed;
        o.angle+=0.02;

        if(o.y>canvas.height){
            o.y=-10;
            o.x=Math.random()*canvas.width;
        }
    });
}

// ---- INTERACTION ----

canvas.addEventListener("click",(e)=>{
    let r=canvas.getBoundingClientRect();
    let x=e.clientX-r.left;
    let y=e.clientY-r.top;

    if(season==="spring")objects.push(createFlower(x,y));
});

// ---- BUTTONS ----

document.getElementById("nextSeason").onclick=()=>{
    seasonIndex=(seasonIndex+1)%seasonList.length;
    season=seasonList[seasonIndex];
    initSeason();
};

document.getElementById("prevSeason").onclick=()=>{
    seasonIndex=(seasonIndex-1+seasonList.length)%seasonList.length;
    season=seasonList[seasonIndex];
    initSeason();
};

initSeason();

// ---- ANIMATION LOOP ----

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(season==="winter")drawWinter();
    if(season==="spring")drawSpring();
    if(season==="summer")drawSummer();
    if(season==="autumn")drawAutumn();

    requestAnimationFrame(animate);
}
animate();
