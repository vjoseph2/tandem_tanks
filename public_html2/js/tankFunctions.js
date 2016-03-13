var game;
var tankGreen;
var tankRed;
var playerScore = 0;
var background;
var bulletType = 0;
var cycle = 0;
var turretCycle = 0;
var finalScore;
var shots = 0;
var accuracy = 0;
var directHit = 0;
var timer = new Timer();
timer.reset();
var playTime = timer.getElapsedTime();
var tTimer = new Timer();
tTimer.reset();
var waitTime = tTimer.getElapsedTime();
var waited = 0;
var bulletCirc = 7;
var bulletChangeDelay = 0;
var testHolder = 2;
var selectedNone = 0;
var selectedNone2 = 0;
var selectedNone3 = 0;
var selectedNone4 = 0;
var selectedNone5 = 0;
var pointsLefttoSpend;
var regularBullets = 2;
var nukeBullets = 2;
var missile1 = 2;
var blueMissile = 2;
var redMissile = 2;
var greenMissile = 2;
var orangeMissile = 2;
var remainingBullets;
var bTimer = new Timer();
var damageTime = bTimer.getElapsedTime();
var noDamage = 0;
var finalCredits=0;

function Bullet(owner) {
    //owner is the tank owning this bullet

    tBullet = new Sprite(game, "images/bullet.png", 20, 20);
    tBullet.setImgAngle(180);
    tBullet.owner = owner;
    tBullet.hide();
    tBullet.setBoundAction(DIE);
//Sets bullet to die after reaching the end of the screen
    tBullet.weaponSelector = function () {
// Scrolls through weapon list by pressing the X key
        if (tankGreen.bullet.speed === 0) {
            if (bulletCirc % 7 === 0) {
                tankGreen.bullet.changeImage("images/bullet.png");
                document.getElementById("showWeapon").innerHTML = "Normal Bullet";
            } else if (bulletCirc % 7 === 1) {
                tankGreen.bullet.changeImage("images/bullet1.png");
                document.getElementById("showWeapon").innerHTML = "Nuke";
            } else if (bulletCirc % 7 === 2) {
                tankGreen.bullet.changeImage("images/Missile05.png");
                document.getElementById("showWeapon").innerHTML = "Missile";
            } else if (bulletCirc % 7 === 3) {
                tankGreen.bullet.changeImage("images/blueMissile.png");
                document.getElementById("showWeapon").innerHTML = "Blue Missile";
            } else if (bulletCirc % 7 === 4) {
                tankGreen.bullet.changeImage("images/Missile04N.png");
                document.getElementById("showWeapon").innerHTML = "Red Missile";
            } else if (bulletCirc % 7 === 5) {
                tankGreen.bullet.changeImage("images/greenMissile.png");
                document.getElementById("showWeapon").innerHTML = "Green Missile";
            } else if (bulletCirc % 7 === 6) {
                tankGreen.bullet.changeImage("images/orangeMissile.png");
                document.getElementById("showWeapon").innerHTML = "Orange Missile";
            }
        }
    };//end weaponselect;

    tBullet.fire = function () {
        //begin at center of my tank
        //pointing in tank turret's direction
        this.setPosition(this.owner.x, this.owner.y);
        this.setMoveAngle(this.owner.turret.getImgAngle());
        this.setSpeed(20);
        this.show();
        //Decreases  bullet amounts as player shoots
        if (bulletCirc % 7 === 0) {
            regularBullets--;
            if (regularBullets === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 1) {
            nukeBullets--;
            if (nukeBullets === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 2) {
            missile1--;
            if (missile1 === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 3) {
            blueMissile--;
            if (blueMissile === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 4) {
            redMissile--;
            if (redMissile === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 5) {
            greenMissile--;
            if (greenMissile === 0) {
                bulletCirc++;
            }
        }
        if (bulletCirc % 7 === 6) {
            orangeMissile--;
            if (orangeMissile === 0) {
                bulletCirc++;
            }
        }

    }; // end fire;
    tBullet.fire2 = function () {
        //begin at center of enemy tank
        //pointing in tank turret's direction
        this.setPosition(this.owner.x, this.owner.y);
        this.setMoveAngle(this.owner.turret.getImgAngle());
        this.setSpeed(20);
        this.show();
    }; // end fire2;

    tBullet.checkGravity = function () {
        this.addVector(180, 1);
    }; // end checkGravity

    return tBullet;
} // end bullet

function UserTank() {
    //creates new tank to be controlled by the player
    tTank = new Sprite(game, "images/playertank2.png", 50, 25);
    tTank.setSpeed(0);
    tTank.setPosition(100, 473);

    tTank.turret = new Sprite(game, "images/turretplayer.png", 25, 12.5);
    tTank.bullet = new Bullet(tTank);

    tTank.checkKeys = function () {
        //Moves player tank to the left by -2
        if (keysDown[K_A]) {
            this.changeXby(-2);
        }
        //Moves player tank to the right by 2
        if (keysDown[K_D]) {
            this.changeXby(2);
        }
        //secret button: n
        if (keysDown[K_N]) {
            eTank.height = 50;
            eTank.changeImage("images/nb.png");
            document.getElementById("nbPrompt").innerHTML = "You've found NetBeans! Shoot it!";
        }
        //always move turret with me.
        this.turret.setPosition(this.x - 5, this.y - 7);

        //rotate turret upwards
        if (keysDown[K_W]) {
            this.turret.changeImgAngleBy(-5);
            if (this.turret.getImgAngle() < 0) {
                this.turret.setImgAngle(0);
            } // end if
        }
        //rotate turret downwards
        if (keysDown[K_S]) {
            this.turret.changeImgAngleBy(5);
            if (this.turret.getImgAngle() > 90) {
                this.turret.setImgAngle(90);

            }
        }
//        Generates "reloading" text to let the player know when they are alowed
//        tofire again
        if (waitTime - waited >= -1) {
            document.getElementById("reloadPrompt").innerHTML =
                    "Reloading... Wait 1 Second!";
        }

        if (waitTime - waited >= 0) {
            document.getElementById("reloadPrompt").innerHTML = " ";
        }
//fires bullets
        if (keysDown[K_SPACE]) {

            if (waitTime >= waited) {
                this.bullet.fire();
                document.getElementById("firing").play();
                shots = shots + 1;
//        Generates "reloading" text to let the player know when they are alowed
//        tofire again
            }
            if (waitTime >= waited) {
                waited = waitTime + 2;
                document.getElementById("reloadPrompt").innerHTML = "Reloading... Wait 2 Seconds!";
            }
            //removes secret prompt
            document.getElementById("nbPrompt").innerHTML = " ";
        }

        //Changes "s" in reloading text for gramatical purposes           
        if (bulletChangeDelay - waitTime >= 1) {
            s = "s";
        } else {
            s = "";
        }
//Weapon Cycle dialoge to let players know when they are allowed to fire newly 
//selected weapon
        if (bulletChangeDelay - waitTime >= 0) {
            document.getElementById("cyclingPrompt").innerHTML = "Cycling Weapons... Wait "
                    + parseInt(1 + bulletChangeDelay - waitTime) + " Second" + s + " Before Changing";
        } else {
            document.getElementById("cyclingPrompt").innerHTML = " ";
        }


        // the x key will manage the weapon circulation
        if (keysDown[K_X]) {
            if (waitTime - bulletChangeDelay >= 0) {
                bulletCirc += 1;
                bulletChangeDelay = waitTime + 2;
            } else {
                document.getElementById("cyclingPrompt").innerHTML = " ";
            }
        }
        this.turret.update();
        this.bullet.checkGravity();
        this.bullet.update();
        this.bullet.setImgAngle(this.bullet.getMoveAngle() + 90);
        this.bullet.weaponSelector();

    }; // end checkKeys

    return tTank;
} // end tank
function DroneTank() {
    //creates AI tank
    eTank = new Sprite(game, "images/enemyplayertank.png", 50, 25);
    eTank.setSpeed(0);
    eTank.setPosition(450, 473);
    eTank.turret = new Sprite(game, "images/turretplayer2.png", 25, 12.5);
    eTank.turret.setPosition(eTank.x - 5, eTank.y - 7);

    eTank.bullet = new Bullet(eTank);

    eTank.enemyHit = function () {
        //adds explosion on enemy hit

        if (noDamage - bTimer.getElapsedTime() >= 1.4) {
            eTank.changeImage("images/cexplosion1.png");
            eTank.width = 100;
            eTank.height = 65;
        } else if (noDamage - bTimer.getElapsedTime() >= 0.7) {
            eTank.changeImage("images/cexplosion2.png");
        } else if (noDamage - bTimer.getElapsedTime() >= 0.1) {
            eTank.changeImage("images/cexplosion3.png");
        } else if (noDamage - bTimer.getElapsedTime() >= 0) {
            eTank.width = 50;
            eTank.height = 25;
            eTank.changeImage("images/enemyplayertank.png");
        }
    }//end enemyhit
    eTank.angleRandom = function () {
        //Sets AI tank turret angle to a random angle every 3 seconds
        if (cycle % 60 === 0) {

            eTank.turret.setImgAngle((Math.random() * -270) + 180);
            eTank.turret.getImgAngle();
            this.bullet.fire2();
            document.getElementById("firing").play();
        }
    };//end angleRandom


    eTank.AI = function () {
        //invokes random movement and random turret angle
        this.moveRandom();
        this.angleRandom();

    };//end AI function

    eTank.moveRandom = function () {
        //makes the enemy tank move smoothy to random points
        cycle++;

        eTank.turret.setPosition(eTank.x - 15, eTank.y - 5);

        if (cycle % 40 === 0) {
            this.setSpeed((Math.random() * 10) - 5);

        }

        this.turret.update();
        this.bullet.checkGravity();
        this.bullet.update();
    }; // end moveRandom

    eTank.reset = function () {
        //spawns the tank in a new location when hit
        halfWidth = game.width / 2;
        x = (Math.random() * halfWidth) + halfWidth;
        this.setPosition(x, 473);
    }; // end reset

    return eTank;

} // end DroneTank
function collisionDamage() {
    //reduces the player's health bar on collision
    var health = document.getElementById('p2').value;
    document.getElementById("p2").value = health - 2;
    document.getElementById("hit").play();
}//end collisionDamage

function decr() {
    //decreases the current health bar
    var health = document.getElementById('p1').value;
    document.getElementById("p1").value = health - 10;
    if (health < 30) {
        tankRed.changeImage("images/playertank3inj3.png");
    }
    else if (health >= 31 && health <= 50)
        tankRed.changeImage("playertank3inj2.png");
    else if (health >= 51 && health <= 70)
        tankRed.changeImage("playertank3inj1.png");
    else if (health >= 71 && health <= 90)
        tankRed.changeImage("images/enemywithoutturret.png");


}

function checkBullethit() {
    //looks to see if bullet collides with enemy tank and manages accuracy 
    //variables
    if (tankGreen.bullet.collidesWith(tankRed)) {
        document.getElementById("hit").play();
        tankRed.reset();
        document.getElementById("activeScore").innerHTML = playerScore += 50;
        decr();
        directHit = directHit + 1;
        tankGreen.bullet.hide();
        damageTime = bTimer.getElapsedTime();
        noDamage = damageTime + 2;

    } // end if
    if (tankRed.bullet.collidesWith(tankGreen)) {
        var playerDecr = document.getElementById('p2').value;
        document.getElementById('p2').value = playerDecr - 10;
        document.getElementById("hit").play();
        tankRed.bullet.hide();

    }
} // end checkBullethit 
function endGame() {
    //ends game and hides scene
    var health = document.getElementById('p1').value;
    var playerDecr = document.getElementById('p2').value;
    if (health <= 0) {
        scene.hide;
    }
    if (playerDecr <= 0) {
        scene.hide;
    }
}//end endGame
function checkTankhit() {
    //Checks to see if the tanks collide. If collision is detected damage is 
    //applied to player tank only
    if (tankGreen.collidesWith(tankRed)) {
        collisionDamage();
    }
}//end checkTankhit
function init() {
    game = new Scene();
    game.setSize(800, 600);
    background = new Sprite(game, "images/tankeveningbackgroundgrass.png", 800, 600);
    background.setSpeed(0);
    background.setPosition(400, 300);
    tankGreen = new UserTank();
    tankRed = new DroneTank();
    game.start();
    (backMusic).play();
    timer.reset();
    shots = 0;
    directHit = 0;
    accuracy = 0;
} // end init



function timerMaintenance() {
    //dispalys timer
    document.getElementById("timePlayed").innerHTML = parseInt(playTime);
}//ends timerMaintenance

function accuracyCalc() {
    //calculates accuracy
    accuracy = (directHit / shots);
    //this if statement ensures that accuracy starts at 0, not at NaN
    if (100 > accuracy > 0) {
        document.getElementById("accuracyPercent").innerHTML = parseInt(accuracy * 100);
//            console.log("test" + accuracy);
    } else {
        document.getElementById("accuracyPercent").innerHTML = "0";
    }
}//end accuracyCalc
function update() {
    //updates everything that requires updating
    accuracyCalc();
    var enemyHealth = parseInt(document.getElementById('p1').value);
    if (enemyHealth <= 0) {
        document.getElementById('victoryScreen').style.display = "block";
        document.getElementById('finalScore').innerHTML = playerScore;
        game.stop();
    }
    var playerHealth = parseInt(document.getElementById('p2').value);
    if (playerHealth <= 0) {
        document.getElementById('loserScreen').style.display = "block";
        document.getElementById('finalScoreLost').innerHTML = playerScore;
        game.stop();
    }
    eTank.enemyHit();
    lossChecker();
    victoryChecker();
    game.clear();
    checkTankhit();
    background.update();
    tankGreen.checkKeys();
    tankRed.AI();
    checkBullethit();
    tankGreen.update();
    tankRed.update();
    playTime = timer.getElapsedTime();
    waitTime = tTimer.getElapsedTime();
    timerMaintenance();
    calcPoints();
} // end update
function startingGame() {
    //starts game on splash screen
    var eraseScreen = document.getElementById('splashScreen');
    var eraseScreen2 = document.getElementById('instructionScreen');
    eraseScreen.style.display = "none";
    eraseScreen2.style.display = "none";
    init();
}
//end startingGame
function instructionStart() {
    //starts game from instruction screen
    var eraseScreen = document.getElementById('instructionScreen');
    eraseScreen.style.display = "none";
    init();
}//end instructionStart
function showInstructions() {
    //shows instructions when user clicks "instructions"
    var eraseScreen = document.getElementById('splashScreen');
    eraseScreen.style.display = "none";
}//end showInstructions
function startSound() {
    //plays background music
    var playMusic = document.getElementById("backMusic");
    playMusic.muted = true;
}//end startSound
function stopSound() {
   //mutes background music
    var playMusic2 = document.getElementById("backMusic");
    playMusic2.muted = false;
}//end stopSound
function toggle() {
    //toggles sound off
    document.getElementById("soundOff").style.display = "none";
    document.getElementById("soundOn").style.display = "block";
    stopSound();
}//end toggle
function toggleBack() {
    //toggles sound on
    document.getElementById("soundOff").style.display = "block";
    document.getElementById("soundOn").style.display = "none";
    startSound();
}//end toggleBack
function showStore() {
    //shows weapon store on player victory and pauses game
    document.getElementById("storeFront").style.display = "block";
    document.getElementById("victoryScreen").style.display = "none";
    game.stop();
}//end showStore
function calcPoints() {
    //calculates amount of credits earned
    finalCredits = Math.floor((playerScore * accuracy) / 10) * 10;
    if (finalCredits > 0) {
        pointsLefttoSpend = document.getElementById("pointsLeft").innerHTML = finalCredits;
    }
    else if (finalCredis < 0) {
        pointsLefttoSpend = document.getElementById("pointsLeft").innerHTML = "0";
    }
}//end calcPoints

function takeAway() {
    //takes credits away when spent
    if (pointsLefttoSpend > 0) {
        document.getElementById("pointsLeft").innerHTML = pointsLefttoSpend -= 10;
    }
}//end takeAway

function giveBack() {
    //allows player to refund credits
    if (pointsLefttoSpend < 100) {
        document.getElementById("pointsLeft").innerHTML = pointsLefttoSpend += 10;
    }
}//end giveBack

function upOne() {
    //increases weapons bought for weapon number 1
    if (pointsLefttoSpend > 0) {
        document.getElementById("selector").innerHTML = selectedNone += 1;
        takeAway();
    }
}//end upOne

function downOne() {
    //decreases weapons bought for 1st weapon
    if (selectedNone > 0) {
        document.getElementById("selector").innerHTML = selectedNone -= 1;
        giveBack();
    }
}//end downOne

function upOne2() {
    //increases weapons bought for weapon number 2
    if (pointsLefttoSpend > 0) {
        document.getElementById("selector2").innerHTML = selectedNone2 += 1;
        takeAway();
    }
}//end upOne2
function downOne2() {
    //decreases weapons bought for 2nd weapon
    if (selectedNone2 > 0) {
        document.getElementById("selector2").innerHTML = selectedNone2 -= 1;
        giveBack();
    }
}//end downOne2
function upOne3() {
    //increases weapons bought for weapon number 3
    if (pointsLefttoSpend > 0) {
        document.getElementById("selector3").innerHTML = selectedNone3 += 1;
        takeAway();
    }
}//end upOne3
function downOne3() {
    //decreases weapons bought for 3rd weapon
    if (selectedNone3 > 0) {
        document.getElementById("selector3").innerHTML = selectedNone3 -= 1;
        giveBack();
    }
}//end downOne3
function upOne4() {
    //increases weapons bought for weapon number 4
    if (pointsLefttoSpend > 0) {
        document.getElementById("selector4").innerHTML = selectedNone4 += 1;
        takeAway();
    }
}//end upOne4
function downOne4() {
    //decreases weapons bought for 4th weapon
    if (selectedNone4 > 0) {
        document.getElementById("selector4").innerHTML = selectedNone4 -= 1;
        giveBack();
    }
}//end downOne4
function upOne5() {
    //increases weapons bought for weapon number 5
    if (pointsLefttoSpend > 0) {
        document.getElementById("selector5").innerHTML = selectedNone5 += 1;
        takeAway();
    }
}//end upOne5
function downOne5() {
    //decreases weapons bought for 5th weapon
    if (selectedNone5 > 0) {
        document.getElementById("selector5").innerHTML = selectedNone5 -= 1;
        giveBack();
    }
}//end downOne5
function victoryChecker() {
    //checks points on victory and displays appropriate message
    if (playerScore <= 60) {
        document.getElementById("checkVictory").innerHTML =
                "You won but try harder!";
    }
    else if (playerScore >= 100 && playerScore <= 250)
        document.getElementById("checkVictory").innerHTML =
                "You did well, but you can do better!";
    else if (playerScore >= 251 && playerScore <= 350)
        document.getElementById("checkVictory").innerHTML =
                "Wow! Great Job";
    else if (playerScore >= 315 && playerScore <= 480)
        document.getElementById("checkVictory").innerHTML =
                "Spectacular!! You're the Tandem Tank Tsar!";
}//end victoryChecker
function lossChecker() {
    //checks points on loss and displays appropriate message
    if (playerScore <= 60) {
        document.getElementById("checkLoss").innerHTML =
                "You lost but try harder!";
    }
    else if (playerScore >= 100 && playerScore <= 250)
        document.getElementById("checkLoss").innerHTML =
                "It's okay, you can do better!";
    else if (playerScore >= 251 && playerScore <= 350)
        document.getElementById("checkLoss").innerHTML =
                "Almost had it!";
    else if (playerScore >= 315 && playerScore <= 480)
        document.getElementById("checkVictory").innerHTML =
                "Aww! So Close!";
}//end lossChecker
function continueGame() {
    //continues the game after weapon screen and resets timer
    timer.reset();
    var health = 100;
    var enemyHealth = 100;
    document.getElementById('p2').value = enemyHealth;
    document.getElementById('p1').value = health;
    document.getElementById("storeFront").style.display = "none";
    game.start();
    regularBullets = regularBullets + selectedNone;
    nukeBullets = regularBullets + selectedNone;
    missile1 = regularBullets + selectedNone;
    blueMissile = regularBullets + selectedNone;
    redMissile = regularBullets + selectedNone;
    greenMissile = regularBullets + selectedNone;
    orangeMissile = regularBullets + selectedNone;
}//end continueGame