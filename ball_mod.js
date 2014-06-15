var ballMod = (function () {

  var bm = {};

  var gridEl = function (x, y) {
    return document.getElementsByClassName('col_' + y + '_' + x)[0];
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
  bm.ball = function (config) {
    config = config || {};
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.speed = config.speed || 1; // in "pixels"
    this.direction = config.direction || 0; // in degrees
    this.element = function () {
      return gridEl(this.x, this.y);
    };
    this.element().click();
    this.color = this.element().style.backgroundColor;
    this.delay = config.delay || 150;
  };

  bm.ball.prototype.move = function (coords) {
    var prevColor = this.element().style.backgroundColor;
    if(this.element().style.backgroundColor) {
      this.element().click();
    }
    this.x = coords.x;
    this.y = coords.y;
    var self = this;
    if(!this.element().style.backgroundColor && this.element().style.backgroundColor !== this.color) {
      window.setTimeout(function () {
        self.element().click();
      }, this.delay);
    }
  };

  // Engine that drives the ball
  bm.ballEngine = function (ballInstance) {
    this.ball = ballInstance;
    var self = this;
    this.interval = window.setInterval(function () {
      self.next();
    }, this.ball.delay*2);
  };


  bm.ballEngine.prototype.next = function (ballInstance) {
    var self = this;
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
      var likelyEl = gridEl(x, y);
      if(typeof likelyEl === 'undefined') {
        return true;
      } else {
        return likelyEl.style.backgroundColor !== '' && likelyEl.style.backgroundColor !== self.ball.element().style.backgroundColor;
      }
    };
    var checkDirection = function (direction) {
      return collide(nextCoord.x(self.ball.x, direction), nextCoord.y(self.ball.y, direction));
    };

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
            return checkDirection(direction);
          });
          var directionIndex = collisionTests.indexOf(self.ball.direction);
          var dHi = directionIndex + 1 < collisionTests.length ? directionIndex + 1 : 0;
          var dLo = directionIndex - 1;
          var reflect = cti[directionIndex] && (!cti[dHi] && !cti[dLo]);
          if(reflect || (cti[dHi] && cti[dLo])) {
            return 180 + self.ball.direction;
          } else {
            if(cti[dHi] || cti[dLo]) {
            var vertical = 360 - self.ball.direction;
            var horizontal = self.ball.direction > 180 ? 540 - self.ball.direction : 180 - self.ball.direction;
            var tests = {
              "2": vertical,
              "6": vertical,
              "0": horizontal,
              "4": horizontal
            };
            var wall = cti[dHi] ? dHi : dLo;
            return tests[wall];
            } else {
              return self.ball.direction;
            }
          }
        } else {
          return self.ball.direction;
        }
      }
    };
    this.ball.direction = newDirection();
    this.ball.move({ y: nextCoord.y(), x: nextCoord.x() });
  }; 

  bm.init = function (config) {
    var e = new bm.ballEngine(new bm.ball(config));
  };

  return bm;

}());
