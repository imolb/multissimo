'use strict'

/**
 * multissimo.js
 *
 */

 // TODO: Count time of answer; timeout after x sec? Or weight answer?

  const ThemeIcons = {
    'trophy':  {'ok': '👍', 'nok': '👎', 'L1': '😋', 'L2': '🏅', 'L3': '🏆'},
    'unicorn': {'ok': '👍', 'nok': '👎', 'L1': '🦓', 'L2': '🐴', 'L3': '🦄'},
    'rocket':  {'ok': '👍', 'nok': '👎', 'L1': '🚲', 'L2': '🏎️', 'L3': '🚀'}
 }

class School {
    constructor() {
        this.trainings = new Array(0);
        this.trainerIndex = null;
        this.theme = 'trophy';
    }

    save () {
        localStorage.setItem('school', JSON.stringify(this));
    }

    load () {
        let thisLoaded = JSON.parse(localStorage.getItem('school'));
        this.trainerIndex = 0;

        if (thisLoaded) {
            this.theme = thisLoaded.theme;

            this.trainings = new Array(0);
            for (let i = 0; i<thisLoaded.trainings.length; i++) {
                this.trainings.push(new Training(thisLoaded.trainings[i]));
            }

            if (this.trainings.length > 0) {
                if (thisLoaded.trainerIndex < this.trainings.length) {
                    this.trainerIndex = thisLoaded.trainerIndex;
                } else {
                    this.trainerIndex = 0;
                }
            }
        }

        this.createDefaultTrainings();
    }

    training () {
        return this.trainings[this.trainerIndex];
    }

    addNewTraining (name, type, numRows, numCols) {
        if (this.getTrainingByName(name) === null) {
            this.trainings.push(new Training (name, type, numRows, numCols));
        } else {
            console.error('Duplicate training name '+name);
        }
    }

    getTrainingByName (name) {
        for (let i = 0; i<this.trainings.length; i++) {
            if (this.trainings[i].name == name) {
                return this.trainings[i];
            }
        }
        return null;
    }

    setActiveTrainingByName (name) {
        for (let i = 0; i<this.trainings.length; i++) {
            if (this.trainings[i].name == name) {
                return this.trainerIndex = i;
            }
        }
    }

    setThemeByName (name) {
        if (name == 'unicorn' || name == 'rocket') {
            this.theme = name;
        } else {
            this.theme = 'trophy';
        }
    }

