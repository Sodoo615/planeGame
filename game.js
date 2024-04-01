var myGamePiece;
var myObstacles = [];
var mySound;
var moveDownInterval;
var lives = 3;
var rotationSpeed = 0.8;
var rotationDir = 0;
var gameRunning = false;
var myBullets = [];
var myEnemyBullets = [];
var powerUps = [];
var maxBulletCount = 50;
var bulletCount = maxBulletCount;
var shootInterval;
var maxEnemyBullets = 5;
var revealedPowerUps = [];
var itemPickUp
function startGame() {
    myGamePiece = new component(240, 100, "img/o.png", 10, 120);
    mySound = new sound("sound/explosion.mp3");
    pickUp = new sound("sound/pickup.mp3")
    myGameArea.start();

    window.addEventListener('keydown', function (e) {
        if (gameRunning) {
            switch (e.key) {
                case 'ArrowUp':
                    moveup();
                    break;
                case 'ArrowDown':
                    movedown();
                    break;
                case 'ArrowLeft':
                    moveleft();
                    break;
                case 'ArrowRight':
                    moveright();
                    break;
            }
        }
    });

    window.addEventListener('keyup', function (e) {
        if (gameRunning && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            clearmove();
        }
    });



    moveDownInterval = setInterval(moveDown, 2000);

    clearInterval(shootInterval);
    shootInterval = setInterval(shootObstacle, 4000);

    gameRunning = true;
}

function shoot() {
    if (bulletCount > 0) {
        var bullet = new Bullet(15, 5, "yellow", myGamePiece.x + myGamePiece.width, myGamePiece.y + myGamePiece.height / 2);
        myBullets.push(bullet);
        new sound('sound/gun.mp3').play();  
        bulletCount--;
        updateBulletCount();
    }
}

function addBullets(amount) {
    bulletCount += amount;
    updateBulletCount();
    console.log('Bullets added. Total bullets:', bulletCount);
}
function updateBulletCount() {
    document.getElementById('bulletCount').innerText = 'Bullets: ' + bulletCount;

    if (bulletCount > 0) {
        setTimeout(updateBulletCount, 1000);
    }
}


function moveDown() {
    myGamePiece.speedY = 0.2;
    setTimeout(function () {
        myGamePiece.speedY = -0.2;
    }, 1000);
}

function shootObstacle() {
    for (var i = 0; i < myObstacles.length; i++) {
        if (myEnemyBullets.length < maxEnemyBullets) {
            var obstacle = myObstacles[i];

            var enemyBullet = new EnemyBullet(10, 5, "yellow", obstacle.x, obstacle.y + obstacle.height / 2);
            myEnemyBullets.push(enemyBullet);

           
            if (Math.random() < 0.5) {
                var powerUp = new PowerUp(100, 150, "img/box.png", Math.random() * (myGameArea.canvas.width - 60), 0);
                powerUps.push(powerUp);
            }
        }
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.canvas.style.marginTop = "250px";
        this.interval = setInterval(updateGameArea, 20);
        
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateBullets: function () {
        for (var i = 0; i < myBullets.length; i++) {
            myBullets[i].x += myBullets[i].speedX;
            myBullets[i].update();

            if (myBullets[i].x > this.canvas.width) {
                myBullets.splice(i, 1);
                i--;
            }
        }
    }
};

function Bullet(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 15;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function PowerUp(width, height, imageSrc, x, y) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    
}


function component(width, height, imageSrc, x, y) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.angle = 0;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((Math.PI / 180) * this.angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0) {
            this.y = 0;
            this.speedY = 0;
        }

        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;
            this.speedY = 0;
        }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
    
        var collision = !(
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myleft > otherright
        );
    
        if (collision) {
            
            return true;
        }
    
        return false;
    }
}
function PowerUp(width, height, imageSrc, x, y) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;

        var collision = !(
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myleft > otherright
        );

        return collision;
    }



}
function EnemyBullet(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = -15;
    this.x = x;
    this.y = y;
    new sound('sound/shoot2.mp3').play();

    this.move = function () {
        this.x += this.speed;
    };

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myGameArea.clear();
    for (var i = 0; i < powerUps.length; i++) {
        var powerUp = powerUps[i];
        powerUp.y += 1;
        powerUp.update();

        if (powerUp.y > myGameArea.canvas.height) {
            powerUps.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            console.log('crash detected!');
            mySound.play();
            lives -= 1;
            updateLivesDisplay();
            if (lives === 0) {
                myGameArea.stop();
                gameRunning = false;
            } else {
                myObstacles.splice(i, 1);
                i--;
            }
            return;
        }
    }
    for (var i = 0; i < myBullets.length; i++) {
        for (var j = 0; j < myObstacles.length; j++) {
            if (myBullets[i] && myObstacles[j] && myBullets[i].crashWith && myBullets[i].crashWith(myObstacles[j])) {
                mySound.play()
                myBullets.splice(i, 1);
                myObstacles.splice(j, 1);
                i--;
            }
        }
    }
    for (let i = 0; i < myBullets.length; i++) {
        for (let j = 0; j < myEnemyBullets.length; j++) {
            if (myBullets[i].crashWith(myEnemyBullets[j])) {
                myBullets.splice(i, 1);
                myEnemyBullets.splice(j, 1);
                i--;

            }
        }
    }
   
    for (i = 0; i < myEnemyBullets.length; i++) {
        if (myGamePiece.crashWith(myEnemyBullets[i])) {
            console.log('Player hit by enemy bullet!');
           mySound.play()
            myEnemyBullets.splice(i, 1);
            i--;
            lives--;
            
            updateLivesDisplay();
            

            if (lives === 0) {
                myGameArea.stop();
                gameRunning = false;
                document.getElementById('deathScreen').style.display = "block";
                document.getElementById('bulletCount').style.display = 'none';
                clearInterval(moveDownInterval);
                clearInterval(shootInterval);
                clearInterval(rotationInterval);  

            }

        }
    }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;

        generateObstacle(x, 1);
    }

    function generateObstacle(x, numObstacles = 1) {
        minHeight = 100;
        maxHeight = 220;
        minGap = 100;
        maxGap = 250;
    
        for (let i = 0; i < numObstacles; i++) {
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    
            const obstacleSpeedY = 2;
            let direction = Math.round(Math.random());
    
            let obstacleY = direction === 0 ? 0 + gap : myGameArea.canvas.height - height - gap;
            obstacleY = Math.max(0, Math.min(myGameArea.canvas.height - height, obstacleY));
    
            const obstacleX = x;
    
            const obstacle = new component(250, 100, "img/2.png", obstacleX, obstacleY);
            obstacle.speedY = direction === 0 ? obstacleSpeedY : -obstacleSpeedY;
    
            const shootProbability = 0.5;
    
            if (Math.random() < shootProbability) {
                shootObstacle(obstacle);
            }
    
            myObstacles.push(obstacle);
    
            x += Math.floor(Math.random() * (300 - 150 + 1) + 150);
        }
    }
    
    
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 10;
        myObstacles[i].y += myObstacles[i].speedY;
        myObstacles[i].update();


        if (myObstacles[i].y < 0 || myObstacles[i].y + myObstacles[i].height > myGameArea.canvas.height) {
            myObstacles.splice(i, 1);
            i--;
        }
    }
    myGamePiece.newPos();
    myGamePiece.update();
    myGameArea.updateBullets();

    for (i = 0; i < myEnemyBullets.length; i++) {
        myEnemyBullets[i].move();
        myEnemyBullets[i].update();

        if (myEnemyBullets[i].x < 0) {
            myEnemyBullets.splice(i, 1);
            i--;
        }
    }
  
    if (!gameRunning) {
        myGameArea.clear();
        clearInterval(moveDownInterval);
        clearInterval(shootInterval);
        powerUps = [];
        for (let i = 0; i < powerUps.length; i++) {
            powerUps[i].style.display = 'none';
        }

        return;
    }
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].update();

        if (myGamePiece.crashWith(powerUps[i])) {
            pickUp.play()
            addBullets(10);
            powerUps.splice(i, 1);
            i--;
        }
    }
}





