function nextFrame() {
	//increases power as mouse is pressed
	spinTurret();
	drawFrame();
	if(isReleased) {
		freeMove();
	}
	if(!gameOver()) {
		setTimeout(nextFrame, 5);
	}
	else {
		canvas.addEventListener("click", startGame);
		canvas.addEventListener("touchmove", startGame);
		canvas.removeEventListener("click", releaseBall);
		canvas.removeEventListener("touchmove", releaseBall);
	}
}

function drawFrame() {
	//Clear canvas before drawing
	context.clearRect(0, 0, width, height);

	//Set background color
	context.rect(0, 0, width, height);
    context.fillStyle = backgroundColor;
    context.fill();

    //Draw score
	drawText(border.thickness + width / 20, border.thickness + height / 15, "score: " + score);

	//Draw number of lives
	drawText(border.thickness + width / 20, border.thickness + height / 8, "lives: " + lives);

	//Draw border
	drawBorder(border.thickness, border.color);

	//Draw balls
	if(!isReleased) {
		//if no ball has been released
		balls.forEach(function(ball) {
			drawBall(ball.x, ball.y, ball.radius, ball.color);
		});
	}
	else {
		//if ball has been released
		for(var i = 1; i < balls.length; i++) {
			drawBall(balls[i].x, balls[i].y, balls[i].radius, balls[i].color);
		}
	}

	//Draw targets
	targets.forEach(function(target) {
		drawTarget(target.x, target.y, target.size, target.color, target.side);
	});

	//Draw turret
    drawTurret(turret.x, turret.y, turret.startAngle, turret.endAngle, turret.radius, turret.color);

    //Draw released ball
	if(isReleased) {
		drawBall(readyBall.x, readyBall.y, readyBall.radius, readyBall.color);
	}
}


function drawText(x, y, text) {
	context.font = width / 30 + "px Arial";
	context.fillStyle = "grey"
	context.fillText(text, x, y);
}

//Draws four rectangles on the edge of the screen
function drawBorder(thickness, color) {
	context.fillStyle = color;
	context.fillRect(0, 0, width, thickness);
	context.fillRect(0, 0, thickness, height);
	context.fillRect(width - thickness, 0, thickness, height);
	context.fillRect(0, height - thickness, width, thickness);
}

//Draws targets
function drawTarget(x, y, size, color, side) {
	context.fillStyle = color;
	//Tweaked to ensure that white spaces cover border
	if(side === 1) {
		context.fillRect(x, y, border.thickness / 2, size);
		context.fillStyle = backgroundColor;
		context.fillRect(x + border.thickness / 2 - 1, y, border.thickness / 2 + 5, size);
	}
	else if(side === 2) {
		context.fillRect(x, y, size, border.thickness / 2);
		context.fillStyle = backgroundColor;
		context.fillRect(x, y + border.thickness / 2 - 1, size, border.thickness / 2 + 5);
	}
	else if(side === 3) {
		context.fillRect(x + border.thickness / 2, y, border.thickness / 2, size);
		context.fillStyle = backgroundColor;
		context.fillRect(x - 5, y, border.thickness / 2 + 6, size);
	}
	else {
		context.fillRect(x, y + border.thickness / 2, size, border.thickness / 2);
		context.fillStyle = backgroundColor;
		context.fillRect(x, y - 5, size, border.thickness / 2 + 6);
	}
}

//Draws a circle that does not close completely
function drawTurret(x, y,startAngle, endAngle, radius, color) {
	context.beginPath();
	context.strokeStyle = color;
	context.arc(x, y, radius, startAngle, endAngle); 
	context.lineWidth = 3;
	context.stroke();
}

//Draws balls inside turret
function drawBall(x, y, radius, color) {
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.fill();
}

//Creates new ball
function addBall() {
	console.log("addBall");
	ball = {
		x: 0,
		y: 0,
        numBalls: ballNum,
        //Not exact radius because otherwise need recursive but close approximation
        radius: (turret.radius - (turret.radius * Math.sin(Math.PI / ballNum))) * Math.sin(Math.PI / ballNum),
        color: generateRandomColors()
    };
	balls.push(ball);
}

