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
var errorMessage;
var postfix;

document.getElementById('validate').addEventListener('click', validate);
document.getElementById('calculate').addEventListener('click', calculate);
var rd = document.getElementById('msg');

function validate(){
    var str = document.getElementById('expr').value;
    var errLvl = 0;
    if(str.length>0){
        errorMessage = "";
        postfix = "";        
        if(infixToPostfix(str)<1){
            setValOk("expression is valid");
        }
        else {
            setValErr(errorMessage);
            errLvl=1;        
        }
    }
    else {
        setValErr('expression is empty'); 
        errLvl=1;    
    }
    return errLvl

}
function calculate(){
	if(validate()===0){
        setCalcRes(solvePostfix(postfix));
    }
}

function setCalcRes (str) {
     rd.style.width='200px';
     rd.style.background='navy';
     rd.style.color = 'white';
     rd.innerHTML = str;
}

function setValOk (str) {
     rd.style.width='200px';
     rd.style.background='green';
     rd.style.color = 'white';
     rd.innerHTML = str;  
}

function setValErr (str) {
     rd.style.width='200px';
     rd.style.background='red';
     rd.style.color = 'yellow';
     rd.innerHTML = str; 
}

function infixToPostfix (infix) {
    var outputQueue = "";
    var operatorStack = [];
    var errLevel = 0;
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
    if (infix.replace(/([0-9\+\-\x\х\\:\(\)])/ig, '')!==''){
        errorMessage += " unexpected chars;"; 
        errLevel++;
    }
    infix = infix.split(/([\+\-\x\х\\:\(\)])/).clean();
    for(var i = 0; i < infix.length; i++) {
        var token = infix[i];
        if(token.isNumeric()) {
            outputQueue += token + " ";
        } else if("xх:+-".indexOf(token) !== -1) {
            if("xх:+-".indexOf(infix[i-1]) !== -1){
                errorMessage += " two opeators successively;"; 
                errLevel++;
            }
            else if (i===0||i===infix.length-1) {
                errorMessage += " leading or ending operator;"; 
                errLevel++;   
            }
            else{
                var op1 = token;
                var op2 = operatorStack[operatorStack.length - 1];
                while("xх:+-".indexOf(op2) !== -1 && ((operators[op1].precedence <= operators[op2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    op2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(op1);
            }
        } else if(token === "(") {
            operatorStack.push(token);
        } else if(token === ")") {
            while(operatorStack[operatorStack.length - 1] !== "("&&operatorStack.length>0) {
                outputQueue += operatorStack.pop() + " ";
            }
            if (operatorStack[operatorStack.length - 1] === "("){
            operatorStack.pop();
            }
            else {
                errorMessage += " missing opening bracket;"; 
                errLevel++;
            }
        }
    }
    while(operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1] === "("){
            errorMessage += " missing closing bracket;";
            errLevel++;

        }
        outputQueue += operatorStack.pop() + " ";
    }
    postfix = outputQueue;
    return errLevel;
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