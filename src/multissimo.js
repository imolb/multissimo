'use strict'

/**
 * multissimo.js
 *
 */

// TODO: test and optimize for smartphone layout
// TODO: Concept for navigation buttons
// TODO: Consideration of optimized saving (only per user; or only after specific delay)

const CollectionIcons = {
  mammals: [
    '🐌', '🦋', '🐝', '🐞', '🦗', '🪳', '🦂', '🦟', '🪰', '🪱',
    '🐊', '🐢', '🦎', '🦕', '🦖', '🐋', '🐬', '🦭', '🐟', '🐠',
    '🐤', '🐥', '🐧', '🦅', '🦆', '🦢', '🦉', '🦩', '🦚', '🦜',
    '🐕', '🐩', '🐈', '🐱', '🐀', '🐰', '🐇', '🐿', '🦫', '🦔',
    '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🦝',
    '🐒', '🦍', '🦧', '🐺', '🦊', '🐄', '🐷', '🐖', '🐗', '🐑',
    '🦬', '🐂', '🐃', '🐐', '🐪', '🦙', '🦒', '🐅', '🐆', '🦓',
    '🐘', '🦣', '🦏', '🦛', '🦁', '🐯', '🦄', '🐴', '🐫', '🐎'
  ]
}

class UserManagement {
  constructor () {
    this.userList = new Array(0) // array of School objects
    this.user = null
  }

  load () {
    const thisLoaded = JSON.parse(window.localStorage.getItem('userManagement'))

    if (thisLoaded) {
      this.userList = new Array(0)
      for (let i = 0; i < thisLoaded.userList.length; i++) {
        this.userList.push(new School(thisLoaded.userList[i]))
      }

      // user is stored as index in JSON object
      if (thisLoaded.user < this.userList.length) {
        this.user = this.userList[thisLoaded.user]
      } else if (this.userList.length > 0) {
        this.user = this.userList[0]
      }
    } else {
      // nothing loaded. Create one default user
      this.addUser('defaultUser')
      this.user = this.userList[0]
    }
  }

  save () {
    const jsonString = JSON.stringify(this, this.jsonReplace.bind(this), ' ')
    // console.log(jsonString)
    window.localStorage.setItem('userManagement', jsonString)
  }

  jsonReplace (key, value) {
    if (key === 'user') {
      return this.getUserIndex()
    } else if (key === 'training') {
      return this.user.getTrainingIndex()
    } else {
      return value
    }
  }

  addUser (userName) {
    if (!this.getUserByName(userName)) {
      this.userList.push(new School(userName))
      this.setActiveUserByName(userName)
    }
  }

  removeUser () {
    if (this.userList.length > 1) {
      this.userList.splice(this.getUserIndex(), 1)
      this.user = this.userList[0]
    }
  }

  userNameList () {
    const userNameList = Array => new Array()
    for (let i = 0; i < this.userList.length; i++) {
      userNameList.push(this.userList[i].userName)
    }
    return userNameList
  }

  getUserByName (userName) {
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].userName === userName) {
        return this.userList[i]
      }
    }
    return null
  }

  getUserIndex () {
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i] === this.user) {
        return i
      }
    }
    return null
  }

  setActiveUserByName (userName) {
    this.user = this.getUserByName(userName)
  }
}

