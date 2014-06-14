var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var gridEl = function (x, y) {
  return $('.col_' + x + '_' + y);
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
    return gridEl(this.y, this.x);
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
  }, 200);
};

// Engine that drives the ball
var ballEngine = function (ballInstance) {
  this.ball = ballInstance;
  var self = this;
  this.interval = window.setInterval(function () {
    self.next();
  }, 400);
};

ballEngine.prototype.next = function (ballInstance) {
  var self = this;
  console.log(this.ball);
  var grid = {
    w: 32,
    h: 32
  };
  var genCoord = function (coord) {
    console.log(self.ball.direction, self.ball.speed, (Math.cos(toRadians(self.ball.direction)) * self.ball.speed));
    return coord + (Math.cos(toRadians(self.ball.direction)) * self.ball.speed);
  };
  var direction = function () {
    var edge = genCoord(self.ball.x) < grid.w && genCoord(self.ball.x) >= 0;
    console.log('edge:', edge);
    var collision = edge && !!gridEl(self.ball.y, genCoord(self.ball.x)).style.backgroundColor; 
    console.log('edge:', edge, 'collision', collision); 
    if(collision || !edge) {
      return 180 - self.ball.direction;
    } else {
      return self.ball.direction;
    }
  };
  this.ball.direction = direction();
  console.log('direction', this.ball.direction);
  this.ball.move({ y: this.ball.y, x: genCoord(this.ball.x) });
}; 
