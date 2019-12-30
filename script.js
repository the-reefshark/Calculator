//Reset numbers if calculation has already been done
let equalsPressed = false; 

function addListeners() {
    const btns = Array.from(document.querySelectorAll(".buttons"));
    btns.forEach(btn => btn.addEventListener('click', clickKey));

    document.onkeydown = function(e) {
        setKey(e.keyCode); //Gets keycode of key pressed which using id
    };
}

function clickKey(e) {
    setKey(e.target.id); //Gets id of clicked event and passes to setKey
}

function setKey(e) {
    if (document.getElementById(e) == null || document.getElementById("displayText").innerHTML.length > 19) {
        return; //Stops errors from non-calculator keyboard presses or the display being too long
    }
    let key = document.getElementById(e).innerHTML;
    if (key == "=") { //Checks for valid equation, then moves to calc 
        let equation = document.getElementById("displayText").innerHTML;
        if (equation[equation.length - 1] == " ") {
            return; //If last char is an operator, does nothing
        } else {  //If last char is a number, checks for operators
            checkForOperators(equation); 
        }
    } else { //Sends key to be updated on display
         updateDisplay(key); 
    }
}

//Runs through on "=" key to make sure operators are displayed before sortOperations
function checkForOperators(equation) {
    if (equation.includes("÷") || equation.includes("*") ||
        equation.includes("+") || equation.includes("-")) {
        sortOperations(equation.split(" ")); 
    }
}

function updateDisplay(key) {
    let equation = document.getElementById("displayText").innerHTML;
    if (clearOrDeleteDisplay(key, equation)) {
        return;
    } else if (equation === "0" && !isNaN(key) && key != ".") { 
        //If key is a number, replace 0 w/ key or add decimal behind 0
        document.getElementById("displayText").innerHTML = key; 
    } else if (isNaN(key) && key != ".") {
        //If last char is operator, delete it and space to replace it with new operator
        if (equation[equation.length-1] == " ") {
            equation = equation.slice(0, -3);
        }
        //Adds operator to display with spacing
        document.getElementById("displayText").innerHTML = equation + " " + key + " "; 
        equalsPressed = false;  
    } else if (key == "."){
        checkDecimal(key, equation);   
    } else {   //Adds number to the end 
        if (equalsPressed == true) {
            document.getElementById("displayText").innerHTML = key; 
            equalsPressed = false;  
        } else {
            document.getElementById("displayText").innerHTML = equation + key;  
        }
    }
}

//If key was clear or del, reset display to 0 or check if last char in display is number or operator 
//then remove it with del
function clearOrDeleteDisplay(key, equation) {
    if (key == "AC") {
        document.getElementById("displayText").innerHTML = 0; 
        return true; 
    } else if (key == "Del") {	
        if (equation.length == 1 || equation == "Cannot divide by 0" || equation == "Infinity") {
            equation = 0; //If display is 1 number or error, set to 0
        } else if (equation[equation.length-1] == " "){
            //If last of char is operator, remove it and spacing
            equation = equation.slice(0, -3);
        } else {
            //Remove a single digit/decimal from end
            equation = equation.slice(0, -1); 
        }
        document.getElementById("displayText").innerHTML = equation; 
        return true; 
    } 
}

//Check for decimals between end of equation and the last operator input
function checkDecimal(key, equation) {
    let sliced = ""; 

    if (equation.includes(" ")) {                       //If there is an operator, check for
        for (i = equation.length - 1; i >= 0; i--) {    //decimal from last operator till
            if (equation[i] == " ") {                   //end of string and then extract
                sliced = equation.slice(i);             //that portion
                break; 
            }
        }
        //Return if decimal is in sliced portion
        if (sliced.includes(".")) {
            return;
        }
    //Only triggers if equation does not have an operator
    } else if (equation.includes(".")) { 
        return; 
    }

    //Check for recent calc and clear old result instead of adding decimal to end
    if (equalsPressed == true) {  
        document.getElementById("displayText").innerHTML = "0" + key;  
        equalsPressed = false;  
    } else {
        if (equation[equation.length -1] == " ") { //If decimal after operator, add 0
            document.getElementById("displayText").innerHTML = equation + "0" + key;
        } else {
            document.getElementById("displayText").innerHTML = equation + key; 
        }
    }
}

function sortOperations(equation) {
    let temp = []; 
    let next = []; 
    let num;  

    //Iterate through each element array checking for * or ÷ if found, pass nums to next 
    //operator to do math then push new number to array in place of first number and skip over
    //that operator and the other digit. If no * or ÷ is found, push everything to temp
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "*" || equation[i] == "÷") {
            num = doMath(equation[i-1], equation[i], equation[i+1]);
            temp[i-1] = num; 
            if (equation.length > 3) {
                for (let j = i + 2; j < equation.length; j++) {
                temp.push(equation[j]); 
                }
            }
            break; 
        }
        temp.push(equation[i]); 
    }

    //After * and ÷ have been calculated, look for + and -. Take array temp from previous loop and
    //push to array next
    if (!temp.includes("÷") && !temp.includes("*")){//Does not include
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] == "+" || temp[i] == "-") {
                num = doMath(temp[i-1], temp[i], temp[i+1]); 
                next[i-1] = num; 
                if (temp.length > 3) {
                    for (let j = i + 2; j < temp.length; j++) {
                    next.push(temp[j]); 
                    }
                }
                break; 
            }
            next.push(temp[i]); 
        }
    }

    //If next = 1, push to display, otherwise call sortOperations again depending on what array 
    //was left 
    if (temp.length > 1 && next.length != 1) {
        if (next.length > 1) {
            sortOperations(next); 
        } else {
            sortOperations(temp);
        }
    } else if (temp.length == 1 || next.length == 1) {
        if (next.length == 1) {
            equalsPressed = true; 
            document.getElementById("displayText").innerHTML = parseFloat(next[0].toFixed(5));
        } else {
            document.getElementById("displayText").innerHTML = parseFloat(temp[0].toFixed(5));
            equalsPressed = true; 
        }
    }
}

//Function to perform the caculations
function doMath(aNum, operator, bNum) {
    if (operator == "+") {
        return +aNum + +bNum; 
    } else if (operator == "-") {
        return aNum - bNum; 
    } else if (operator == "*") {
        return aNum * bNum; 
    } else {
        if (aNum == 0) {
            return "Cannot divide by 0"; 
        } else {
            return aNum / bNum; 
        }
    }
}

addListeners(); //Initialize events for click/keydown