function updateLivesDisplay() {
    console.log('Current lives:', lives)
    document.getElementById('life1').style.visibility = lives >= 1 ? 'visible' : 'hidden';
    document.getElementById('life2').style.visibility = lives >= 2 ? 'visible' : 'hidden';
    document.getElementById('life3').style.visibility = lives >= 3 ? 'visible' : 'hidden';
    if (lives > 0) {
        
        var lifeLostGif = document.getElementById('lifeLostGif');
        lifeLostGif.style.top = myGamePiece.y + 'px';
        lifeLostGif.style.left = myGamePiece.x + 'px';
        lifeLostGif.style.visibility = 'visible';
        
        setTimeout(function () {
            lifeLostGif.style.visibility = 'hidden';
        }, 1000);

        
    }

    if (lives === 0) {
        document.getElementById('deathScreen').style.display = "block";
        document.getElementById('bulletCount').style.display = 'none'
    }

    console.log('Updated lives display.')
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function moveup() {
    rotateSmoothly(-20);
    myGamePiece.speedY = -8;
}

function movedown() {
    rotateSmoothly(20);
    myGamePiece.speedY = 8;
}
function moveleft() {
    myGamePiece.speedX = -8;
}

function moveright() {
    myGamePiece.speedX = 8;
}

function clearmove() {
    rotateSmoothly(0);
    myGamePiece.speedY = 0;
    myGamePiece.speedX = 0;
}


function rotateSmoothly(targetAngle) {
    var deltaAngle = targetAngle - myGamePiece.angle;
    rotationDir = Math.sign(deltaAngle);

    function updateAngle() {
        myGamePiece.angle += rotationDir * rotationSpeed;

        if ((rotationDir === 1 && myGamePiece.angle >= targetAngle) || (rotationDir === -1 && myGamePiece.angle <= targetAngle)) {
            myGamePiece.angle = targetAngle;
            clearInterval(rotationInterval);
        }
    }

    var rotationInterval = setInterval(updateAngle, 20);
}

document.addEventListener('keydown', function (event) {
    if (event.code === "Space" && gameRunning) {
        shoot();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === "w" && !gameRunning) {
        restartGame();
    }
});

function restartGame() {
    myObstacles = [];
    myBullets = [];
    myEnemyBullets = [];
    powerUps = [];
    bulletCount = maxBulletCount;
    lives = 3;
    updateLivesDisplay();
    myGameArea.stop();
    gameRunning = false;
    document.getElementById('deathScreen').style.display = "none"
    document.getElementById('bulletCount').style.display = "block"
    var lifeLostGif = document.getElementById('lifeLostGif');
    lifeLostGif.style.visibility = 'hidden';
    lifeLostGif.style.top = '-100%';
    lifeLostGif.style.left = '-100%';
    startGame();
}