class School {
  constructor (jsObject) {
    if (arguments.length === 0) {
      // empty object
      this.initEmptyInstance()
    } else if (arguments.length === 1 && typeof jsObject === 'string') {
      // new created object. Input parameter is userName
      this.initEmptyInstance()
      this.userName = jsObject
      this.createDefaultTrainings()
      this.training = this.trainingList[0]
    } else if (arguments.length === 1 && typeof jsObject === 'object') {
      // jsObject is JSON, Initialize object with data from JSON jsObject
      this.userName = jsObject.userName

      this.trainingList = new Array(0)
      for (let i = 0; i < jsObject.trainingList.length; i++) {
        this.trainingList.push(new Training(jsObject.trainingList[i]))
      }

      // training is stored as index in JSON jsObject
      if (jsObject.training < this.trainingList.length) {
        this.training = this.trainingList[jsObject.training]
      } else if (this.trainingList.length > 0) {
        this.training = this.trainingList[0]
      }
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.userName = null
    this.trainingList = new Array(0)
    this.training = null
  }

  getTrainingByName (name) {
    for (let i = 0; i < this.trainingList.length; i++) {
      if (this.trainingList[i].name === name) {
        return this.trainingList[i]
      }
    }
    return null
  }

  getTrainingIndex () {
    for (let i = 0; i < this.trainingList.length; i++) {
      if (this.trainingList[i] === this.training) {
        return i
      }
    }
    return null
  }

  trainingNameList () {
    const trainingNameList = Array => new Array()
    for (let i = 0; i < this.trainingList.length; i++) {
      trainingNameList.push(this.trainingList[i].name)
    }
    return trainingNameList
  }

  setActiveTrainingByName (name) {
    this.training = this.getTrainingByName(name)
  }

  createDefaultTrainings () {
    const trainingListDefinition = []
    trainingListDefinition.push({ name: '5 + 5', type: '+', numRows: 11, numCols: 11 })
    trainingListDefinition.push({ name: '10 + 10', type: '+', numRows: 11, numCols: 11 })
    trainingListDefinition.push({ name: '20 - 10', type: '-', numRows: 11, numCols: 11 })
    trainingListDefinition.push({ name: '100 + 10', type: '+', numRows: 191, numCols: 11 })
    trainingListDefinition.push({ name: '100 - 10', type: '-', numRows: 101, numCols: 101 })
    trainingListDefinition.push({ name: '10 * 10', type: '*', numRows: 11, numCols: 11 })
    trainingListDefinition.push({ name: '100 : 10', type: '/', numRows: 11, numCols: 11 })

    for (let i = 0; i < trainingListDefinition.length; i++) {
      if (this.getTrainingByName(trainingListDefinition.name) === null) {
        this.trainingList.push(new Training(trainingListDefinition[i].name,
          trainingListDefinition[i].type,
          trainingListDefinition[i].numRows,
          trainingListDefinition[i].numCols))
      }
    }
  }
}

class Training {
  constructor (jsObject, operator, numRows, numCols) {
    if (arguments.length === 0) {
      // empty object
      this.initEmptyInstance()
    } else if (arguments.length === 4 && typeof jsObject === 'string' &&
        typeof operator === 'string' && typeof numRows === 'number' && typeof numCols === 'number') {
      // new created object
      this.initEmptyInstance()
      this.name = jsObject
      this.operator = operator
      this.numRows = numRows
      this.numCols = numCols
      this.initProbabilityTable()
    } else if (arguments.length === 1 && typeof jsObject === 'object') {
      // jsObject is JSON, Initialize object with data from JSON jsObject
      this.initEmptyInstance()
      this.name = jsObject.name
      this.operator = jsObject.operator
      this.numRows = jsObject.numRows
      this.numCols = jsObject.numCols
      this.probabilityTable = jsObject.probabilityTable
      this.points = new Points(jsObject.points)
      this.collection = new Collection(jsObject.collection)
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.name = null
    this.operator = null
    this.numRows = null
    this.numCols = null
    this.probabilityTable = null
    this.points = new Points()
    this.collection = new Collection()
  }

  initProbabilityTable () {
    this.probabilityTable = new Array(this.numRows)
    for (let i = 0; i < this.numRows; i++) {
      this.probabilityTable[i] = new Array(this.numCols)
    }

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        this.probabilityTable[i][j] = 1

        if (this.operator === '+' || this.operator === '-') {
          if (i === 0 || j === 0) {
            // one operator is 0 --> very easy
            this.probabilityTable[i][j] = 0.0625
          } else if (i === 1 || j === 1) {
            // one operator is 1 --> easy
            this.probabilityTable[i][j] = 0.125
          } else if (this.name === '5 + 5' && i + j > 10) {
            // limit to maximal result of 10
            this.probabilityTable[i][j] = 0
          } else if (this.name === '100 + 10' && Math.floor(i / 10) === Math.floor((i + j) / 10)) {
            // no crossing of ten-border --> easy
            this.probabilityTable[i][j] = 0.25
          } else if (this.name === '100 - 10') {
            if (i + j > 100) {
              // limit to maximal value of 100
              this.probabilityTable[i][j] = 0
            } else if (i + j < 10) {
              // 1st operator is below 10 --> very easy
              this.probabilityTable[i][j] = 0.0625
            } else if (i < 10) {
              // 2nd operator is below 10 --> easy
              this.probabilityTable[i][j] = 0.125
            } else if (Math.floor((i + j) / 10) * 10 === (i + j)) {
              // 1st operator is multiple of 10 --> easy
              this.probabilityTable[i][j] = 0.125
            } else if (Math.floor(i / 10) * 10 === i) {
              // 2nd operator is multiple of 10 --> easy
              this.probabilityTable[i][j] = 0.125
            } else if ((((i + j) - Math.floor((i + j) / 10) * 10) >= (i - Math.floor(i / 10) * 10))) {
              // no crossing of ten-border --> easy
              this.probabilityTable[i][j] = 0.5
            }
          }
        }

        if (this.operator === '*' || this.operator === '/') {
          if (i === 0 || j === 0) {
            if (this.operator === '/') {
              this.probabilityTable[i][j] = 0
            } else {
              this.probabilityTable[i][j] = 0.0625
            }
          } else if (i === 1 || j === 1) {
            this.probabilityTable[i][j] = 0.125
          } else if (i === 5 || j === 5 || i === 2 || j === 2 || i === 10 || j === 10) {
            this.probabilityTable[i][j] = 0.25
          }
        }
      }
    }
  }

