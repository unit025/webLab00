"use strict";
var interval = 3000;
var numberOfBlocks = 9;
var numberOfTarget = 3;
var targetBlocks = [];
var selectedBlocks = [];
var timer;

document.observe('dom:loaded', function(){
	$("start").onclick = stopToStart;
	$("stop").onclick = stopGame;
});

function stopToStart(){
    stopGame();
    startToSetTarget();
}

function stopGame(){
	$("state").textContent = "Stop";
	$("answer").textContent = "0/0";
	clearInterval(timer);
	targetBlocks = [];
	selectedBlocks = [];
	var blocks = $$(".block");
	for (var i = 0; i < numberOfBlocks; i++) {
		blocks[i].removeClassName("target");
		blocks[i].removeClassName("selected");
		blocks[i].stopObserving("click");
	}
}

function startToSetTarget(){
	clearInterval(timer);
	targetBlocks = [];
	selectedBlocks = [];
	var blocks = $$(".block");
	for (var i = 0; i < targetBlocks.length; i++) {
		blocks[targetBlocks[i]].removeClassName("target");
	}
	$("state").textContent = "Ready";
	var tmpBlocks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	for (var i = 0; i < numberOfBlocks; i++) {
		var random = Math.floor((Math.random() * numberOfBlocks));
		var tmp = tmpBlocks[random];
		tmpBlocks[random] = tmpBlocks[i];
		tmpBlocks[i] = tmp;
	}
	for (var i = 0; i < numberOfTarget; i++) {
		targetBlocks.push(tmpBlocks[i]);
	}
	timer = setInterval(setTargetToShow, interval);
}

function setTargetToShow(){
	clearInterval(timer);
	$("state").textContent = "Memorize!";
	var blocks = $$(".block");
	for (var i = 0; i < targetBlocks.length; i++) {
		blocks[targetBlocks[i]].addClassName("target");
	}
	timer = setInterval(showToSelect, interval);
}

function showToSelect(){
	clearInterval(timer);
	$("state").textContent = "Select!";
	var blocks = $$(".block");
	for (var i = 0; i < numberOfBlocks; i++) {
		blocks[i].removeClassName("target");
		blocks[i].observe("click", function() {
			if (selectedBlocks.length < numberOfTarget) {
				this.addClassName("selected");
				this.stopObserving("click");
				selectedBlocks.push(this.readAttribute("data-index"));
			}
		});
	}
	timer = setInterval(selectToResult, interval);
}

function selectToResult(){
	clearInterval(timer);
	$("state").textContent = "Checking";
	var blocks = $$(".block");
	for (var i = 0; i < numberOfBlocks; i++) {
		blocks[i].removeClassName("selected");
		blocks[i].stopObserving("click");
	}
	var check = 0;
	for (var i = 0; i < numberOfTarget; i++) {
		for (var j = 0; j < numberOfTarget; j++) {
			if (targetBlocks[i] == selectedBlocks[j]) {
				check++;
			}
		}
	}
	var current = $("answer").innerHTML;
	var array = current.split("/");
	$("answer").textContent = (array[0]*1+check*1) + "/" + (array[1]*1+numberOfTarget*1);
	timer = setInterval(startToSetTarget, interval);
}