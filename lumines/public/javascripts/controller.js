document.addEventListener('keyup', function(e) {
    switch(e.keyCode) {
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: // down
      case 32: // space
        game.handleInput(e.keyCode);
      break;
    }
});