  sum () {
    let sum = 0

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        sum = sum + this.probabilityTable[i][j]
      }
    }

    return sum
  }

  minMaxTable () {
    let minTable = Infinity
    let maxTable = 0

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        minTable = Math.min(minTable, this.probabilityTable[i][j])
        maxTable = Math.max(maxTable, this.probabilityTable[i][j])
      }
    }

    return { min: minTable, max: maxTable }
  }

  selectItem (position) {
    let sum = 0

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        sum = sum + this.probabilityTable[i][j]
        if (sum >= position) {
          return { i, j }
        }
      }
    }
  }

  randomTask () {
    const position = Math.floor(Math.random() * this.sum())

    const element = this.selectItem(position)

    switch (this.operator) {
      case '+':
        return new Task(this.operator, element.i, element.j, element.i, element.j, element.i + element.j)
      case '-':
        return new Task(this.operator, element.i, element.j, element.i + element.j, element.i, element.j)
      case '*':
        return new Task(this.operator, element.i, element.j, element.i, element.j, element.i * element.j)
      case '/':
        if (element.i === 0) {
          return this.randomTask()
        } else {
          return new Task(this.operator, element.i, element.j, element.i * element.j, element.i, element.j)
        }
      default:
        console.error('Undefined training operator ' + this.operator)
    }
  }

  correctAnswer (task) {
    this.probabilityTable[task.index1][task.index2] /= 2
    this.points.correctAnswer()
  }

  wrongAnswer (task) {
    this.probabilityTable[task.index1][task.index2] *= 2
    this.points.wrongAnswer()
  }

  getHtmlRepresentation () {
    const htmlTable = document.createElement('table')
    htmlTable.setAttribute('id', 'probabilityTable')

    for (let i = -1; i < this.numRows; i++) {
      const maxMinValue = this.minMaxTable()

      const tr = document.createElement('tr')
      htmlTable.appendChild(tr)

      for (let j = -1; j < this.numCols; j++) {
        if (i >= 0 && j >= 0) {
          const td = createElementWithText('td', '')
          td.setAttribute('title', this.probabilityTable[i][j])
          td.setAttribute('style', 'background-color:' + this.cellColor(maxMinValue, this.probabilityTable[i][j]))
          tr.appendChild(td)
        } else if (i === -1 && j >= 0) {
          tr.appendChild(createElementWithText('th', j))
        } else if (i >= 0 && j === -1) {
          tr.appendChild(createElementWithText('th', i))
        } else {
          tr.appendChild(createElementWithText('th', ''))
        }
      }
    }
    return htmlTable
  }

  cellColor (maxMinValue, value) {
    let partition
    if (value === 0) {
      return 'rgb(255, 255, 255)'
    }
    if (maxMinValue.max - maxMinValue.min === 0) {
      partition = '50'
    } else {
      partition = (value - maxMinValue.min) / (maxMinValue.max - maxMinValue.min) * 100
    }
    const color = 'rgb(' + partition + '% ' + (100 - partition) + '% 50%)'
    return color
  }
}

