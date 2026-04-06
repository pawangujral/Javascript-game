/*
@Author : PAWAN GUJRAL
*/



// Enemies our player must avoid
var Enemy = function() { 
    // Enemy Positions
    this.enemyX = [-100, -200, -400];
    this.enemyY = [50,140,230,320];
    this.sprite = 'images/enemy-bug.png';
    this.x = this.enemyX[Math.floor(Math.random() * this.enemyX.length)];
    this.y = this.enemyY[Math.floor(Math.random() * this.enemyY.length)];
    this.speed = 400; // MAKE DEFAULT SPEED FOR BUGS
};
 
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    //resets enemys at start after reaching end of board
    if (this.x > 505) {
        this.reset();
    }
};

Enemy.prototype.reset = function(){
    this.x = this.enemyX[Math.floor(Math.random() * this.enemyX.length)];
    this.y = this.enemyY[Math.floor(Math.random() * this.enemyY.length)];
}


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player Class
var Player = function(){

  // Player Image
  //  this.sprite = "images/char-princess-girl.png";
    this.x = 200;
    this.y = 410;
    this.score = 0;
    this.lives = 5;

    // show default score & lives at screen
    $('.lives').text(this.lives);
    $('.score').text(this.score);
};

Player.prototype.icon = function(){
    var playerIcon = $('.playerSelect').find('.active').children().attr('src');
    this.sprite = playerIcon;
}
// Player update function
Player.prototype.update = function(dt){
     this.collide();
     this.icon();
};

Player.prototype.collide = function() {
    var $this = this;
    $.each(allEnemies, function(k, i){
        if(this.y === $this.y && $this.x - Math.floor(this.x) < 50  && $this.x - Math.floor(this.x) > -50) {
            
            explosion.x = $this.x;
            explosion.y = $this.y;
            $this.lost();
            setTimeout(function(){
                explosion.x = -500;
                explosion.y = -5000;
            },2000);
        }
    });
};

// LOST RESET
Player.prototype.lost = function(){
    // start positions
    this.x = 200;
    this.y = 410;
    // reduce life 
    this.lives--;
    $('.lives').text(this.lives);

    // check score reach 0 
    if(!this.lives)
        this.over();
}

// GAME OVER
Player.prototype.over = function(){ 
    $('.lives').text('0');
    $('.sectionThree').addClass('hide');
    $('.sectionFive').removeClass('hide');
}

//  SUCCESSFUL RESET
Player.prototype.reset = function(){
    // start positions
    this.x = 200;
    this.y = 410;
    // update score
    this.score++;
    $('.score').text(this.score);
    
    if (this.score >= 100)
    {

        $('.score').text('100');
        $('.sectionThree').addClass('hide');
        $('.sectionFour').removeClass('hide'); 
    }
};

