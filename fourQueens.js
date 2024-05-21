class Node {
  constructor(s, c) {
    this.state = s;
    this.cost = c;
  }
  getState() {
    return this.state;
  }
  getCost() {
    return this.cost;
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    this.queue.push({ element, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.queue.shift();
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.queue[0].element;
  }

  printNode() {
    this.queue.forEach((item) => {
      console.log(item.element.state);
    });
  }
  isEmpty() {
    return this.queue.length === 0;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//initial state
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const cost = 1;
let frontier = new PriorityQueue();

const initialNode = new Node(board, 0);
frontier.enqueue(initialNode, 0);

//heuristic function
function getConflicts(state, row, col) {
  let nbOfConflict = 0;
  for (let i = 0; i < state.length; i++) {
    let di = Math.abs(row - i);
    if (state[i][col] == 1 && i != row) {
      nbOfConflict += 3;
    }
    if (state[row][i] == 1 && i != col) {
      nbOfConflict += 3;
    }

    for (let j = 0; j < state[0].length; j++) {
      if (j === col) continue;
      dj = Math.abs(col - j);
      if (di == dj) {
        if (state[i][j] == 1) {
          if (di > 2) nbOfConflict++;
          else nbOfConflict += 2;
        }
      }
    }
  }
  return nbOfConflict;
}

function isGoalState(state) {
  let counter = 0;
  let hasNoConflict = true;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (state[i][j] == 1) {
        counter++;
        if (getConflicts(state, i, j) != 0) {
          hasNoConflict = false;
        }
      }
    }
  }
  if (counter == 4) return hasNoConflict;
}

function newState(currentNode, i, j) {
  const newState = currentNode.getState().map((row) => row.map((col) => col));
  if (newState[i][j] != 1) {
    newState[i][j] = 1;
    let hx = getConflicts(newState, i, j);
    let gx = currentNode.getCost() + cost;
    newNode = new Node(newState, gx);
    frontier.enqueue(newNode, hx + gx);
  }
}

const rows = document.getElementsByClassName("container")[0].children;

function updateScreen(currentNode) {
  let state = currentNode.state;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (state[i][j] == 1) rows[j].children[i].innerHTML = "♛";
      else rows[j].children[i].innerHTML = "";
    }
  }
}
const stateNb = document.getElementsByClassName("stateNb")[0];

let counter = 0;
let stop = true;
async function loop() {
  while (!isGoalState(frontier.front().state)) {
    if (stop) return false;
    let currentNode = frontier.dequeue().element;
    updateScreen(currentNode);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        newState(currentNode, i, j);

        stateNb.innerHTML = counter;
      }
    }
    counter++;
    await delay(10);
  }
  updateScreen(frontier.front());
  return true;
}
function reset() {
  counter = 0;
  frontier = new PriorityQueue();
  frontier.enqueue(initialNode, 0);
  updateScreen(initialNode);
}

const startBtn = document.getElementsByClassName("start-btn")[0];
let isFininshed = false;
startBtn.addEventListener("click", async () => {
  if (startBtn.innerHTML == "Start") {
    if (isFininshed) {
      reset();
      stop = true;
      startBtn.innerHTML = "Start";
    }
    stop = false;
    startBtn.innerHTML = "Stop";
    isFininshed = await loop();
    startBtn.innerHTML = "Start";
    console.log(isFininshed);
  } else {
    stop = true;
    startBtn.innerHTML = "Start";
  }
});
const resetBtn = document.getElementsByClassName("reset-btn")[0];
resetBtn.addEventListener("click", () => {
  reset();
  stop = true;
  startBtn.innerHTML = "Start";
});
console.log("done");
