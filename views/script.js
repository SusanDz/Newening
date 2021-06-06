var myGamePiece;
var myBackground;
var myObstacles = [];
var myBonus = [];
var score  = parseInt(localStorage['score'] || '0', 10);
// const startBoard = document.querySelector(".btn-grp button");
const retry = document.querySelector(".retry button");
const end = document.querySelector(".end");
end.style.display = "none";//dont show death
retry.style.display = "none";
// startBoard.addEventListener("click", startGame);//in index.html press play and game page starts
var player = localStorage.getItem("Player");
console.log("Hi ", player);

function startGame() {
    myGamePiece = new component(120, 210, "santa.png", 604, 450, "image");
    myBackground = new component(1366, 657, "night.jpg", 0, 0, "image");
    myGameArea.start();
    // document.querySelector(".btn-grp button").style.visibility = 'hidden';
    // document.querySelector("#heading").style.visibility = 'hidden';//once game loads hide the button and the heading initially
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1366;
        this.canvas.height = 657;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {//added speedx and speedy
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    //this.score = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);//added speed here
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);//added speed here
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }   
    this.crashWith = function(otherobj) {
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
            crash = false;// +25 -50 +15
        }
        return crash;
    }
}

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i += 1) {
        // console.log("speed of obstacle: "+myObstacles[i].y);
        if (myGamePiece.crashWith(myObstacles[i])) {
            end.style.display="block";
            //retry.style.display="block";
            //retry.addEventListener('click',startGame);//function(){location.reload()}
            myGameArea.stop();
            var play = {username:player, score:score };
            //another post api for checking if current score is greater than score stored
            $.post('/api/leaderboardUpdate', play, function(result) { 
                console.log(result);
                // location.reload();
                // do retry button here
                retry.style.display="block";
                retry.style.top="100px";
                retry.addEventListener('click',startGame);//function(){location.reload()}
            })
            return;
        } 
    }
    for (i = 0; i < myBonus.length; i += 1) {
        if (myGamePiece.crashWith(myBonus[i])) {
            score += 10;
            console.log("Score:"+score);
            myBonus[i].x=1000;
            myBonus[i].y=1000;
            return;
        }
    }
    advance();

    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 5; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -5; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 5; }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        myObstacles.push(new component(50, 50, "gift.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
        myBonus.push(new component(50, 50, "santa.gif",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
    }
    
    myBackground.newPos();    
    myBackground.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 2;
        myObstacles[i].update();
    }
    for (i = 0; i < myBonus.length; i += 1) {
        myBonus[i].y += 2;
        myBonus[i].update();
    }
}

// for (i = 0; i < myObstacles.length; i += 1) {
//     if (myGamePiece.crashWith(myObstacles[i])){
//         end.style.display="block";
//     }
// }

function advance(){
    if((score>20)&&(score<=40)){
        produce(40, 3);
    }
    if((score>40)&&(score<=60)){
        produce(30, 4);
    }
    if((score>60)&&(score<=80)){
        produce(20, 5);
    }
    if((score>80)&&(score<=200)){
        produce(10, 6);
    }
}

function produce(intvl, speed){
    if (myGameArea.frameNo == 1 || everyinterval(intvl)) {
        myObstacles.push(new component(50, 50, "gift.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
        myBonus.push(new component(50, 50, "santa.gif",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += speed;
        myObstacles[i].update();
    }
    for (i = 0; i < myBonus.length; i += 1) {
        myBonus[i].y += speed;
        myBonus[i].update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function clearmove() {
    myGamePiece.image.src = "santa.gif";
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}