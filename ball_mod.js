var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var gridEl = function (x, y) {
  return $('.col_' + y + '_' + x);
};

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function range(start, end, step) {
  start = +start || 0;
  step = typeof step == 'number' ? step : (+step || 1);

  if (end === null) {
    end = start;
    start = 0;
  }
  // use `Array(length)` so engines like Chakra and V8 avoid slower modes
  // http://youtu.be/XAqIpGU8ZZk#t=17m25s
  var index = -1,
  length = Math.max(0, Math.ceil((end - start) / (step || 1))),
  result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
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
  var prevColor = this.element().style.backgroundColor;
  if(prevColor !== '') {
    this.element().click();
  }
  this.x = coords.x;
  this.y = coords.y;
  var self = this;
  if(this.element().style.backgroundColor !== prevColor) {
    window.setTimeout(function () {
      self.element().click();
    }, 700);
  }
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
      x = typeof x !== 'undefined' ? x :  self.ball.x;
      direction = typeof direction !== 'undefined' ? direction : self.ball.direction;
      return x + Math.round(Math.cos(toRadians(direction)) * self.ball.speed);
    },
    y: function (y, direction) {
      y = typeof y !== 'undefined' ? y : self.ball.y;
      direction = typeof direction !== 'undefined' ? direction : self.ball.direction;
      return y + Math.round(Math.sin(toRadians(direction)) * self.ball.speed);
    }
  };
  var collide = function (x, y) { 
    console.log('inside collide',x,y);
    var likelyEl = gridEl(x, y);
    if(likelyEl === null) {
      return true;
    } else {
      return likelyEl.style.backgroundColor !== '' && likelyEl.style.backgroundColor !== self.ball.element().style.backgroundColor;
    }
  };
  var checkDirection = function (direction) {
    return collide(nextCoord.x(self.ball.x, direction), nextCoord.y(self.ball.y, direction));
  };

  console.log('check next square', checkDirection(self.ball.direction));
  var collisionTests = range(0, 360, 45);
  var newDirection = function () {
    self.ball.direction %= 360;
    if(self.ball.direction % 90 === 0) {
      if(checkDirection(self.ball.direction)) {
        return 180 - self.ball.direction;
      } else {
        return self.ball.direction;
      }
    } else {
      if(self.ball.direction % 45 === 0){
        var cti = collisionTests.map(function (direction) {
          console.log('mapping');
          return checkDirection(direction);
        });
        var directionIndex = collisionTests.indexOf(self.ball.direction);
        var goBackwards = cti[directionIndex] && (!cti[directionIndex+1] && !cti[directionIndex-1]);
        if(goBackwards || (cti[directionIndex+1] &&cti[directionIndex-1])) {
          console.log('okay switch');
          return 180 + self.ball.direction;
        } else {
          return self.ball.direction;
        }
      } else {
        return self.ball.direction;
      }
    }
  };
  this.ball.direction = newDirection();
  this.ball.move({ y: nextCoord.y(), x: nextCoord.x() });
}; 
