var getDice = function () {
  var dice;
  dice = document.getElementsByTagName('dice');
  return dice;
};

var preventOverlap = function (dice) {
  var ix; var iy; var xDelta; var yDelta; var rotate;
  for (ix = 0 ; ix < dice.length ; ix++) {
    for (iy = ix+1 ; iy < dice.length ; iy++) {
      if (!dice[ix].fixed && !dice[iy].fixed) {
        xDelta = Math.abs(dice[ix].position[0]-dice[iy].position[0]);
        yDelta = Math.abs(dice[ix].position[1]-dice[iy].position[1]);
        if (xDelta < 50 && yDelta < 50) {
          rotate = Math.floor(120*Math.random())-60;
          dice[ix].position[0] -= 50+(Math.random()*50);
          dice[ix].position[1] -= 50+(Math.random()*50);
          dice[ix].style.transform = 'translate('+dice[ix].position[0]+'px, '+dice[ix].position[1]+'px) rotate('+rotate+'deg)';
          dice[iy].position[0] += 50+(Math.random()*50);
          dice[iy].position[1] += 50+(Math.random()*50);
          dice[iy].style.transform = 'translate('+dice[iy].position[0]+'px, '+dice[iy].position[1]+'px) rotate('+rotate+'deg)';
        }
      }
    }
  }
};

var setDice = function (dice, isInitialSetup) {
  // Place the dice in random starting positions.
  var ii; var die; var x; var y; var rotate; var value; var meter;
  value = 0;
  for (ii=0 ; ii < dice.length ; ii++) {
    if (!dice[ii].fixed) {
      die = dice[ii];
      x = 200+Math.random()*500;
      y = 100+Math.random()*300;
      rotate = Math.floor(120*Math.random())-60;
      die.position = [x, y];
      die.style.transform = 'translate('+x+'px, '+y+'px) rotate('+rotate+'deg)';
      die.innerText = Math.ceil(Math.random()*6);
    }
    if (dice[ii].innerText != '3') {
      value += parseInt(dice[ii].innerText);
    }
  }
  preventOverlap(dice);
  if (!isInitialSetup) { readyToRoll = false; }
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
    var returnToRest; var timeout; var rules;
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
    if (lever.position > 120 && readyToRoll) {
      setDice(dice);
    } else if (lever.position > 120 && !readyToRoll) {
      rules = document.getElementsByClassName('rules')[0];
      rules.innerText = "You have to click to hold at least one die before you can roll again.";
      window.setTimeout(function () {
        rules.innerText = "Threes are worth zero, shoot as low as you can. You have to hold at least one before you can roll again.";
      }, 3000);
    }
  };
};

var fixedCount = 0;
var readyToRoll = true;

var onClick = function (e) {
  var die; var meter; var rules; var value; var dice; var ia;
  die = e.target;
  if (!die.fixed) {
    readyToRoll = true;
    die.style.transform = 'translate('+(786+fixedCount*62)+'px, 107px)';
    fixedCount++;
    die.fixed = true;
  }
  if (fixedCount == 5) {
    meter = document.getElementsByClassName('meter')[0];
    rules = document.getElementsByClassName('rules')[0];
    dice = document.getElementsByTagName('dice');
    value = meter.innerText.split(':')[1];
    meter.innerText = 'Final value: '+value;
    rules.innerText = '';
    for (ia=0 ; ia < dice.length ; ia++) {
      dice[ia].fixed = false;
    }
    fixedCount = 0;
  }
};

window.onload = function () {
  var dice; var iz;
  dice = getDice();
  setDice(dice, true);
  setSlider(dice);
  for (iz=0 ; iz < dice.length ; iz++) {
    dice[iz].fixed = false;
    dice[iz].onclick = onClick;
  }
};
