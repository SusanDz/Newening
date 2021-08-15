var myGamePiece;
var myBackground;
var myObstacles = [];
var myBonus = [];
var score  = parseInt(localStorage['score'] || '0', 10);

const retry = document.querySelector(".retry");
const goback = document.querySelector("a");
const end = document.querySelector(".end");

//Hide death and retry, goback buttons
end.style.display = "none";
retry.style.display = "none";
goback.style.display = "none";

var player = sessionStorage.getItem("Player");
console.log("Hi ", player);

function startGame() {
    myGamePiece = new component(120, 210, "orange", 604, 410, "imag");
    myBackground = new component(1366, 657, "night.jpg", 0, 0, "image");
    myGameArea.start();
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

function component(width, height, color, x, y, type) {
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
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
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
        
        if (myGamePiece.crashWith(myObstacles[i])) {
            end.style.display="block";
            retry.style.display="block";
            goback.style.display="block";
            retry.addEventListener('click',function(){location.reload()});
            
            myGameArea.stop();
            var play = {username:player, score:score };
            //Post api for checking if current score is greater than score stored
            $.post('/api/checkScore', play, function(result) {

                if(result != null){
                    $.post('/api/leaderboardUpdate', play)
                }
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
    if (myGameArea.keys && myGameArea.keys[37] && myGamePiece.x!=-1) {myGamePiece.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39] && myGamePiece.x!=1249) {myGamePiece.speedX = 5; }
    
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        myObstacles.push(new component(40, 100, "firecracker.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
        myBonus.push(new component(30, 30, "gift.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
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
        myObstacles.push(new component(40, 100, "firecracker.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
        myBonus.push(new component(30, 30, "gift.png",  Math.random() * (myGameArea.canvas.width - 200), 15 + Math.random() * 30, "image"));
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