    createDefaultTrainings () {
        if (this.getTrainingByName('5 + 5') === null) {
            this.addNewTraining('5 + 5', '+', 11, 11);
        }
        if (this.getTrainingByName('10 + 10') === null) {
            this.addNewTraining('10 + 10', '+', 11, 11);
        }
        if (this.getTrainingByName('100 + 10') === null) {
            this.addNewTraining('100 + 10', '+', 191, 11);
        }
        if (this.getTrainingByName('20 - 10') === null) {
            this.addNewTraining('20 - 10', '-', 11, 11);
        }
        if (this.getTrainingByName('10 * 10') === null) {
            this.addNewTraining('10 * 10', '*', 11, 11);
        }
        if (this.getTrainingByName('100 : 10') === null) {
            this.addNewTraining('100 : 10', '/', 11, 11);
        }
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

                if (this.type == '+' || this.type == '-') {
                    if (this.name == '5 + 5' && i + j > 10) {
                        this.table[i][j] = 0;
                    } else  if (i == 0 || j == 0) {
                        this.table[i][j] = 0.0625;
                    } else if (i == 1 || j == 1) {
                        this.table[i][j] = 0.125;
                    } else if (this.name == '100 + 10' && Math.floor(i/10)==Math.floor((i+j)/10)) {
                        this.table[i][j] = 0.25;
                    }
                }

                if (this.type == '*' || this.type == '/') {
                    if (i == 0 || j == 0) {
                        if (this.type == '/') {
                            this.table[i][j] = 0;
                        } else {
                            this.table[i][j] = 0.0625;
                        }
                    } else if (i == 1 || j == 1) {
                        this.table[i][j] = 0.125;
                    } else if (i == 5 || j == 5 || i == 2 || j == 2 || i == 10 || j == 10) {
                        this.table[i][j] = 0.25;
                    }
                }

            }
        }
    }


    sum() {
        let sum = 0;

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numCols; j++) {
                sum = sum + this.table[i][j];
            }
        }

        return sum;
    }

    minMaxTable() {
        let minTable = Infinity;
        let maxTable = 0;

        for (let i=0; i<this.numRows; i++) {
            for (let j=0; j<this.numCols; j++) {
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

        switch (this.type) {
            case '+':
                return new Task(this.type, element.i, element.j, element.i, element.j, element.i + element.j)
                break;
            case '-':
                return new Task(this.type, element.i, element.j, element.i+element.j, element.i, element.j)
                break;
            case '*':
                return new Task(this.type, element.i, element.j, element.i, element.j, element.i * element.j)
                break;
            case '/':
                if (element.i == 0) {
                    return this.randomTask();
                } else {
                    return new Task(this.type, element.i, element.j, element.i*element.j, element.i, element.j)
                }
                break;
            default:
                console.error('Undefined training type ' + this.type);
        }
    }

    correctAnswer (task) {
        this.table[task.index1][task.index2] = this.table[task.index1][task.index2] / 2;
        this.points.correctAnswer();
    }

    wrongAnswer (task) {
       this.table[task.index1][task.index2] = this.table[task.index1][task.index2] * 2;
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
        if (value == 0) {
            return "rgb(255, 255, 255)";
        }
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
    constructor(type, index1, index2, number1, number2, answer) {
        this.type = type;
        this.index1 = index1;
        this.index2 = index2,
        this.number1 = number1;
        this.number2 = number2;
        this.result = answer;
    }

    taskText () {
        let operator = this.type;
        if (operator == '/') {
            operator = ':'
        }
        return this.number1 + " " + operator + " " + this.number2 + " = ";
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
        this.counterWrong = this.counterWrong + 1;
    }
    
    pointText () {
        let countTotal = this.counterRight - this.counterWrong;
        let pointStatus = {'L0': '', 'L1': '', 'L2': '', 'L3': ''};
        pointStatus.L0 = "🎯 " + countTotal +
                                   " ("+ ThemeIcons[school.theme]['ok'] + this.counterRight + " " + ThemeIcons[school.theme]['nok'] + this.counterWrong + ") ";
        let threshold3 = 100;
        let threshold2 = 10;
        let threshold1 = 1;
    
        let won3 = Math.max(0, Math.floor(countTotal / threshold3));
        let won2 = Math.max(0, Math.floor((countTotal - threshold3*won3) / threshold2));
        let won1 = Math.max(0, Math.floor((countTotal - threshold3*won3 - threshold2*won2) / threshold1));
    
        for (let i=1; i<=won1; i++) {
            pointStatus.L1 = pointStatus.L1 + ThemeIcons[school.theme]['L1'];
        }
    
        for (let i=1; i<=won2; i++) {
            pointStatus.L2 = pointStatus.L2 + ThemeIcons[school.theme]['L2'];
        }
    
        for (let i=1; i<=won3; i++) {
            pointStatus.L3 = pointStatus.L3 + ThemeIcons[school.theme]['L3'];
        }

        return pointStatus;
    }
}

let school = new School();

let currentTask = null;

function askTask () {
    clearForm();

    currentTask = school.training().randomTask();

    document.querySelector('#task').textContent = currentTask.taskText();
}

function checkAnswer () {
    let answer = document.querySelector('#answer').value;

    if (typeof answer !== 'string' || answer.length == 0) {
        // do not consider as answer
        return;
    }

    let taskText = currentTask.taskTextWithAnswer();

    let ratingText = "";
    let ratingClass = "";
    let timeout = 0;
    if (answer == currentTask.result)  {
        ratingClass = "correct";
        school.training().correctAnswer(currentTask);
        taskText = taskText + " ✔";
        document.querySelector("#overlay").innerHTML = ThemeIcons[school.theme]['ok'];
        timeout = 1000;
    } else {
        ratingClass = "wrong";
        school.training().wrongAnswer(currentTask);
        taskText = taskText + " ❌";
        document.querySelector("#overlay").innerHTML = ThemeIcons[school.theme]['nok'];
        timeout = 3000;
    }

    document.querySelector('#task').textContent = taskText;
    document.querySelector('#rating').setAttribute('class', ratingClass);
    document.querySelector('#overlay').setAttribute('class', ratingClass);
    updateGui(false);

    school.save();

    document.querySelector("#overlay").style.display = "block";

    window.setTimeout(askTask, timeout);
}

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function showTable() {
    let table = document.querySelector('#statistic');
    removeChildren(table);
    school.training().appendTableAsHtml(table);
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
    document.querySelector("#overlay").style.display = "none";
}

function setTrainingSelection () {
    let select = document.querySelector('#training');
    removeChildren(select);

    for (let i = 0; i< school.trainings.length; i++) {
        let option = createElementWithText('option', school.trainings[i].name);
        option.setAttribute('value', school.trainings[i].name);
        if (i == school.trainerIndex) {
            option.setAttribute('selected', 'selected');
        }

        select.appendChild(option);
    }
    select.addEventListener('change', changeTraining);
}

function changeTraining () {
    let select = document.querySelector('#training');
    school.setActiveTrainingByName(select.selectedOptions[0].value);
    updateGui(true);
}

function changeTheme () {
    let select = document.querySelector('#theme');
    school.setThemeByName(select.selectedOptions[0].value);
    updateGui(false);
}

function toggleSettings () {
    let divDisplayStyle = document.querySelector('#settings').style.display;

    if (divDisplayStyle == "none") {
        divDisplayStyle = 'block';
    } else {
        divDisplayStyle = 'none';
    }

    document.querySelector('#settings').style.display = divDisplayStyle;
}

function updateGui (withNewTask) {
    let pointsText = school.training().points.pointText();
    document.querySelector('#pointsL0').textContent = pointsText.L0;
    document.querySelector('#pointsL1').textContent = pointsText.L1;
    document.querySelector('#pointsL2').textContent = pointsText.L2;
    document.querySelector('#pointsL3').textContent = pointsText.L3;
    document.querySelector('#answer').focus();
    showTable();


    let themeSelect = document.querySelector('option[value=' + school.theme + ']');
    if (themeSelect) {
        themeSelect.setAttribute('selected', 'selected');
    }


    if (withNewTask) {
        askTask();
    }
}


function initPage () {
    document.querySelector('#sendAnswer').addEventListener('click', checkAnswer);
    document.querySelector('#theme').addEventListener('change', changeTheme);
    document.querySelector('#toggleSettings').addEventListener('click', toggleSettings);
    school.load();
    setTrainingSelection();
    updateGui(true);
}
window.addEventListener('load', initPage)

const beforeUnloadListener = (event) => {
  event.preventDefault();
  return (event.returnValue = "");
};

window.addEventListener('beforeunload', beforeUnloadListener);