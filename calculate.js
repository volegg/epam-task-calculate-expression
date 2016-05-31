document.getElementById('calculate_button').addEventListener('click', calculateExp);

function calculateExp()
{
	'use strict';
	if(ValidateAll() === true)
	{
		var Data = document.getElementById('expression_input').value;
		Data = formatString(Data);
		var expr_array = expToArray(Data);
		var formatted_array = formatExpr(expr_array);
		var exp_result = executeExpr(formatted_array);
		console.log(exp_result);
		setValidateMessage(exp_result);
	}
}
function expToArray(expr)
{
	'use strict';
	var exp_pattern = new RegExp(/[\d+\+\-\:\x\(\)]/g);
	var exp_mas = expr.match(exp_pattern);
	var mas = [];
	var digit_flag;
	var minus_flag;
	for(var i=0; i < exp_mas.length; i++)
	{
		if(exp_mas[i].match(/\d/) !== null)
		{
			if(digit_flag === true || minus_flag === true)
			{
				mas[mas.length-1] = mas[mas.length-1].concat(exp_mas[i]);
				minus_flag = false;
			}
			else
			{
				mas.push(exp_mas[i]);
				minus_flag = false;
			}
			digit_flag = true;
		}
		else if ((exp_mas[i].match(/\(/) !== null && exp_mas[i+1].match(/\-/) !== null) || (exp_mas[i].match(/\-/) !== null && i === 0))
		{
			minus_flag = true;
			mas.push(exp_mas[i]);
			digit_flag = false;
		}
		else
		{
			mas.push(exp_mas[i]);
			digit_flag = false;
		}
	}
	exp_mas = mas;
	return exp_mas;
}

function formatExpr(expr_array)
{
	'use strict';
	var output_array=[];
	var stack =[];
	for(var i=0; i < expr_array.length; i++)
	{
		if(expr_array[i].match(/\d/) !== null)
		{
			output_array.push(expr_array[i]);

		}
		else
		{
			if(expr_array[i].match(/[\:\x\-\+\(]/) !== null)
			{
				if(stack.length > 0)
				{
					if((stack[stack.length-1].match(/[\:\x]/) !== null && expr_array[i].match(/[\:\x]/) !== null) || (stack[stack.length-1].match(/[\-\+]/) !== null && expr_array[i].match(/[\-\+]/) !== null) || (stack[stack.length-1].match(/[\:\x]/) !== null && expr_array[i].match(/[\-\+]/) !== null))
					{
						output_array.push(stack[stack.length-1]);
						stack.pop();
						stack.push(expr_array[i]);
					}
					else
					{
						stack.push(expr_array[i]);
					}
				}
				else
				{
					stack.push(expr_array[i]);
					
				}
			}
			else
			{
				for(var s = 0; s <= stack.length; s++)
				{
					if(stack[stack.length-1].match(/\(/) !== null)
					{
						stack.pop();
						break;
					}
					else
					{
						output_array.push(stack[stack.length-1]);
						stack.pop();
					}
				}

			}
		}
	}
	while(stack.length > 0)
	{
		output_array.push(stack[stack.length-1]);
		stack.pop();
	}
	return output_array;
}

function executeExpr(formatted_array)
{
	'use strict';
	var resultString;
	var result_array =[];
	for(var i = 0; i < formatted_array.length; i++)
	{
		if(formatted_array[i].match(/\d+/) !== null)
		{
			result_array.push(parseInt(formatted_array[i]));
		}
		else
		{
			if(formatted_array[i].match(/\-/) !== null)
			{
				result_array[result_array.length-2] = result_array[result_array.length-2]-result_array[result_array.length-1];
				result_array.pop();
			}
			else if(formatted_array[i].match(/\+/) !== null)
			{
				result_array[result_array.length-2] = result_array[result_array.length-2]+result_array[result_array.length-1];
				result_array.pop();
			}
			else if(formatted_array[i].match(/\x/) !== null)
			{
				result_array[result_array.length-2] = result_array[result_array.length-2]*result_array[result_array.length-1];
				result_array.pop();
			}
			else if(formatted_array[i].match(/\:/) !== null)
			{
				result_array[result_array.length-2] = result_array[result_array.length-2]/result_array[result_array.length-1];
				result_array.pop();
			}

		}
	}
	return result_array[result_array.length-1];
}