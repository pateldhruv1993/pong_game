Crafty.init(800, 400, document.getElementById('game'));
Crafty.background('rgb(30,120,150)');




//Init Variables
var viewWidth = Crafty.viewport.width;
var viewHeight = Crafty.viewport.height;
var aiSpeed = 2;

//Paddles
var ai = Crafty.e('AIPaddle, 2D, Canvas, Color, Twoway')
  .attr({ x: 20, y: 300, w: 10, h: 100, powerup: "" })
  .color('rgb(205, 200, 177)')
  .bind('EnterFrame', function () {
    if (this.y + (this.h / 2) < ball.y) {
      this.y += aiSpeed;
    } else {
      this.y -= aiSpeed;
    }

    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > viewHeight - this.h) {
      this.y = viewHeight - this.h;
    }
    if (this.powerup != "") {
      if (this.powerup == "enhancement_pill") {
        ai.h = 130;
        removePowerUpFrom(ai, "AIPowerUp");
        Crafty.e("Delay").delay(function () {
          ai.h = 100;
        }, 5000, 0);
      }
      else if (this.powerup == "ice_shower") {
        removePowerUpFrom(ai, "AIPowerUp");
        Crafty.e('2D, DOM, Image, Collision')
          .image("./icons/ice.png")
          .attr({
            x: 30, y: ai.y + (ai.h / 2), w: 20, h: 20,
            dX: +4, dY: 0
          })
          .onHit('PlayerPaddle', function () {
            player.h -= 20;
            Crafty.e("Delay").delay(function () {
              player.h += 20;
            }, 5000, 0);
            this.destroy();
          })
          .bind('EnterFrame', function () {
            this.x += this.dX;
            if (this.x < -20) {
              this.destroy();
            }
          })
      }
    }
  });

var player = Crafty.e('PlayerPaddle, 2D, Canvas, Color, Fourway')
  .attr({ x: (viewWidth - 30), y: 300, w: 10, h: 100, powerup: "" })
  .color('rgb(205, 155, 155)')
  .fourway(4)
  .bind('EnterFrame', function () {
    this.x = viewWidth - 30;
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > viewHeight - this.h) {
      this.y = viewHeight - this.h;
    }
  }).bind('KeyDown', function (e) {
    if (e.key == Crafty.keys.SPACE) {

      // Code to activate Power up
      if (this.powerup != "") {
        if (this.powerup == "enhancement_pill") {
          player.h = 130;
          removePowerUpFrom(player, "PlayerPowerUp");
          Crafty.e("Delay").delay(function () {
            player.h = 100;
          }, 5000, 0);
        }
        else if (this.powerup == "ice_shower") {
          removePowerUpFrom(player, "PlayerPowerUp");
          Crafty.e('2D, DOM, Image, Collision')
            .image("./icons/ice.png")
            .attr({
              x: (viewWidth - 30), y: player.y + (player.h / 2), w: 20, h: 20,
              dX: -4, dY: 0
            })
            .onHit('AIPaddle', function () {
              ai.h -= 20;
              Crafty.e("Delay").delay(function () {
                ai.h += 20;
              }, 5000, 0);
              this.destroy();
            })
            .bind('EnterFrame', function () {
              this.x += this.dX;
              if (this.x < -20) {
                this.destroy();
              }
            })
        }
      }
    }
  });;





//Ball
var ball = Crafty.e('2D, DOM, Image, Collision')
  .image("./icons/ball.png")
  .attr({
    x: viewWidth / 2, y: viewHeight / 2, w: 10, h: 10,
    dX: Crafty.math.randomInt(2, 5),
    dY: Crafty.math.randomInt(2, 5)
  })
  .bind('EnterFrame', function () {
    //hit floor or roof
    if (this.y <= 0 || this.y >= viewHeight - this.h)
      this.dY *= -1;

    if (this.x > viewWidth - this.w) {
      this.x = viewWidth / 2 - this.w / 2;
      this.y = viewHeight / 2 - this.h / 2;
      this.dY = Crafty.math.randomInt(-2, 2);
      if(this.dY == 0)
        this.dY = 1;
      Crafty('AIPoints').each(function () {
        this.text(++this.points + ' Points')
      });
    }
    if (this.x < this.w) {
      this.x = viewWidth / 2 - this.w / 2;
      this.y = viewHeight / 2 - this.h / 2;
      this.dY = Crafty.math.randomInt(-2, 2);
      if(this.dY == 0)
        this.dY = 1;
      Crafty('PlayerPoints').each(function () {
        this.text(++this.points + ' Points')
      });
      aiSpeed += 0.3;
      Crafty('AISpeed').each(function () {
        this.text("AI Speed: " + aiSpeed)
      });
    }

    this.x += this.dX;
    this.y += this.dY;
  })
  .onHit('PlayerPaddle', function () {
    this.dX *= -1;
    this.dY += getYReflection(player);
    createPowerUpFor(ai, 'AIPaddle');
  })
  .onHit('AIPaddle', function () {
    aiSpeed -= 0.1;
    this.dY += getYReflection(ai);
    Crafty('AISpeed').each(function () {
        this.text("AI Speed: " + aiSpeed)
      });
    this.dX *= -1;
    createPowerUpFor(player, 'PlayerPaddle');
  })