// Player render function
Player.prototype.render = function(){
    // draw player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

//PLayer handle function
Player.prototype.handleInput = function(key){
    switch(key){
        case 'up':
            // move up 
            if(this.y > 50)
            { 
                this.y -= 90;
            }
            else if(this.y == 50 && this.y >= -5){
                this.y -= 55;  
            }
            break;

        case 'down':
            // move down
            if(this.y >= -5 && this.y < 50)
            {
                this.y += 55;
            }
            else if(this.y >= 50 && this.y <= 320)
            {
                this.y += 90;
            } 
            break;

        case 'left':
            // move left
            if(this.x >= 30)
            {
                this.x -= 100;
            }
            break;

        case 'right':
            //move right
            if(this.x <= 390)
            {
                this.x += 100;
            }

            break;
    }
};


// HEART CONTENT
var Items = function(){

// Position Array
    this.itemsX = [0, 100, 200, 300, 400];
    this.itemsY = [50,140,230,320];
    this.icons = ['images/Heart.png','images/Key.png','images/Gem-Blue.png','images/Gem-Green.png','images/Gem-Orange.png']
    this.sprite = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.x = this.itemsX[Math.floor(Math.random() * this.itemsX.length)];
    this.y = this.itemsY[Math.floor(Math.random() * this.itemsY.length)];
}

Items.prototype.update = function(){
    this.collide();
}
 

Items.prototype.gain = function(){
    // All Items images
    var heart = 'images/Heart.png';
    var key = 'images/Key.png';
    var gemBlue = 'images/Gem-Blue.png';
    var gemGreen = 'images/Gem-Green.png';
    var gemOrange = 'images/Gem-Orange.png';

    // check which Item player has taken
    if(this.sprite == heart)
    {
        // increase player life by 1
        player.lives++;
        // show on scoreboard
        $('.lives').text(player.lives);
    }
    else if(this.sprite == key)
    {
        // increase player score by 5
        player.score = player.score + 5;
        // show on scoreboard
        $('.score').text(player.score);
    }
    else if(this.sprite == gemBlue || this.sprite == gemGreen || this.sprite == gemOrange)
    {
        // increase player score by 10
       player.score = player.score + 10;
       // show on scoreboard
       $('.score').text(player.score);
    }

    items.reset();
}

Items.prototype.reset = function(){
    this.x = -500;
    this.y = -500;

    var test = [400]

    // Player winner if score more than 100
    if(player.score >= 100)
    { 
        $('.sectionThree').addClass('hide');
        $('.sectionFour').removeClass('hide'); 
    }

    var $this = this;
    this.timeout = setTimeout(function(){
        //console.log($this.icons[Math.floor(Math.random() * $this.icons.length)]);
        $this.sprite = $this.icons[Math.floor(Math.random() * $this.icons.length)];
        $this.x = $this.itemsX[Math.floor(Math.random() * $this.itemsX.length)];
        $this.y = $this.itemsY[Math.floor(Math.random() * $this.itemsY.length)];
    },1000); // respawn after 10 sec;
}
// Collide function with Player
Items.prototype.collide = function() {
    if(this.y === player.y && player.x - Math.floor(this.x) < 50  && player.x - Math.floor(this.x) > -50) {

        this.gain();
    }
}

Items.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Explosion
var Explosion = function(){
    this.sprite = 'images/boom.png'
    this.x = -500;
    this.y = -500;
}

Explosion.prototype.render = function(){
   
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];

var player = new Player();

var items = new Items();

var explosion = new Explosion();


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Canvas scaling for mobile
function scaleCanvas() {
    var wrapper = document.getElementById('canvas-wrapper');
    var canvasEl = document.querySelector('#canvas canvas');
    if (!wrapper || !canvasEl) return;
    var parentWidth = wrapper.parentElement.clientWidth;
    var scale = Math.min(1, parentWidth / 505);
    canvasEl.style.transform = 'scale(' + scale + ')';
    wrapper.style.width = Math.floor(505 * scale) + 'px';
    wrapper.style.height = Math.floor(606 * scale) + 'px';
}

window.addEventListener('resize', scaleCanvas);

// Touch swipe detection
var touchStartX = 0, touchStartY = 0;

document.getElementById('canvas-wrapper').addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

document.getElementById('canvas-wrapper').addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    var absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    if (absDx > absDy) {
        player.handleInput(dx > 0 ? 'right' : 'left');
    } else {
        player.handleInput(dy > 0 ? 'down' : 'up');
    }
    e.preventDefault();
}, { passive: false });


$(document).ready(function(){
    // User select
    $('.playerSelect').on('click','li',function(){
        $('.playerSelect li').removeClass('active'); 
        $(this).addClass('active');
    }); 
    // start GAME
    $('#startGame').on('click',function(){

        var activeCls = $('.playerSelect li').hasClass('active');
        if(activeCls)
        {
            $('.sectionTwo').addClass('hide');
            $('.sectionThree').removeClass('hide');
            Engine();
            setTimeout(scaleCanvas, 50);
        }
        else {
            alert('Select Avatar');
        }
    });

    // D-pad controls
    function addDpadBtn(id, direction) {
        var btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            player.handleInput(direction);
        }, { passive: false });
        btn.addEventListener('click', function() {
            player.handleInput(direction);
        });
    }
    addDpadBtn('btnUp', 'up');
    addDpadBtn('btnDown', 'down');
    addDpadBtn('btnLeft', 'left');
    addDpadBtn('btnRight', 'right');

    // Section shows
    $('.sectionOne').on('click','button',function(){
        var userName = $('#userName').val();
        if(userName == '')
        {
            alert('Enter Username');
        }
        else {

            playerName = userName;
            $('.userName').text(playerName);
            $('.sectionTwo').removeClass('hide');
            $('.sectionOne').addClass('hide');
        }
    });
    // refresh game
    $('.refreshGame').on('click',function(){
       location.reload();
    });
});