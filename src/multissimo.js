'use strict'

/**
 * multissimo.js
 *
 */

var number1 = 0;
var number2 = 0;
var countRight=0;
var countWrong=0;

var numRows = 11;
var numCols = 11;

var resultTable = new Array(numRows);


function sumTable(table) {
    var sum = 0;

    for (var i=0; i<numRows; i++) {
        for (var j=0; j<numRows; j++) {
            sum = sum + table[i][j];
        }
    }

    return sum;
}

function minMaxTable(table) {
    var minTable = Infinity;
    var maxTable = 0;

    for (var i=0; i<numRows; i++) {
        for (var j=0; j<numRows; j++) {
            minTable = Math.min(minTable, table[i][j]);
            maxTable = Math.max(maxTable, table[i][j]);
        }
    }

    return {min: minTable, max: maxTable};
}

function selectItemFromTable(table, position) {
    var sum = 0;

    for (var i=0; i<numRows; i++) {
        for (var j=0; j<numCols; j++) {
            sum = sum + table[i][j];
            if (sum >= position) {
                return {i: i, j: j};
            }
        }
    }
}

function randomTask(table) {
    var position = Math.floor(Math.random()*sumTable(table));

    var element = selectItemFromTable(table, position);

    number1 = element.i;
    number2 = element.j;
}

function askTask () {
    randomTask(resultTable);

    var taskText = number1 + " * " + number2 + " = ";

    document.querySelector('#task').textContent = taskText;
    document.querySelector('#answer').value = "";
    document.querySelector('#answer').focus();
    document.querySelector('#rating').textContent = "";
}

function sendAnswer () {
    var correctResult = number1*number2;
    var taskText = number1 + " * " + number2 + " = " + correctResult;
    var answer = document.querySelector('#answer').value;

    var ratingText = "";
    var ratingClass = "";
    if (answer == correctResult)  {
        ratingClass = "correct";
        countRight = countRight+1;
        resultTable[number1][number2] = resultTable[number1][number2] / 2;
        taskText = taskText + " ✔";
    } else {
        ratingClass = "wrong";
        countWrong=countWrong+1;
        resultTable[number1][number2] = resultTable[number1][number2] * 2;
        taskText = taskText + " ❌";
    }

    document.querySelector('#task').textContent = taskText;
    document.querySelector('#rating').setAttribute('class', ratingClass);


    showPoints();
    saveStatus();
    showTable();

    window.setTimeout(askTask, 2000);
}

function showPoints() {
    var countTotal = countRight - countWrong;
    var pointStatus = "🎯 " + countTotal +
                               " (✔️" + countRight + " ❌" + countWrong + ") ";
    var threshold3 = 1000;
    var threshold2 = 100;
    var threshold1 = 10;

    var won3 = Math.floor(countTotal / threshold3);
    var won2 = Math.floor((countTotal - threshold3*won3) / threshold2);
    var won1 = Math.floor((countTotal - threshold3*won3 - threshold2*won2) / threshold1);

    for (var i=1; i<=won1; i++) {
        pointStatus = pointStatus + "😋";
    }

    for (var i=1; i<=won2; i++) {
        pointStatus = pointStatus + "🏅";
    }

    for (var i=1; i<=won3; i++) {
        pointStatus = pointStatus + "🏆";
    }


    document.querySelector('#points').textContent = pointStatus;
}

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function showTable() {
    var table = document.querySelector('#statistic');

    removeChildren(table);

    for (var i=-1; i<numRows; i++) {
        var maxMinValue = minMaxTable(resultTable);

        var tr = document.createElement('tr');
        table.appendChild(tr);

        for (var j=-1; j<numCols; j++) {
            if (i >= 0 && j >= 0) {
                var td = createElementWithText('td', "");
                td.setAttribute('title', resultTable[i][j]);
                td.setAttribute('style', 'background-color:'+cellColor(maxMinValue, resultTable[i][j]));
                tr.appendChild(td);
            } else if (i == -1 && j >= 0) {
                tr.appendChild(createElementWithText('th', j));
            } else if (i >= 0 && j == -1) {
                tr.appendChild(createElementWithText('th', i));
            } else {
                tr.appendChild(createElementWithText('th', ""));
            }
        }
    }
}

function cellColor(maxMinValue, value) {
    var partition;
    if (maxMinValue.max - maxMinValue.min == 0) {
        partition = "50";
    } else {
        partition = (value - maxMinValue.min)/(maxMinValue.max - maxMinValue.min)*100;
    }
    var color = "rgb("+partition+"% " + (100 - partition) + "% 50%)";
    return color;
}

function createElementWithText(nodeType, text) {
    var node = document.createElement(nodeType);
    var textNode = document.createTextNode(text);
    node.appendChild(textNode);

    return node;
}

function clearForm () {
    document.querySelector('#task').textContent = "";
    document.querySelector('#answer').value = "";
    document.querySelector('#answer').focus();

    document.querySelector('#counter').textContent = "Correct: " + countRight + "\nWrong: " +countWrong ;
}

function saveStatus () {
    localStorage.setItem('countRight', countRight);
    localStorage.setItem('countWrong', countWrong);
    localStorage.setItem('resultTable', JSON.stringify(resultTable));
}

function loadStatus () {
    countRight = parseInt(localStorage.getItem('countRight'));
    countWrong = parseInt(localStorage.getItem('countWrong'));
    resultTable = JSON.parse(localStorage.getItem('resultTable'));

    if (isNaN(countRight) || isNaN(countWrong)) {
        countRight = 0;
        countWrong = 0;
    }

    if (!resultTable) {
        resultTable = new Array(numRows);
        for (var i=0; i<numRows; i++) {
            resultTable[i] = new Array(numCols);
        }

        for (var i=0; i<numRows; i++) {
            for (var j=0; j<numCols; j++) {
                resultTable[i][j] = 1;
            }
        }
    }
}

function initPage () {
    document.querySelector('#sendAnswer').addEventListener('click', sendAnswer);
    loadStatus();

    showPoints();
    showTable();
    askTask();
}
window.addEventListener('load', initPage)