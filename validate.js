document.getElementById('validate_buttton').addEventListener('click', ValidateAll);

function ValidateAll()
{
	'use strict';
	var Data = document.getElementById('expression_input').value;
	var inp_x = document.getElementById('x_value').value;
	if(Data === "" || validateEmpyX(Data) !== true)
	{
		setValidateMessage("validateError");
	}
	else
	{
		Data = formatString(Data); //unused
		if(validateBrackets(Data) !== true || validatePattern(Data) !== true || validatePatternEnd(Data) !== true || validateMinCon(Data) !== true || validateEmptyBr(Data) !== true || validateOperBrackets(Data) !== true)
		{
			setValidateMessage("validateError");
			return false;
		}
		else
		{
			setValidateMessage("validateSuccess");
			return true;	
		}
	}
}

function formatString(Data)
{

	//var tempData = Data.replace(":", "/");
	//tempData = tempData.replace("x", "*");
	'use strict';
	var tempData = Data.replace(/\s/g, "");
	document.getElementById('expression_input').value = tempData;
	tempData = tempData.replace(/\X/g, document.getElementById('x_value').value);
	return tempData;
}

function validateBrackets(Data)
{

	'use strict';
	var leftBracketNum = (Data.match(/\(/g));
	var rigthBracketNum = (Data.match(/\)/g));
	if(leftBracketNum !== null && rigthBracketNum !== null)
	{
		if(leftBracketNum.length !== rigthBracketNum.length)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else if(leftBracketNum === null && rigthBracketNum !== null)
	{
		return false;
	}
	else if(rigthBracketNum === null && leftBracketNum !== null)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function validateOperBrackets(Data)
{
	'use strict';
	var operBracketPat = new RegExp(/\)\(/g);
	if(Data.match(operBracketPat) !== null)
	{
		return false;
	}
	else
	{
		return true;
	}
}
function validatePattern(Data)
{

	'use strict';
	window.console.log("String before validatePattern: "+Data);
	var validPattern = new RegExp(/[0-9\+\-\:\x\(\)]/ig);
	var tempData = Data.replace(validPattern, "");
	window.console.log("String before validatePattern: "+ tempData);
	if(tempData.length > 0)
	{
		return false;
	}
	else
	{
		return true;
	}
}
function validatePatternEnd(Data)
{
	'use strict';
	window.console.log("String before validatePatternEnd: "+ Data);
	var validPattern = new RegExp(/([\+\-\x\:]{2,})/g);
	//var validPatternEnd = new RegExp(/^[\+\-\x\:]|[\+\-\x\:]$/g);
	var validPatternEnd = new RegExp(/^[\+\-\x\:]\D+|[\+\-\x\:]$/g);
	var tempData = Data;
	tempData = Data.match(validPattern);
	window.console.log("String after validatePatternEnd: "+ tempData);
	if(tempData === null)
	{
		tempData = Data.match(validPatternEnd);
		if(tempData === null)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

function validateEmptyBr(Data)
{
	'use strict';
	var EmptyPattern = new RegExp(/\(\)/g);
	var tempData = Data;
	tempData = Data.match(EmptyPattern);
	if(tempData !== null)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function validateMinCon(Data)
{
	'use strict';
	var MinPattern = new RegExp(/(\d+(\+|\-|\x|\:)\d+)|((\+|\-|\x|\:)\d+)|(\d+(\+|\-|\x|\:))/g);
	var tempData = Data;
	tempData = Data.match(MinPattern);
	if(tempData !== null)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function validateEmpyX(Data)
{

	'use strict';
	var ix = document.getElementById('x_value').value;
	if(ix !== "")
	{
		document.getElementById('xMessage').innerHTML = "Input X: "+ix;
	}
	else
	{
		document.getElementById('xMessage').innerHTML = "";
	}
	var patternX = new RegExp(/\X/g);
	var tempData = Data;
	tempData = Data.match(patternX);
	if((tempData !== null && ix === "") || (tempData === null && ix !== ""))
	{
		return false;
	}
	else
	{
		return true;
	}

}


function setValidateMessage(messageType)
{

	'use strict';
	if(messageType === "validateSuccess")
	{
		document.getElementById('validateMessage').style.width="200px";
		document.getElementById('validateMessage').style.background = "green";
		document.getElementById('validateMessage').innerHTML='<font color = "white">Expression is valid!</fonr>';
	}
	else if(messageType === "validateError")
	{
		document.getElementById('validateMessage').style.width="200px";
		document.getElementById('validateMessage').style.background = "red";
		document.getElementById('validateMessage').innerHTML='<font color="yellow">Expression is not valid!</font>';
	}
	else
	{
		document.getElementById('validateMessage').style.width="200px";
		document.getElementById('validateMessage').style.background = "blue";
		document.getElementById('validateMessage').innerHTML='<font color="white">'+ messageType+ '</font>';
	}
}
