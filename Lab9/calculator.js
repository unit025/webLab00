"use strict"
var stack = [];
window.onload = function () {
    var displayVal = "0";
    var decimal_flag = 0;
    var stack_flag = 0;
    var bracket_flag = 0;
    var exp_flag = 0;
    var close_flag = 0;
    for (var i in $$('button')) {
        $$('button')[i].onclick = function () {
            if (exp_flag == 1) {
            	exp_flag = 0;
            	$('expression').innerHTML = "0";
            	displayVal = "0";
            }
            var value = $(this).innerHTML;
            // 숫자
            if (value >= 0 && value <= 9 && displayVal != "Error") {
            	if (close_flag == 1) {
            		close_flag = 0;
            		stack.push("*");
            	}
            	if (displayVal == "0") {
            		displayVal = value;
            	}
   				else {
   					displayVal += value;
   				}
   				stack_flag = 1;
            }
            // AC
            else if (value == "AC") {
            	displayVal = "0";
            	stack = [];
            	$('expression').innerHTML = "0";
            	stack_flag = 0;
            	bracket_flag = 0;
            	exp_flag = 0;
            	close_flag = 0;
            	decimal_flag = 0;
            }
            // .
            else if (value == "." && displayVal != "Error") {
            	if (stack.last() >= 0 && stack.last() <= 9 && decimal_flag == 0) {
            		displayVal += value;
            		decimal_flag = 1;
            		stack_flag = 1;
            	}
            }
            // (, )
            else if ((value == "(" || value == ")") && displayVal != "Error") {
            	if (value == "(" && bracket_flag == 0 && stack.last() != "(") {
            		if (displayVal == "0") {
            			displayVal = value;
            			stack_flag = 1;
            			bracket_flag++;
            		}
            		else if ((stack.last() >= 0 && stack.last() <= 9) && !(stack.last() == ")")) {
            			displayVal += value;
            			stack.push("*");
            			stack_flag = 1;
            			bracket_flag++;
            		}
            		else {
            			displayVal += value;
            			stack_flag = 1;
            			bracket_flag++;
            		}
            	}
            	else {
            		if (bracket_flag  > 0 && stack.last() >= 0 && stack.last() <= 9) {
            			bracket_flag--;
            			displayVal += value;
            			stack_flag = 1;
            			close_flag = 1;
            		}
            	}
            }
            // =, +, -, *, /
            else {
            	if (displayVal != "Error") {
            	// =
            		if (value == "=") {
            			// out of bracket
            			if (((stack.last() >= 0 && stack.last() <= 9) || (stack.last() == ")")) && isValidExpression(stack)) {
           			 		stack = reArrange(stack);
            				stack = infixToPostfix(stack);
            				if ($('expression').innerHTML == "0")
            					$('expression').innerHTML = displayVal+"=";
            				else
            					$('expression').innerHTML += displayVal+"=";
            				displayVal = postfixCalculate(stack);
            				decimal_flag = 0;
            				exp_flag = 1;
            				stack = [];
            				stack_flag = 0;
            				bracket_flag = 0;
            				close_flag = 0;
            			}
            			// still in bracket 
            			else {
            				if ($('expression').innerHTML == "0")
            					$('expression').innerHTML = displayVal+"=";
            				else
            					$('expression').innerHTML += displayVal+"=";
            				displayVal = "Error";
            			}
            		}
            		// +, -, *, /
            		else {
            			if (bracket_flag > 0) {
            				if ((stack.last() >= 0 && stack.last() <= 9) || stack.last() == ")") {
            					displayVal += value;
            					decimal_flag = 0;
            					stack_flag = 1;
            				}
            			}
            			else {
            				if (stack.last() != "+" && stack.last() != "-" && stack.last() != "*" && stack.last() != "/") {
            					if (close_flag == 1) {
            						close_flag = 0;
            					}
            					if ((stack.last() >= 0 && stack.last() <= 9) || stack.last() == ")") {
            						displayVal += value;
            						decimal_flag = 0;
            						stack_flag = 1;
            					}
            					if ($('expression').innerHTML == "0")
            						$('expression').innerHTML = displayVal;
            					else
            						$('expression').innerHTML += displayVal;
            					displayVal = "0";
            				}
            			}
            		}
            	}
            }
            if (stack_flag == 1) {
            	stack.push(value);
            	stack_flag = 0;
            }
            $('result').innerHTML = displayVal;
        };
    }
}
function reArrange(s) {
	var result = [];
	var tmp = [];
	var help ="";
	var dot_flag = 0;
	for (var i = stack.length-1; i >= 0; i--) {
		if (/^[0-9]+$/.test(s[i])) {
			tmp.push(s.pop());
		}
		else if (s[i] == ".") {
			tmp.push(s.pop());
			for (i = i-1; i >= 0; i--) {
				if (/^[0-9]+$/.test(s[i])) {
					tmp.push(s.pop());
				}
				else {
					break;
				}
			}
			while (tmp.length != 0) {
				help += tmp.pop();
			}
			result.push(help);
			help = "";
			dot_flag = 1;
			i++;
		}
		else {
			if (dot_flag == 1) {
				dot_flag = 0;
				result.push(s.pop());
			}
			else {
				while (tmp.length != 0) {
					help += tmp.pop();
				}
				if (help != "") {
					result.push(help);
				}
				help = "";
				result.push(s.pop());
			}
		}
	}
	while (tmp.length != 0) {
		help += tmp.pop();
	}
	if (help != "") {	
		result.push(help);
	}
	while(result.length != 0) {
		s.push(result.pop());
	}
	return s;
}

function isValidExpression(s) {
	var left = 0;
	var right = 0;
	for (var i = 0; i < s.length; i++) {
		if (s[i] == "(")
			left++;
		else if (s[i] == ")")
			right++;
	}
	return left == right ? true : false;
}
function infixToPostfix(s) {
    var priority = {
        "+":0,
        "-":0,
        "*":1,
        "/":1
    };
    var tmpStack = [];
    var result = [];
    for(var i =0; i<stack.length ; i++) {
        if(/^[0-9]+$/.test(s[i])){
            result.push(s[i]);
        } else {
            if(tmpStack.length === 0){
                tmpStack.push(s[i]);
            } else {
                if(s[i] === ")"){
                    while (true) {
                        if(tmpStack.last() === "("){
                            tmpStack.pop();
                            break;
                        } else {
                            result.push(tmpStack.pop());
                        }
                    }
                    continue;
                }
                if(s[i] ==="(" || tmpStack.last() === "("){
                    tmpStack.push(s[i]);
                } else {
                    while(priority[tmpStack.last()] >= priority[s[i]]){
                        result.push(tmpStack.pop());
                    }
                    tmpStack.push(s[i]);
                }
            }
        }
    }
    for(var i = tmpStack.length; i > 0; i--){
        result.push(tmpStack.pop());
    }
    return result;
}
function postfixCalculate(s) {
	var operand = [];
	for (var i = 0; i < s.length; i++) {
		if (s[i] == "+") {
			var a = operand.pop()*1;
			var b = operand.pop()*1;
			operand.push(b+a);
		} 
		else if (s[i] == "-") {
			var a = operand.pop()*1;
			var b = operand.pop()*1;
			operand.push(b-a);
		} 
		else if (s[i] == "*") {
			var a = operand.pop()*1;
			var b = operand.pop()*1;
			operand.push(b*a);
		}
		else if (s[i] == "/") {
			var a = operand.pop()*1;
			var b = operand.pop()*1;
			operand.push(b/a);
		}
		else {
			operand.push(s[i]);
		}
	}
	return operand.pop();
}
