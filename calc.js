String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}

Array.prototype.clean = function() {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}
function calculate(){
	
	var str = document.getElementById('expr').value;
	postfix = infixToPostfix(str);
	result = solvePostfix(postfix);

	document.getElementById('val').innerHTML = postfix;
	document.getElementById('res').innerHTML = result;
}

function infixToPostfix (infix) {
	//TODO: add () validation
	//TODO: add other(?) validation
    var errMsg = "";
    var outputQueue = "";
    var operatorStack = [];
    var operators = {
        
        "x": {
            precedence: 3
        },
        "х": {
            precedence: 3
        },
        ":": {
            precedence: 3
        },
                "+": {
            precedence: 2
        },
        "-": {
            precedence: 2
        }
    }
    infix = infix.replace(/\s+/g, "");
    infix = infix.split(/([\+\-\x\х\\:\(\)])/).clean();
    for(var i = 0; i < infix.length; i++) {
        var token = infix[i];
        if(token.isNumeric()) {
            outputQueue += token + " ";
        } else if("xх:+-".indexOf(token) !== -1) {
            var op1 = token;
            var op2 = operatorStack[operatorStack.length - 1];
            while("xх:+-".indexOf(op2) !== -1 && ((operators[op1].precedence <= operators[op2].precedence))) {
                outputQueue += operatorStack.pop() + " ";
                op2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(op1);
        } else if(token === "(") {
            operatorStack.push(token);
        } else if(token === ")") {
            while(operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue += operatorStack.pop() + " ";
            }
            operatorStack.pop();
        }
    }
    while(operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1] === "("){
        
        }
        outputQueue += operatorStack.pop() + " ";
    }
    return outputQueue;
}


function solvePostfix (postfix) {
        var resultStack = [];
        postfix = postfix.split(" ").clean();
        for(var i = 0; i < postfix.length; i++) {
            if(postfix[i].isNumeric()) {
                resultStack.push(postfix[i]);
            } else {
                var a = resultStack.pop();
                var b = resultStack.pop();
                if(postfix[i] === "+") {
                    resultStack.push(parseInt(a) + parseInt(b));
                } else if(postfix[i] === "-") {
                    resultStack.push(parseInt(b) - parseInt(a));
                } else if(postfix[i] === "*") {
                    resultStack.push(parseInt(a) * parseInt(b));
                } else if(postfix[i] === "x") {
                    resultStack.push(parseInt(a) * parseInt(b));
                } else if(postfix[i] === "/") {
                    resultStack.push(parseInt(b) / parseInt(a));
                } else if(postfix[i] === ":") {
                    resultStack.push(parseInt(b) / parseInt(a));
                }
            }
        }
        if(resultStack.length > 1) {
            return "error";
        } else {
            return resultStack.pop();
        }
}


