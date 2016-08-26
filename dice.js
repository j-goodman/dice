var getDice = function () {
  var dice;
  dice = document.getElementsByTagName('dice');
  return dice;
};

var setDice = function (dice) {
  // Place the dice in random starting positions.
  var ii; var die; var x; var y; var rotate; var value; var meter;
  value = 0;
  for (ii=0 ; ii < dice.length ; ii++) {
    if (!dice[ii].fixed) {
      die = dice[ii];
      x = 200+Math.random()*500;
      y = 100+Math.random()*300;
      rotate = Math.floor(120*Math.random())-60;
      die.style.transform = 'translate('+x+'px, '+y+'px) rotate('+rotate+'deg)';
      die.innerText = Math.ceil(Math.random()*6);
    }
    if (dice[ii].innerText != '3') {
      value += parseInt(dice[ii].innerText);
    }
  }
  meter = document.getElementsByClassName('meter')[0];
  meter.innerText = 'Current value: '+value;
};

var setSlider = function (dice) {
  var lever;
  lever = document.getElementsByClassName('lever')[0];
  lever.onmousedown = function (event) {
    if (!this.mouseorigin) { this.mouseorigin = event.clientX; }
    document.onmousemove = function (event) {
      this.position = event.clientX-this.mouseorigin;
      this.position = this.position > 240 ? 240 : this.position;
      this.position = this.position < -30 ? -30 : this.position;
      this.style.transform = 'translateX('+(this.position)+'px)';
    }.bind(this);
  };
  document.onmouseup = function () {
    var returnToRest; var timeout;
    document.onmousemove = undefined;
    returnToRest = function () {
      if (lever.position > -20) {
        lever.position -= 9;
        lever.style.transform = 'translateX('+(lever.position)+'px)';
        timeout = window.setTimeout(function () {
          returnToRest();
        }, 2);
      }
    };
    returnToRest();
    if (lever.position > 120) {
      setDice(dice);
    }
  };
};

var fixedCount = 0;
var readyToRoll = true;

var onClick = function (e) {
  var die;
  die = e.target;
  die.style.transform = 'translate('+(786+fixedCount*62)+'px, 107px)';
  fixedCount++;
  die.fixed = true;
};

window.onload = function () {
  var dice; var ix;
  dice = getDice();
  setDice(dice);
  setSlider(dice);
  for (ix=0 ; ix < dice.length ; ix++) {
    dice[ix].fixed = false;
    dice[ix].onclick = onClick;
  }
};
