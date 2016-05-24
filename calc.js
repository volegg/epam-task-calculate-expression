String.prototype.isNumeric = function () {
    'use strict';
    return !isNaN(parseFloat(this)) && isFinite(this);
}

Array.prototype.clean = function () {
    'use strict';
    for (let i = 0; i < this.length; i++) {
        if (this[i] === '') {
            this.splice(i, 1);
        }
    }
    return this;
}

String.prototype.replaceAt = function (index, character) {
    'use strict';
    return this.substr(0, index) + character + this.substr(index + character.length);
}

let errorMessage;
let postfix;

document.getElementById('validate').addEventListener('click', validate);
document.getElementById('calculate').addEventListener('click', calculate);
let rd = document.getElementById('msg');

function validate() {
    'use strict';
    let str = document.getElementById('expr').value;
    let errLvl = 0;

    if (str.length > 0) {
        errorMessage = '';
        postfix = '';
        if (infixToPostfix(str) < 1) {
            setValOk('expression is valid');
        }
        else {
            setValErr(errorMessage);
            errLvl = 1;
        }
    }
    else {
        setValErr('expression is empty');
        errLvl = 1;
    }
    return errLvl

}
function calculate() {
    'use strict';
    if (validate() === 0) {
        setCalcRes(solvePostfix(postfix));
    }
}

function setCalcRes(str) {
    'use strict';
    rd.style.width = '200px';
    rd.style.background = 'navy';
    rd.style.color = 'white';
    rd.innerHTML = str;
}

function setValOk(str) {
    'use strict';
    rd.style.width = '200px';
    rd.style.background = 'green';
    rd.style.color = 'white';
    rd.innerHTML = str;
}

function setValErr(str) {
    'use strict';
    rd.style.width = '200px';
    rd.style.background = 'red';
    rd.style.color = 'yellow';
    rd.innerHTML = str;
}

function infixToPostfix(infix) {
    'use strict';
    let outputQueue = '';
    let operatorStack = [];
    let errLevel = 0;
    let operators = {

        'x': {
            precedence: 3
        },
        'х': {
            precedence: 3
        },
        ':': {
            precedence: 3
        },
        '#': {// change of a sign
            precedence: 3
        },
        '+': {
            precedence: 2
        },
        '-': {
            precedence: 2
        }
    }
    let vrbl = document.getElementById('vrbl').value;
    if (infix.indexOf('X') !== -1){
        if(vrbl !== '' && vrbl.isNumeric()){
            infix = infix.replace(/[\X]/g, vrbl);
        }
        else {
            errorMessage += ' empty or invalid variable value;';
            errLevel++;
        }
    }

    infix = infix.replace(/\s+/g, '');
    if (infix.replace(/([0-9\+\-\x\х\\:\(\)])/g, '') !== '') {
        errorMessage += ' unexpected chars;';
        errLevel++;
    }
    infix = infix.replace(/\B\(-/g, '(#');
    if (infix[0] === '-') {
        infix = infix.replaceAt(0, '#');
    }
    infix = infix.split(/([\+\-\x\х\\:\#\(\)])/).clean();
    for (let i = 0; i < infix.length; i++) {
        let token = infix[i];
        if (token.isNumeric()) {
            outputQueue += token + ' ';
        } else if ('xх:#+-'.indexOf(token) !== -1) {
            if ('xх:#+-'.indexOf(infix[i - 1]) !== -1) {
                errorMessage += ' two opeators successively;';
                errLevel++;
            }
            else if ((i === 0 || i === infix.length - 1) && (token !== '#')) {
                errorMessage += ' leading or ending operator;';
                errLevel++;
            }
            else {
                let op1 = token;
                let op2 = operatorStack[operatorStack.length - 1];
                while ('xх:#+-'.indexOf(op2) !== -1 && ((operators[op1].precedence <= operators[op2].precedence))) {
                    outputQueue += operatorStack.pop() + ' ';
                    op2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(op1);
            }
        } else if (token === '(') {
            if (i !== 0 && 'xх:#+-'.indexOf(infix[i - 1]) === -1) {
                errorMessage += ' no  valid operator between brackets';
                errLevel++;
            }
            operatorStack.push(token);

        } else if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(' && operatorStack.length > 0) {
                outputQueue += operatorStack.pop() + ' ';
            }
            if (operatorStack[operatorStack.length - 1] === '(') {
                operatorStack.pop();
            }
            else {
                errorMessage += ' missing opening bracket;';
                errLevel++;
            }
        }
    }
    while (operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1] === '(') {
            errorMessage += ' missing closing bracket;';
            errLevel++;

        }
        outputQueue += operatorStack.pop() + ' ';
    }
    postfix = outputQueue;
    return errLevel; 
}

function solvePostfix(postfix) {
    'use strict';
    let resultStack = [];
    postfix = postfix.split(' ').clean();
    for (let i = 0; i < postfix.length; i++) {
        if (postfix[i].isNumeric()) {
            resultStack.push(postfix[i]);
        } else {
            let a = resultStack.pop();
            let b = resultStack.pop();
            if (postfix[i] === '+') {
                resultStack.push(parseInt(a) + parseInt(b));
            } else if (postfix[i] === '-') {
                resultStack.push(parseInt(b) - parseInt(a));
            } else if (postfix[i] === 'х') {
                resultStack.push(parseInt(a) * parseInt(b));
            } else if (postfix[i] === 'x') {
                resultStack.push(parseInt(a) * parseInt(b));
            } else if (postfix[i] === '/') {
                resultStack.push(parseInt(b) / parseInt(a));
            } else if (postfix[i] === ':') {
                resultStack.push(parseInt(b) / parseInt(a));
            } else if (postfix[i] === '#') {
                if (b !== undefined) {
                    resultStack.push(b)
                }
                resultStack.push(parseInt(a) * (-1));
            }
    
        }
    }
    if (resultStack.length > 1) {
        return 'error';
    } else {
        return resultStack.pop();
    }
}