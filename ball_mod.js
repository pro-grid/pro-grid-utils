var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var gridEl = function (x, y) {
  return $('.col_' + y + '_' + x);
};

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

// Ball instance constructor
var ball = function (config) {
  config = config || {};
  this.x = config.x || 0;
  this.y = config.y || 0;
  this.speed = config.speed || 1; // in "pixels"
  this.direction = config.direction || 0; // in degrees
  this.element = function () {
    return gridEl(this.x, this.y);
  };
  this.element().click();
};

ball.prototype.move = function (coords) {
  this.element().click();
  this.x = coords.x;
  this.y = coords.y;
  var self = this;
  window.setTimeout(function () {
    self.element().click();
  }, 700);
};

// Engine that drives the ball
var ballEngine = function (ballInstance) {
  this.ball = ballInstance;
  var self = this;
  this.interval = window.setInterval(function () {
    self.next();
  }, 1400);
};


ballEngine.prototype.next = function (ballInstance) {
  var self = this;
  console.log(this.ball);
  var grid = {
    w: 32,
    h: 32
  };
  var nextCoord = {
    x: function (x, direction) {
      x = x || self.ball.x;
      direction = direction || self.ball.direction;
      return x + Math.round(Math.cos(toRadians(direction)) * self.ball.speed);
    },
    y: function (y, direction) {
      y = y || self.ball.y;
      direction = direction || self.ball.direction;
      return y + Math.round(Math.sin(toRadians(direction)) * self.ball.speed);
    }
  };
  var collide = function (x, y) { 
    console.log('inside collide',x,y);
    var likelyEl = gridEl(x, y);
    console.log(likelyEl);
    if(likelyEl === null) {
      return true;
    } else {
      return likelyEl.style.backgroundColor !== '';
    }
  };
  var checkDirection = function (direction) {
    return collide(nextCoord.x(self.ball.x, direction), nextCoord.y(self.ball.y, direction));
  };
  // top right bottom left
  /* var collisionTests = [360, 0, 90, 180];
  collisionTests = collisionTests.map(function (direction) {
    return checkDirection(direction);
  });*/

  console.log('check next square', checkDirection(self.ball.direction));
  var newDirection = function () {
    if(self.ball.direction % 90 === 0) {
      if(checkDirection(self.ball.direction)) {
        return 180-self.ball.direction;
      } else {
        return self.ball.direction;
      }
    } else {
      return self.ball.direction;
    }
  };
  this.ball.direction = newDirection();
  this.ball.move({ y: nextCoord.y(), x: nextCoord.x() });
}; 