function spinTurret() {
	turret.startAngle += turret.spinSpeed;
	turret.endAngle += turret.spinSpeed;

	//Controls position of ball
	var position = 0;
	balls.forEach(function(ball) {
		if(position !== 0) {
			ball.x = turret.x + (turret.radius - ball.radius) * Math.cos(((turret.endAngle + turret.startAngle) / 2 - Math.PI) + (Math.PI / (ballNum / 2) * position));
			ball.y = turret.y + (turret.radius - ball.radius) * Math.sin(((turret.endAngle + turret.startAngle) / 2 - Math.PI) + (Math.PI / (ballNum / 2) * position));
			position++;
		}
		//Moves ball that is ready to shoot
		else {
			ball.x = turret.x + turret.radius * Math.cos((turret.endAngle + turret.startAngle) / 2 - Math.PI);
			ball.y = turret.y + turret.radius * Math.sin((turret.endAngle + turret.startAngle) / 2 - Math.PI);
			position++;
		}
	});
}

var isReleased;
var pastBorder;
var pastBoundary;
//Releases ball from turret
function releaseBall() {
	if(!isReleased) {
		readyBall = {
			x: balls[0].x,
			y: balls[0].y,
			vx: 0,
			vy: 0,
			numBalls: balls[0].numBalls,
        	radius: balls[0].radius,
        	color: balls[0].color,
        	releaseAngle: -turret.startAngle
    	};

		//Sets ball velocity
		var speed = 4;
		readyBall.vx = speed * Math.cos(readyBall.releaseAngle);
		readyBall.vy = speed * Math.sin(readyBall.releaseAngle);

		isReleased = true;

		pastBorder = false;
		pastBoundary = false;
		numBounces = 0;
	}
}