class Task {
  constructor (operator, index1, index2, number1, number2, answer) {
    console.assert(arguments.length === 6, 'Unexpected input parameters')
    this.operator = operator
    this.index1 = index1
    this.index2 = index2
    this.number1 = number1
    this.number2 = number2
    this.result = answer
  }

  taskText () {
    let operator = this.operator
    if (operator === '/') {
      operator = ':'
    }
    return this.number1 + ' ' + operator + ' ' + this.number2 + ' = '
  }

  taskTextWithAnswer () {
    return this.taskText() + this.result
  }
}

class Points {
  constructor (jsObject) {
    if (arguments.length === 0) {
      // empty object
      this.initEmptyInstance()
    } else if (arguments.length === 1 && typeof jsObject === 'object') {
      this.counterRight = jsObject.counterRight
      this.counterWrong = jsObject.counterWrong
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.counterRight = 0
    this.counterWrong = 0
  }

  correctAnswer () {
    this.counterRight = this.counterRight + 1
  }

  wrongAnswer () {
    this.counterWrong = this.counterWrong + 1
  }

  getHtmlRepresentation () {
    // TODO: optimize logic to new game principle and relevance of points vs challenge
    // TODO: getHtmlRepresentation logic
    const divPoints = document.createElement('div')
    const countTotal = this.counterRight + this.counterWrong

    const divTotal = createElementWithText('div', '🟰 ' + countTotal + ' (✔️' + this.counterRight + ' ❌' + this.counterWrong + ') ')
    divPoints.appendChild(divTotal)

    const threshold3 = 100
    const threshold2 = 10
    const threshold1 = 1

    const won3 = Math.max(0, Math.floor(countTotal / threshold3))
    const won2 = Math.max(0, Math.floor((countTotal - threshold3 * won3) / threshold2))
    const won1 = Math.max(0, Math.floor((countTotal - threshold3 * won3 - threshold2 * won2) / threshold1))

    appendRepeatedIcons(divPoints, won1, '😋')
    appendRepeatedIcons(divPoints, won2, '🏅')
    appendRepeatedIcons(divPoints, won3, '🏆')

    function appendRepeatedIcons (parentDiv, count, icon) {
      let textContent = ''
      for (let i = 1; i <= count; i++) {
        textContent += icon
      }
      const divChild = createElementWithText('div', textContent)
      parentDiv.appendChild(divChild)
    }

    return divPoints
  }
}

class Challenge {
  constructor (collectionItem) {
    if (arguments.length === 0) {
      // empty object and new created
      this.initEmptyInstance()
    } else if (arguments.length === 1) {
      // initiate new instance with collectionItem
      this.initEmptyInstance()
      this.challengeStart(collectionItem)
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.answerLimit = null
    this.timeLimit = null
    this.answersDone = null
    this.collectionItem = null
    this.startTime = null
    this.windowIntervalCallback = null
  }

  challengeStart (collectionItem) {
    this.answerLimit = Level.answerLimit[collectionItem.level]
    this.timeLimit = Level.timeLimit[collectionItem.level]
    this.answersDone = 0
    this.collectionItem = collectionItem
    this.startTime = performance.now()
    this.windowIntervalCallback = window.setInterval(this.updateCountdown.bind(this), 1000)

    this.updateCountdown()
    this.updateAnswersCounter()
  }

  correctAnswer () {
    this.answersDone += 1

    this.updateAnswersCounter()

    if (this.answersDone >= this.answerLimit) {
      this.challengeWon()
      return true
    } else {
      return false
    }
  }

  challengeWon () {
    if (this.collectionItem) {
      this.collectionItem.itemWon()
    }
    this.challengeStop()
  }

  challengeLost () {
    this.challengeStop()

    challengeLostAnimation()

    // restart same challenge again
    this.challengeStart(this.collectionItem)
  }

  challengeStop () {
    if (this.windowIntervalCallback) {
      window.clearInterval(this.windowIntervalCallback)
      this.windowIntervalCallback = null
    }
  }

  updateCountdown () {
    const timeElapsed = performance.now() - this.startTime
    const percentElapsed = 100 * timeElapsed / (this.timeLimit * 1000)
    document.querySelector('#countdown').style.setProperty('--progress', percentElapsed)
    if (percentElapsed >= 100) {
      this.challengeLost()
    }
  }

  updateAnswersCounter () {
    const percentAnswered = 100 * (this.answersDone / this.answerLimit)
    document.querySelector('#answersCounter').style.setProperty('--progress', percentAnswered)
  }
}

class Collection {
  constructor (jsObject) {
    if (arguments.length === 0) {
      // empty object, new instance
      this.initEmptyInstance()
    } else if (arguments.length === 1 && typeof jsObject === 'object') {
      // jsObject is JSON, Initialize object with data from JSON jsObject
      this.itemList = Array => new Array()
      for (let i = 0; i < jsObject.itemList.length; i++) {
        this.itemList.push(new CollectionItem(jsObject.itemList[i]))
      }
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.itemList = new Array(0)
    for (let i = 0; i < CollectionIcons.mammals.length; i++) {
      const level = Math.floor(i / 10)
      this.itemList.push(new CollectionItem(CollectionIcons.mammals[i], level))
    }
  }

  getHtmlRepresentation (htmlTable) {
    const collectionDiv = document.createElement('div')
    collectionDiv.setAttribute('id', 'collection')

    const divItems = Array => new Array()
    for (let level = 0; level <= Level.max; level++) {
      const divLevel = document.createElement('div')
      const divLevelInfo = createElementWithText('div', Level.symbol[level] + ' ' + Level.answerLimit[level] + '✔ ' + Level.timeLimit[level] + ' s')
      divLevelInfo.setAttribute('class', 'levelInfo')
      divItems[level] = document.createElement('div')
      divLevel.appendChild(divLevelInfo)
      divLevel.appendChild(divItems[level])
      collectionDiv.appendChild(divLevel)
    }

    for (let i = 0; i < this.itemList.length; i++) {
      divItems[this.itemList[i].level].appendChild(this.itemList[i].getHtmlRepresentation(i))
    }

    return collectionDiv
  }
}

class CollectionItem {
  constructor (jsObject, level) {
    if (arguments.length === 0) {
      // empty object
      this.initEmptyInstance()
    } else if (arguments.length === 2 && typeof jsObject === 'string' && typeof level === 'number') {
      // new created object, input is icon and level
      this.initEmptyInstance()
      this.icon = jsObject
      this.level = level
    } else if (arguments.length === 1 && typeof jsObject === 'object') {
      this.icon = jsObject.icon
      this.won = jsObject.won
      this.level = jsObject.level
    } else {
      console.error(false, 'Unexpected input parameters')
    }
  }