//Score boards
Crafty.e('AIPoints, DOM, 2D, Text')
  .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
  .textColor('#FFFFFF', 0.8)
  .text('0 Points');
Crafty.e('PlayerPoints, DOM, 2D, Text')
  .attr({ x: 715, y: 20, w: 100, h: 20, points: 0 })
  .textColor('#FFFFFF', 0.8)
  .text('0 Points');


// PowerUp board
Crafty.e('AIPowerUp, DOM, 2D, Text')
  .attr({ x: 20, y: 40, w: 100, h: 20 })
  .textColor('#FFFFFF', 0.8)
  .text('Power Up : None');
Crafty.e('PlayerPowerUp, DOM, 2D, Text')
  .attr({ x: 700, y: 40, w: 100, h: 20 })
  .textColor('#FFFFFF', 0.8)
  .text('Power Up : None');


// AI Speed board
Crafty.e('AISpeed, DOM, 2D, Text')
  .attr({ x: 20, y: 60, w: 200, h: 20 })
  .textColor('#FFFFFF', 0.8)
  .text('AI Speed: ' + aiSpeed);



// Function to calculate the reflection angle of ball after it hits the paddle
function getYReflection(paddle){

  var middleOfBall = ball.y + ball.h/2;
  var middleOfPaddle = paddle.y + paddle.h/2;
  var distance = middleOfPaddle - middleOfBall;
  var dY = (distance * 1.5) / (paddle.h / 2);
  dY *= -1; 
  return dY;
}




function createPowerUpFor(item, paddleName) {
  var yourFate = Crafty.math.randomInt(0, 100);
  if (yourFate < 90) {
    // Create a power Usp
    var whichPowerUp = Crafty.math.randomInt(1, 2);
    if (whichPowerUp == 1) {
      var enhancementPill = Crafty.e('2D, DOM, Image, Collision')
        .image("./icons/expand.png")
        .attr({
          x: item.x, y: Crafty.math.randomInt(0, (viewHeight - 10)), w: 20, h: 20,
        })
        .onHit(paddleName, function () {
          givePowerUpTo(paddleName, "enhancement_pill");
          enhancementPill.destroy();
        })
      Crafty.e("Delay").delay(function () {
        enhancementPill.destroy();
      }, 3000, 0);
    }
    else if (whichPowerUp == 2) {
      var coldShower = Crafty.e('2D, DOM, Image, Collision')
        .image("./icons/ice.png")
        .attr({
          x: item.x, y: Crafty.math.randomInt(0, (viewHeight - 10)), w: 20, h: 20,
        })
        .onHit(paddleName, function () {
          givePowerUpTo(paddleName, "ice_shower");
          coldShower.destroy();
        });
      Crafty.e("Delay").delay(function () {
        coldShower.destroy();
      }, 3000, 0);
    }
  }
}



function givePowerUpTo(name, powerUp) {
  var paddle;
  var powerUpBoard = "";
  if (name == "PlayerPaddle") {
    paddle = player;
    powerUpBoard = "PlayerPowerUp";
  } else {
    paddle = ai;
    powerUpBoard = "AIPowerUp";
  }
  paddle.powerup = powerUp;
  Crafty(powerUpBoard).each(function () {
    this.text("Power Up: "+powerUp);
  })
}


function removePowerUpFrom(item, powerUpBoard) {
  item.powerup = "";
  Crafty(powerUpBoard).each(function () {
    this.text('Power Up: None');
  });
}