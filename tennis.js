var ballAng;
var speed = 3;
var ping = 5;
var pong = 0;
var mouseSpeed;
var tempY;
var btn=document.getElementById("btn");
setTimeout(function() {
    btn.style.display='block';
  }, 10000);
function init() {
    document.getElementById("click").style.display = "none";
    document.getElementById("ball").style.display = "inline";
    with( document.getElementById("ball").style ) {
        top = "160px";
        left = "210px";
    }
    document.onmouseup = null;
    document.onmousemove = init1;
    ballAng = Math.round( Math.random() * 100 ) + 130;
    moveDaBall = setInterval("moveBall()", 24); // 공 스피드
}

// 사용자가 라켓 이동
/*function movePaddle(e) {
    e = (e)?e:event;
    if( tempY ) {
        mouseSpeed = Math.round((e.clientY - tempY) * 1.5);
        if( mouseSpeed == 0 ) mouseSpeed = 1;
    }
    with( document.getElementById("playerOne").style ) {
        top = e.clientY - 18 + "px";
        if( parseInt(top) < 24 || parseInt(top) > 289 ) { //리미트 되는 공간 크기
            if( parseInt(top) < 200 ) {
                top = "20px"; 
            } else {
            top = "289px";
            }
        }
    }   
tempY = e.clientY;
}*/

// 공의 움직임
    function moveBall() {
    var ballX = parseInt(document.getElementById("ball").style.left);
    var ballY = parseInt(document.getElementById("ball").style.top);
    var playOneX = parseInt( document.getElementById("playerOne").style.left );
    var playOneY = parseInt( document.getElementById("playerOne").style.top );
    var playTwoX = parseInt( document.getElementById("playerTwo").style.left );
    var playTwoY = parseInt( document.getElementById("playerTwo").style.top );
    // 라켓에 튕김
    if( ballY >= (playOneY - 5) && ballY <= (playOneY + 35 + 5) && ballX >= playOneX && ballX <= (playOneX + 10) ) {
        if( pong == 3 ) {
            ping++;
            pong = 0;
        } else {
        pong++;
        }
        document.getElementById("ball").style.left = playOneX + 10 + "px";
        ballAng = 180 - ballAng - mouseSpeed;
    }  
    if( ballY >= (playTwoY - 5) && ballY <= (playTwoY + 35 + 5) && ballX >= playTwoX && ballX <= (playTwoX + 10) ) {
        if( pong == 3 ) {
            ping++;
            pong = 0;
        } else {
        pong++;
        }
        document.getElementById("ball").style.left = playTwoX + "px";
        ballAng = 180 - ballAng;
        }
    // 벽에 튕김
    if( ballY < 25 || ballY > 316 ) {
        document.getElementById("ball").style.top = (ballY < 25)?25+"px":316+"px";
        ballAng = 360 - ballAng;
        }
    if( ballX <= 24 || ballX >= 417 ) {
        document.getElementById("ball").style.left = (ballX <=24)?24+"px":417+"px";
        if( ballX<= 24 ) {
            endPoint(document.getElementById("twoScore"));
            } else {
        endPoint(document.getElementById("oneScore"));
        }
    }
    moveAI( ballY ); // AI
    moveObjAtAngle( document.getElementById("ball"), ballAng, ping); // 튕기는 각도
}

// 공 반사 각도
function moveObjAtAngle( obj, ang, dist ) {
    with( obj.style ) {
        left = parseInt(left) + ( dist * Math.cos( ang * (Math.PI/180) ) ) + "px";
        top = parseInt(top) - ( dist * Math.sin( ang * (Math.PI/180) ) ) + "px";
    }
}


//-------------------------------------------------------------------------------------------
function init1(){
    //Find out Div Element
    var dataContainerOrientation = document.getElementById('dataContainerOrientation');
    var dataContainerMotion = document.getElementById('dataContainerMotion');
    
    var garden = document.getElementById("garden");
    var playOneX = document.getElementById("playerOne");
    
    var maxX = garden.clientWidth * 2 - playOneX.clientWidth;
    var maxY = garden.clientHeight * 2- playOneX.clientHeight; //ball를 playonex 로 바꿈
    
    //alert(maxY);


    //가속도계가 기기의 방향의 변화를 감지 했을때
    if(window.DeviceOrientationEvent){
        //이벤트 리스너 등록
        window.addEventListener('deviceorientation', function(event) {
            var absolute = event.absolute;
            var alpha = event.alpha;
            var beta = event.beta; //(-180, 180)
            var gamma = event.gamma; //(-90, 90)
            console.log(gamma);
            var html =  "absolute: " +absolute+ "<br>alpha: " +alpha+ "<br>bata: " +beta+ "<br>gamma: "+ gamma; 
            dataContainerOrientation.innerHTML = html;	

            moveBall(24);

            //볼을 움직이자.
            if(beta > 90) {beta = 90};
            if(beta < -90) {beta = -90};
            beta +90;
            gamma +90;

            //ball.style.top = (maxX*beta/180 + 100) + "px";
            playOneX.style.top = (maxY*gamma/180 + 100) + "px";
            
        }, false);
    }

    //가속도에 변화가 발생 할때 
    if(window.DeviceMotionEvent){
        window.addEventListener('devicemotion', function(event){
            var x = event.accelerationIncludingGravity.x;
            var y = event.accelerationIncludingGravity.y;
            var z = event.accelerationIncludingGravity.z;
            //var r = event.accelerationIncludingGravity.r;
          
        


            var html = "x: " +x+ "<br>y: "+y+ "<br>z: " +z;
            dataContainerMotion.innerHTML = html;

           

        }, true);
    }



}

//-------------------------------------------------------------------------------------------------
// AI 라켓
function moveAI( y ) {
    var AI = document.getElementById("playerTwo");
    y = y - 10;
    y = parseInt(AI.style.top) + ((y - parseInt(AI.style.top)) / speed);
    if( y < 24 || y > 289 ) { /*리미트 되는 공간 크기*/
        if( y < 24 ) {
            y = 24;
        } else {
            y = 289;
        }
    }
    AI.style.top = y +"px";
}

// 코트가 끝남
function endPoint(place) {
    clearInterval(moveDaBall);
    ping = 7;
    pong = 0;
    document.onmouseup = init;
    document.getElementById("click").innerHTML = "누르면 다시 운동합니다!";
    place.innerHTML = parseInt(place.innerHTML) + 1;
    if( parseInt(place.innerHTML) == 10 ) {
        if( place.id == "oneScore" ) {
            endGame(1);
        } else {
            endGame(0);
        }
    }
    document.getElementById("click").style.display = "inline";
}

// 게임이 끝남
function endGame(win) {
    document.onmouseup = restartGame;
    if( win ) {
        document.getElementById("click").innerHTML = "10번 이겼어요! 10번 더 운동해볼까요?";
    } else {
        document.getElementById("click").innerHTML = "다시 한 번 운동해 볼까요?";
    }
}

// 재시작
function restartGame() {
    document.getElementById("oneScore").innerHTML = 0;
    document.getElementById("twoScore").innerHTML = 0;
    init();
}

document.ontouchend = init;