  initEmptyInstance () {
    this.icon = null
    this.won = 0
    this.level = null
  }

  itemWon () {
    this.won += 1
  }

  getHtmlRepresentation (collectionItemIndex) {
    const div = createElementWithText('div', this.icon)

    if (this.won >= 1) {
      div.setAttribute('class', 'collectionItem won')
      if (this.won > 1) {
        const divWon = createElementWithText('div', this.won)
        div.appendChild(divWon)
        divWon.setAttribute('class', 'wonCount')
      }
    } else {
      div.setAttribute('class', 'collectionItem open')
    }

    div.addEventListener('click', function () { collectionItemSelected(this) }.bind(this))

    return div
  }
}

class Level {
}
Object.defineProperty(Level, 'answerLimit', {
  value: [5, 10, 15, 20, 25, 30, 35, 40],
  writable: false,
  enumerable: true,
  configurable: false
})
Object.defineProperty(Level, 'timeLimit', {
  value: [5 * 60, 10 * 40, 15 * 30, 20 * 20, 25 * 15, 30 * 10, 35 * 7, 40 * 5],
  writable: false,
  enumerable: true,
  configurable: false
})
Object.defineProperty(Level, 'symbol', {
  value: ['🧸', '👶', '👧', '🤔', '💪', '🏋️', '💡', '🧠'],
  writable: false,
  enumerable: true,
  configurable: false
})
Object.defineProperty(Level, 'max', {
  value: 7,
  writable: false,
  enumerable: true,
  configurable: false
})

const userManagement = new UserManagement()

let task = null
let challenge = null

function askTask () {
  clearForm()

  task = userManagement.user.training.randomTask()

  document.querySelector('#task').textContent = task.taskText()
}

function checkAnswer () {
  const answer = document.querySelector('#answer').value

  if (typeof answer !== 'string' || answer.length === 0) {
    // do not consider as answer
    return
  }

  // check for cheat code to modify right/wrong counters
  const matches = answer.match(/^###(\d+)#(\d+)###$/)
  if (matches) {
    userManagement.user.training.points.counterRight = parseInt(matches[1])
    userManagement.user.training.points.counterWrong = parseInt(matches[2])
    updateGuiPlay(false)
    return
  }
  if (answer === '###0000###') {
    userManagement.user.training.initProbabilityTableTable()
    updateGuiPlay(false)
    return
  }

  let taskText = task.taskTextWithAnswer()

  let ratingClass = ''
  let timeout = 0
  let challengeWon = false
  if (parseInt(answer) === task.result) {
    ratingClass = 'correct'
    userManagement.user.training.correctAnswer(task)
    taskText = taskText + ' ✔'
    document.querySelector('#playContent').setAttribute('class', 'correct')
    timeout = 1000

    challengeWon = challenge.correctAnswer(task)
  } else {
    ratingClass = 'wrong'
    userManagement.user.training.wrongAnswer(task)
    taskText = taskText + ' ❌'
    document.querySelector('#playContent').setAttribute('class', 'wrong')
    timeout = 3000
  }

  document.querySelector('#task').textContent = taskText
  document.querySelector('#rating').setAttribute('class', ratingClass)
  updateGuiPlay(false)

  userManagement.save()

  if (challengeWon) {
    challengeEndAnimation(false)
  } else {
    window.setTimeout(askTask, timeout)
  }
}

function challengeLostAnimation () {
  document.querySelector('#collectionIcon').textContent = '❌'
  challengeEndAnimation(true)
}

function challengeEndAnimation (retry) {
  document.querySelector('#collectionIcon').classList.add('challengeEnd')
  window.setTimeout(function () {
    document.querySelector('#collectionIcon').classList.remove('challengeEnd')
    updateGuiPlay(false)
    if (!retry) {
      toggleContent('#collection')
    }
  }, 3000)
}

const removeChildren = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild)
  }
}

function showProbabilityTable () {
  const divStatistics = document.querySelector('#statistic')
  removeChildren(divStatistics)
  divStatistics.appendChild(userManagement.user.training.getHtmlRepresentation())
}

function createElementWithText (nodeType, text) {
  const node = document.createElement(nodeType)
  const textNode = document.createTextNode(text)
  node.appendChild(textNode)

  return node
}

function showCollection () {
  const divCollectionList = document.querySelector('#collectionList')
  removeChildren(divCollectionList)
  divCollectionList.appendChild(userManagement.user.training.collection.getHtmlRepresentation())
}

function clearForm () {
  document.querySelector('#task').textContent = ''
  document.querySelector('#answer').value = ''
  document.querySelector('#answer').focus()
  document.querySelector('#playContent').setAttribute('class', 'normal')
}

function setSelectionLists () {
  setSelectionGeneric('#training', userManagement.user.trainingNameList(), userManagement.user.training.name, changeTraining)
  setSelectionGeneric('#user', userManagement.userNameList(), userManagement.user.userName, changeUser)
}

function setSelectionGeneric (htmlId, list, preselected, eventListener) {
  const select = document.querySelector(htmlId)
  removeChildren(select)

  for (let i = 0; i < list.length; i++) {
    const option = createElementWithText('option', list[i])
    option.setAttribute('value', list[i])
    if (list[i] === preselected) {
      option.setAttribute('selected', 'selected')
    }

    select.appendChild(option)
  }
  select.addEventListener('change', eventListener)
}

function changeTraining () {
  const select = document.querySelector('#training')
  userManagement.user.setActiveTrainingByName(select.selectedOptions[0].value)
  userManagement.save()
  updateGuiCollection()
}

function changeUser () {
  const select = document.querySelector('#user')
  userManagement.setActiveUserByName(select.selectedOptions[0].value)
  userManagement.save()
  updateGuiCollection()
}

function addUser () {
  const newName = window.prompt('Name', 'Harry')
  if (newName != null && typeof newName === 'string' && newName.length > 1) {
    userManagement.addUser(newName)
  }
  userManagement.save()
  updateGuiCollection()
}

function deleteUser () {
  const password = window.prompt('Confirm super password', '***')
  if (password === '###') {
    userManagement.removeUser()
  }
  userManagement.save()
  updateGuiCollection()
}

function collectionItemSelected (collectionItem) {
  challenge = new Challenge(collectionItem)
  toggleContent('#play', true)
}

function toggleContent (idToShow, withNewTask) {
  const htmlDivIds = ['#play', '#collection', '#stats']

  if (document.querySelector(idToShow).style.display !== 'none') {
    // already shown; show play-div
    idToShow = '#play'
  }

  for (let i = 0; i < htmlDivIds.length; i++) {
    if (htmlDivIds[i] === idToShow) {
      document.querySelector(htmlDivIds[i]).style.display = 'block'
    } else {
      document.querySelector(htmlDivIds[i]).style.display = 'none'
    }
  }

  if (idToShow === '#stats') {
    updateGuiStatistics()
  } else if (idToShow === '#collection') {
    updateGuiCollection()
  } else if (idToShow === '#play') {
    updateGuiPlay(withNewTask)
  }
}

function updateGuiHeader () {
  document.querySelector('#configuration').textContent = userManagement.user.userName + ' | ' +
    userManagement.user.training.name + ' | ✔️' + userManagement.user.training.points.counterRight
}

function updateGuiCollection () {
  setSelectionLists()
  updateGuiHeader()
  showCollection()
}

function updateGuiStatistics () {
  updateGuiHeader()
  const divPoints = document.querySelector('#points')
  removeChildren(divPoints)
  divPoints.appendChild(userManagement.user.training.points.getHtmlRepresentation())

  showProbabilityTable()
}

function updateGuiPlay (withNewTask) {
  updateGuiHeader()

  document.querySelector('#answer').focus()

  if (challenge && challenge.collectionItem) {
    document.querySelector('#collectionIcon').textContent = challenge.collectionItem.icon
  }

  if (withNewTask) {
    askTask()
  }
}

function initPage () {
  registerServiceWorker()

  document.querySelector('#sendAnswer').addEventListener('click', checkAnswer)

  document.querySelector('#togglePlay').addEventListener('click', function () { toggleContent('#play') })
  document.querySelector('#toggleCollection').addEventListener('click', function () { toggleContent('#collection') })
  document.querySelector('#toggleStats').addEventListener('click', function () { toggleContent('#stats') })
  document.querySelector('#newUser').addEventListener('click', addUser)
  document.querySelector('#deleteUser').addEventListener('click', deleteUser)

  userManagement.load()
  setSelectionLists()
  updateGuiCollection()
  updateGuiStatistics()
  updateGuiPlay(true)
  toggleContent('#collection')
  toggleContent('#collection')

  // TODO remove:
  userManagement.save()
}
window.addEventListener('load', initPage)

// Registers a service worker
async function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('serviceworker.js')
    } catch (error) {
      console.error('Error while registering: ' + error.message)
    }
  } else {
    console.error('Service workers API not available')
  }
}
