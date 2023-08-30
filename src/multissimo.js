'use strict'

/**
 * multissimo.js
 *
 */

class School {
    constructor() {
        this.trainings = new Array(0);
    }

    save () {
        localStorage.setItem('school', JSON.stringify(this));
    }

    load () {
        let thisLoaded = JSON.parse(localStorage.getItem('school'));

        if (thisLoaded) {
            this.trainings = new Array(0);
            for (let i = 0; i<thisLoaded.trainings.length; i++) {
                this.trainings.push(new Training(thisLoaded.trainings[i]));
            }

            // TODO: Remember last selected
            if (this.trainings.length > 0) {
                trainer = this.trainings[0];
            }
        }
    }

    addNewTraining (name, type, numRows, numCols) {
        this.trainings.push(new Training (name, type, numRows, numCols));
    }
}

class Training {
    constructor(jsObject, type, numRows, numCols) {
        if (!jsObject) {
            this.init();
        } else if (arguments.length == 1) {
            this.name = jsObject.name;
            this.type = jsObject.type;
            this.numRows = jsObject.numRows;
            this.numCols = jsObject.numCols;
            this.table = jsObject.table;
            this.points = new Points(jsObject.points);
        } else {
            this.name = jsObject;
            this.type = type;
            this.numRows = numRows;
            this.numCols = numCols;
            this.initTable();
            this.points = new Points();
        }
    }

    init () {
        this.type = '*';
        this.numRows = 7;
        this.numCols = 8;
        this.table = null;
        this.initTable();
    }

    initTable() {
        this.table = new Array(this.numRows);
        for (let i=0; i<this.numRows; i++) {
            this.table[i] = new Array(this.numCols);
        }

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numCols; j++) {
                this.table[i][j] = 1;
            }
        }
    }


    sum() {
        let sum = 0;

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numRows; j++) {
                sum = sum + this.table[i][j];
            }
        }

        return sum;
    }

    minMaxTable() {
        let minTable = Infinity;
        let maxTable = 0;

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numRows; j++) {
                minTable = Math.min(minTable, this.table[i][j]);
                maxTable = Math.max(maxTable, this.table[i][j]);
            }
        }

        return {min: minTable, max: maxTable};
    }

    selectItem(position) {
        let sum = 0;

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numCols; j++) {
                sum = sum + this.table[i][j];
                if (sum >= position) {
                    return {i: i, j: j};
                }
            }
        }
    }

    randomTask() {
        let position = Math.floor(Math.random()*this.sum());

        let element = this.selectItem(position);

        let task = new Task(this.type, element.i, element.j, element.i * element.j)

        return task;
    }

    correctAnswer (task) {
        this.table[task.number1][task.number2] = this.table[task.number1][task.number2] / 2;
        this.points.correctAnswer();
    }

    wrongAnswer (task) {
       this.table[task.number1][task.number2] = this.table[task.number1][task.number2] * 2;
       this.points.wrongAnswer();
    }

    appendTableAsHtml (htmlTable) {
        for (let i=-1; i<this.numRows; i++) {
            let maxMinValue = this.minMaxTable();

            let tr = document.createElement('tr');
            htmlTable.appendChild(tr);

            for (let j=-1; j<this.numCols; j++) {
                if (i >= 0 && j >= 0) {
                    let td = createElementWithText('td', "");
                    td.setAttribute('title', this.table[i][j]);
                    td.setAttribute('style', 'background-color:'+this.cellColor(maxMinValue, this.table[i][j]));
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

    cellColor(maxMinValue, value) {
        let partition;
        if (maxMinValue.max - maxMinValue.min == 0) {
            partition = "50";
        } else {
            partition = (value - maxMinValue.min)/(maxMinValue.max - maxMinValue.min)*100;
        }
        let color = "rgb("+partition+"% " + (100 - partition) + "% 50%)";
        return color;
    }
}


class Task {
    constructor(type, number1, number2, answer) {
        this.type = type;
        this.number1 = number1;
        this.number2 = number2;
        this.result = answer;
    }

    taskText () {
        return this.number1 + " * " + this.number2 + " = ";
    }

    taskTextWithAnswer () {
        return this.taskText() + this.result;
    }
}

class Points {
    constructor(jsObject) {
        if (!jsObject) {
            this.init();
        } else {
            this.counterRight = jsObject.counterRight;
            this.counterWrong = jsObject.counterWrong;
        }
    }

    init () {
        this.counterRight = 0;
        this.counterWrong = 0;
    }

    correctAnswer () {
        this.counterRight = this.counterRight + 1;
    }

    wrongAnswer () {
        this.wrongAnswer = this.wrongAnswer + 1;
    }
    
    pointText () {
        let countTotal = this.counterRight - this.counterWrong;
        let pointStatus = "🎯 " + countTotal +
                                   " (✔️" + this.counterRight + " ❌" + this.counterWrong + ") ";
        let threshold3 = 1000;
        let threshold2 = 100;
        let threshold1 = 10;
    
        let won3 = Math.floor(countTotal / threshold3);
        let won2 = Math.floor((countTotal - threshold3*won3) / threshold2);
        let won1 = Math.floor((countTotal - threshold3*won3 - threshold2*won2) / threshold1);
    
        for (let i=1; i<=won1; i++) {
            pointStatus = pointStatus + "😋";
        }
    
        for (let i=1; i<=won2; i++) {
            pointStatus = pointStatus + "🏅";
        }
    
        for (let i=1; i<=won3; i++) {
            pointStatus = pointStatus + "🏆";
        }

        return pointStatus;
    }
}

let school = new School();

// TODO Create GUI to add new trainings
school.addNewTraining('Simons 10x10', '*', 2, 2);

let trainer = school.trainings[0];
let currentTask = null;

function askTask () {
    clearForm();

    currentTask = trainer.randomTask();

    document.querySelector('#task').textContent = currentTask.taskText();
}

function checkAnswer () {
    let answer = document.querySelector('#answer').value;
    let taskText = currentTask.taskTextWithAnswer();

    let ratingText = "";
    let ratingClass = "";
    if (answer == currentTask.result)  {
        ratingClass = "correct";
        trainer.correctAnswer(currentTask);
        taskText = taskText + " ✔";
    } else {
        ratingClass = "wrong";
        trainer.wrongAnswer(currentTask);
        taskText = taskText + " ❌";
    }

    document.querySelector('#task').textContent = taskText;
    document.querySelector('#rating').setAttribute('class', ratingClass);
    document.querySelector('#points').textContent = trainer.points.pointText();
    showTable();

    school.save();

    window.setTimeout(askTask, 2000);
}

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function showTable() {
    let table = document.querySelector('#statistic');
    removeChildren(table);
    trainer.appendTableAsHtml(table);
}

function createElementWithText(nodeType, text) {
    let node = document.createElement(nodeType);
    let textNode = document.createTextNode(text);
    node.appendChild(textNode);

    return node;
}

function clearForm () {
    document.querySelector('#task').textContent = "";
    document.querySelector('#answer').value = "";
    document.querySelector('#answer').focus();
}




function initPage () {
    document.querySelector('#sendAnswer').addEventListener('click', checkAnswer);
    school.load();

    document.querySelector('#points').textContent = trainer.points.pointText();
    showTable();
    askTask();
}
window.addEventListener('load', initPage)