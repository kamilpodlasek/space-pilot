/*global $*///for jQuery's $
/*jslint plusplus: true *///for ++
/*jslint node: true *///for global "use strict"
"use strict";
var connectDb, countAngle, moveCircle, savePoints, showRank, userLost, finishGame;//functions
var prevAngle = 360;
var level = 1;
var speed = 1;
var gameStarted = false;
var interval;

$(document).ready(function () {
    var posX, posY, angle, totalSecs;
    
	connectDb();
	
	$('.circle').mouseover(function (e) {
		if (speed < 3) {
            speed += 0.05;
        } else if (speed < 5) {
            speed += 0.04;
        } else if (speed < 7) {
            speed += 0.03;
        } else if (speed < 9) {
            speed += 0.02;
        } else {
            speed += 0.01;
        }
		$('.speed').text((Math.round(speed * 100)) - 99);
		
		posX = e.pageX - $(this).offset().left;
		posY = e.pageY - $(this).offset().top;
		angle = countAngle(50, 50, posX, posY);
		prevAngle = angle;
		moveCircle(angle);
		
		if (!gameStarted) {
			gameStarted = true;
			$(this).addClass("rotation");//rotation animation begins
			totalSecs = 1;
			interval = window.setInterval(function () {
				if (!document.hidden) {//only if tab is active
					if (totalSecs % 20 === 0) {
						level++;
						$('.level').text(level);
					}
					savePoints(level);
					showRank();
					totalSecs++;
				}
			}, 1000);
		}
	}).mouseenter(function () {
		$(this).css("background-image", "url(images/circleLight.png)");
	}).mouseleave(function () {
		$(this).css("background-image", "url(images/circle.png)");
	});
	
	$('.circleEmpty').mouseenter(function () {
		$('.circle').css("background-image", "url(images/circle.png)");
	});
});

$(document).on('click', '.start', function () {
	var name = $('.name').val();
	if (name === "") {
		$('.enterName').css('color', 'red');
		setTimeout(function () {
			$('.enterName').css('color', 'rgba(255,255,255,0.7)');
		}, 300);
	} else if (name.length > 12) {
		window.alert("Your name cannot be longer than 12 characters.");
		$('.name').val("");
	} else {
		$.ajax({
			type: "POST",
			url: "php/db.php",
			dataType: 'text',
			data: {
				name: name
			},
			success: function () {
				$('#welcomeScreen').fadeOut(400);
				$('#gameScreen').fadeIn(1000);
				$('.circle').show();
				showRank();
				$('.map').css({'z-index': '100'});
			}
		});
	}
});

moveCircle = function (angle) {
    var x, y;
    
	$('.circle').promise().done(function () {//after animation is complete
		y = Math.sin(angle * Math.PI / 180) * (speed + 2);
		x = Math.cos(angle * Math.PI / 180) * (speed + 2);
		$('.circle').animate({left: '-=' + x, top: '-=' + y}, 1);
		
		if (!userLost() && prevAngle === angle) {
			moveCircle(angle);
        }
	});
};

countAngle = function (cx, cy, ex, ey) {
	var dy = ey - cy, dx = ex - cx,
        theta = Math.atan2(dy, dx) * 180 / Math.PI;
    
	return theta;
};

userLost = function () {
	var x = parseInt($('.circle').css('left'), 10) / 2,//distances from
        y = parseInt($('.circle').css('top'), 10) / 2;//field center
	if (Math.pow(300, 2) < Math.pow(x, 2) + Math.pow(y, 2)) {//Pythagorean equation
		finishGame();
		return true;
	} else {
		return false;
    }
};

finishGame = function () {
	gameStarted = false;
	clearInterval(interval);
	
	$('#gameScreen').fadeOut(400);
	$("#endGameScreen").css('visibility', 'visible').hide().fadeIn(400);//scrollTop doesn't work on display: none elements
	$('.circle').remove();
	$('.map').css({'z-index': '0'});
};

savePoints = function (amount) {
	$.ajax({
		type: "POST",
		url: "php/points.php",
		dataType: 'text',
		data: {
			amount: amount
		},
		success: function (score) {
			$('.score').text(parseInt(score, 10));
		}
	});
};

showRank = function () {
    var rank, rankString, actualUser;
    
	$.ajax({
        type: "POST",
		url: "php/rank.php",
        success: function (arr) {
			rank = $.parseJSON(arr);
			rankString = "<ol class='rankOl'>";
			$.each(rank, function (key, user) {
				if (typeof user.actualUser !== "undefined") {
					user.name = "<b style='color: #ff6666'>" + user.name + "</b>";
				    actualUser = " class='actualUser'";
				} else {
					actualUser = "";
                }
				rankString += "<li" + actualUser + ">" + user.name + " - <b>" + parseInt(user.score, 10) + "</b> pts.</li>";
				
			});
			rankString += "</ol>";
			
			$('.rank').html(rankString);

			$('.rankOl').scrollTop($('.actualUser').position().top - 238);
        }
    });
};

connectDb = function () {
	$.ajax({
		type: "POST",
		url: "php/db.php"
	});
};