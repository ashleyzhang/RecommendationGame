var canvas;
var context;
var height;
var width;
const padding = 20;

var score;
var lives;

function init() {
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
  canvas.height = window.innerHeight - padding;
  canvas.width = window.innerWidth - padding;
	height = canvas.offsetHeight;
	width = canvas.offsetWidth;
  startScreen();
  canvas.addEventListener("click", startButton);
	canvas.addEventListener("touchmove", startButton);
	canvas.removeEventListener("click", releaseBall);
	canvas.removeEventListener("touchmove", releaseBall);
}

//Declaring ball that is ready to shoot
var readyBall;

//Declaring turret
var turret;

//Declaring border
var border;

function startButton(event) {
  leftbound = width / 2;
  rightbound = width;
  highbound = height / 2;
  lowbound = height;
  if(event.offsetX >= leftbound
      && event.offsetX <= rightbound
      && event.offsetY >= highbound
      && event.offsetY <= lowbound) {
    howToPlay();
  }
}

function howToPlay() {
  drawLeftPanel();

}

function drawLeftPanel() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#F9F9F9";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, width / 4, height)

}

function startGame() {
  console.log("Game Started");

  //   // Initialize variables
  //   var r;
  //   var h;

  //   if(height > width) {
  //   	r = width / 5;
  //   	h = width / 12;
  //   }
  //   else {
  //   	r = height / 5;
  //   	h = height / 12;
  //   }

  //   turret = {
	// 	x: width / 2,
	// 	y: height / 2,
  //   	radius: r,
  //   	color: "black",
  //   	startAngle: 0,
  //   	endAngle: Math.PI * (ballNum - 1) / (ballNum / 2),
	// 	spinSpeed: Math.PI / (ballNum * 12)
	// };

	// border = {
	// 	thickness: h,
	// 	color: "grey"
	// };

	// initBalls(1);
	// initTargets(1);

	// score = 0;
	// lives = 5;

	// //Releases ball when clicked if a ball has not been released
	// canvas.removeEventListener("click", startGame);
	// canvas.removeEventListener("touchmove", startGame);
	// canvas.addEventListener("click", releaseBall);
	// canvas.addEventListener("touchmove", releaseBall);

	// nextFrame();
}
    
//Number of balls that can fit in the turret
var ballNum = 24;
//Declaring array of balls
var balls = [];
//Ball initialization
function initBalls(num) {
  balls = [];
	for(var i = 0; i < ballNum; i++) {
		ball = {
			x: 0,
			y: 0,
          numBalls: ballNum,
          //Not exact radius because otherwise infinite recursive but close approximation
          radius: (turret.radius - (turret.radius * Math.sin(Math.PI / ballNum))) * Math.sin(Math.PI / ballNum),
          color: generateRandomColors()
      };
      balls.push(ball);
	}
}

//Background color
var backgroundColor = "#F9F9F9";

//Holes in the border each assigned different color
var targetNum = 20;
//Declaring array of targets
var targets = [];
//target initialization
function initTargets(num) {
	targets = [];
	for(var i = 0; i < targetNum; i++) {
		var randomSide = generateRandomSide();
		var randomSize = generateRandomSize();
		var randomColor;
		if(i < colors.length) {
			randomColor = colors[i];
		}
		else {
			randomColor = generateRandomColors();
		}
		target = {
			side: randomSide,
			x: generateRandomX(randomSide, randomSize),
			y: generateRandomY(randomSide, randomSize),
			size: randomSize,
            color: randomColor
        };

        //Ensures that distance between targets is greater than given minimum distance
        var isValidTargetPosition = function(newTarget) {
			var minDistance = balls[0].radius * 3.5;
			var isValid = true;
			targets.forEach(function(target) {
				if (distance(target, newTarget) < minDistance) {
					isValid = false;
				}
			});
			return isValid;
		};
	
		var tries = 0;
		while (!isValidTargetPosition(target) && tries < 200) {
			target.side = generateRandomSide();
			target.size = generateRandomSize();
			target.x = generateRandomX(target.side, target.size);
			target.y = generateRandomY(target.side, target.size);
			tries++;
		}
		if (isValidTargetPosition(target)) {	
			targets.push(target);
		}
	}
}

//Distance between targets
function distance(target1, target2) {
	if(target1.x > target2.x && target1.y === target2.y) {
		return target1.x - (target2.x + target2.size);
	}
	else if(target1.x < target2.x && target1.y === target2.y) {
		return target2.x - (target1.x + target1.size);
	} 
	else if(target1.y > target2.y && target1.x === target2.x) {
		return target1.y - (target2.y + target2.size);
	}
	else if(target1.y < target2.y && target1.x === target2.x) {
		return target2.y - (target1.y + target1.size);
	}
}

//generate random side of wall
function generateRandomSide() {
	var sides  = [1, 2, 3, 4];
	var side = sides[Math.floor(Math.random() * sides.length)];
	return side;
}

//generate random x value of target positions
function generateRandomX(side, size) {
	if(side === 2 || side === 4) {
		return Math.random() * (width - 2 * border.thickness - size) + border.thickness;
	}
	else if(side === 1) {
		return 0;
	}
	else {
		return width - border.thickness;
	}
}

//generate random y value of target positions
function generateRandomY(side, size) {
	if(side === 1 || side === 3) {
		return Math.random() * (height - 2 * border.thickness - size) + border.thickness;
	}
	else if(side === 2) {
		return 0;
	}
	else {
		return height - border.thickness;
	}
}

//generate random width of targets
function generateRandomSize() {
	var size = Math.random() * (balls[0].radius * 3.5) + (balls[0].radius * 3.5);
	return size;
}

//array of colors used
var colors = ["lightpink", "salmon", "palegreen", "turquoise", "plum", "palegoldenrod", "powderblue", "slateblue", "orange", "rosybrown"];

//generate random colors of balls
function generateRandomColors() {
	var num = Math.random();
	var color = "";
	if(num >= 0 && num < 0.1) {
		color = colors[0];
	}
	else if(num >= 0.1 && num < 0.2) {
		color = colors[1];
	}
	else if(num >= 0.2 && num < 0.3) {
		color = colors[2];
	}
	else if(num >= 0.3 && num < 0.4) {
		color = colors[3];
	}
	else if(num >= 0.4 && num < 0.5) {
		color = colors[4];
	}
	else if(num >= 0.5 && num < 0.6) {
		color = colors[5];
	}
	else if(num >= 0.6 && num < 0.7) {
		color = colors[6];
	}
	else if(num >= 0.7 && num < 0.8) {
		color = colors[7];
	}
	else if(num >= 0.8 && num < 0.9) {
		color = colors[8];
	}
	else {
		color = colors[9];
	}
	return color;
}