var numBounces;
var t;
//Moves readyBall after released from turret
function freeMove() {
	//checks if ball is inside a target
	var inTarget = false;
	targets.forEach(function(target) {
		if(target.side === 1) {
			if(readyBall.x < readyBall.radius + border.thickness) {
				if(readyBall.y >= target.y + readyBall.radius && readyBall.y <= target.y + target.size - readyBall.radius) {
					inTarget = true;
					pastBorder = true;
					t = target;
				}
			}
		}
		else if(target.side === 2) {
			if(readyBall.y < readyBall.radius + border.thickness) {
				if(readyBall.x >= target.x + readyBall.radius && readyBall.x <= target.x + target.size - readyBall.radius) {
					inTarget = true;
					pastBorder = true;
					t = target;
				}
			}
		}
		else if(target.side === 3) {
			if(readyBall.x > width - readyBall.radius - border.thickness) {
				if(readyBall.y >= target.y + readyBall.radius && readyBall.y <= target.y + target.size - readyBall.radius) {
					inTarget = true;
					pastBorder = true;
					t = target;
				}
			}
		}
		else {
			if(readyBall.y > height - readyBall.radius - border.thickness) {
				if(readyBall.x >= target.x + readyBall.radius && readyBall.x <= target.x + target.size - readyBall.radius) {
					inTarget = true;
					pastBorder = true;
					t = target;
				}
			}
		}
	});

	//bounce off sides of targets
	if(!inTarget && pastBorder) {
		if(t.side === 1 || t.side === 3) {
			if(readyBall.y < t.y + readyBall.radius) {
				readyBall.y = t.y + readyBall.radius;
				readyBall.vy *= -1;
			}
			else if(readyBall.y > t.y + t.size - readyBall.radius) {
				readyBall.y = t.y + t.size - readyBall.radius;
				readyBall.vy *= -1;
			}
		}
		else if(t.side === 2 || t.side === 4) {
			if(readyBall.x < t.x + readyBall.radius) {
				readyBall.x = t.x + readyBall.radius;
				readyBall.vx *= -1;
			}
			else if(readyBall.x > t.x + t.size - readyBall.radius) {
				readyBall.x = t.x + t.size - readyBall.radius;
				readyBall.vx *= -1;
			}
		}
	}

	//bounce off walls
	else if(!inTarget && !pastBorder) {
		if(readyBall.x < readyBall.radius + border.thickness && readyBall.x > -readyBall.radius + border.thickness) {
			readyBall.x = readyBall.radius + border.thickness;
			readyBall.vx *= -1;
			numBounces++;
			if(numBounces > 0 && numBounces % 5 === 0) {
				lives++;
			}
		}
		if(readyBall.x > width - readyBall.radius - border.thickness && readyBall.x < width + readyBall.radius - border.thickness) {
			readyBall.x = width - readyBall.radius - border.thickness;
			readyBall.vx *= -1;
			numBounces++;
			if(numBounces > 0 && numBounces % 5 === 0) {
				lives++;
			}
		}
		if(readyBall.y < readyBall.radius + border.thickness && readyBall.y > -readyBall.radius + border.thickness) {
			readyBall.y = readyBall.radius + border.thickness;
			readyBall.vy *= -1;
			numBounces++;
			if(numBounces > 0 && numBounces % 5 === 0) {
				lives++;
			}
		}
		if(readyBall.y > height - readyBall.radius - border.thickness && readyBall.y < height + readyBall.radius - border.thickness) {
			readyBall.y = height - readyBall.radius - border.thickness;
			readyBall.vy *= -1;
			numBounces++;
			if(numBounces > 0 && numBounces % 5 === 0) {
				lives++;
			}
		}
	}

	//checks if ball is past boundaries
	if(readyBall.x < -readyBall.radius || readyBall.x > width + readyBall.radius || readyBall.y < -readyBall.radius || readyBall.y > height + readyBall.radius) {
		pastBoundary = true;
		if(t.color === readyBall.color) {
			score++;
			turret.spinSpeed += (turret.spinSpeed / 18);
		}
		else {
			lives--;
		}
	}

	//shifts balls in turret once readyBall is past boundary
	if(pastBoundary || numBounces > 25) {
		balls.shift();
		addBall();
		isReleased = false;
	}
	
	//Change position of ball
	readyBall.x += readyBall.vx;
	readyBall.y -= readyBall.vy;
}

function getLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
          currentLine += " " + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine);
  return lines;
}

function startScreen() {
  context.clearRect(0, 0, width, height);
	context.fillStyle = "#F9F9F9";
	context.fillRect(0, 0, width, height);
  context.font = width / 16 + "px Arial";
  context.fillStyle = "#4E4E4E";
  context.textAlign = "left";
  var lines = getLines(context, "Keep your options open", width/4);
  var bottom = 0;
  for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], width/10, height/4 + (height/8 * i));
    bottom = height/4 + (height/8 * i);
  }
  context.font = width / 48 + "px Arial";
  lines = getLines(context, "A game to understand how algorithms can limit your choices", 2 * width/9)
  for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], width/10, height/10 + bottom + (height/20 * i));
  }

  context.textAlign = "center";
  context.fillText("Get", 5 * width / 8, height / 2);
  context.fillText("Started", 5 * width / 8, 5 * height / 9);
}

function endScreen() {
	context.clearRect(0, 0, width, height);
	context.fillStyle = "grey";
	context.fillRect(0, 0, width, height);
  context.font = width / 10 + "px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Game Over", width/2, height/3);
  context.font = width / 11 + "px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Score: " + score, width/2, height/2);
  context.font = width / 10.5 + "px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Click to Play Again", width/2, (height*3)/4);
}

function gameOver() {
	var isGameOver = false;
	if(lives <= 0) {
		isGameOver = true;
	}
	if (isGameOver) {
		console.log("Game Over");
		endScreen();
		context.textAlign = "left";
	}
	return isGameOver;
}

