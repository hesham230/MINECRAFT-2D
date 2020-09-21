const tools = document.querySelectorAll(".tool");
const menu = document.querySelector(".menu");
const startBtn = document.querySelector(".start");
const table = document.querySelector(".game-area");
const lastElement = document.querySelector(".data-type");

const state = {
  gameStart: false,
  worldMatrix: [],
  selectedTool: -1,
  lastTile: -1,
};

const startGame = () => {
  menu.style.display = "none";
};
const createWorld = (matrix, tileHandler) => {
  for (let i = 0; i < matrix.length; i++) {
    const line = document.createElement("div");
    line.classList.add("row");

    for (let j = 0; j < matrix[i].length; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      for (const [key, value] of Object.entries(matrix[i][j])) {
        tile.dataset[key] = value;
      }
      tile.addEventListener("click", tileHandler);
      line.appendChild(tile);
    }

    table.appendChild(line);
  }
};

const createMatrix = (row, col) => {
  let mat = [];
  for (let i = 0; i < row; i++) {
    const r = [];
    for (let j = 0; j < col; j++) {
      r.push({});
    }
    mat.push(r);
  }

  const dirt = row - parseInt(Math.floor(Math.random() * 4) * 0.1 * row);

  for (let i = row - 1; i >= 0; i--) {
    for (let j = 0; j < col; j++) {
      const tile = {};
      tile.col = j;
      tile.row = i;
      if (i >= dirt) {
        tile.type = 0;
      } else if (i === dirt - 1) {
        tile.type = 1;
      } else if (i === dirt - 2) {
        if (j >= col - 2) {
          mat[i][j] = {
            type: -1,
            col: j,
            row: i,
          };
          mat[i - 1][j] = {
            type: -1,
            col: j,
            row: i - 1,
          };
          mat[i - 2][j] = {
            type: -1,
            col: j,
            row: i - 2,
          };
        } else {
          const rand = random();
          mat[i - 2][j] = {
            type: rand[0],
            col: j,
            row: i - 2,
          };
          mat[i - 2][j + 1] = {
            type: rand[1],
            col: j + 1,
            row: i - 2,
          };
          mat[i - 2][j + 2] = {
            type: rand[2],
            col: j + 2,
            row: i - 2,
          };
          mat[i - 1][j] = {
            type: rand[3],
            col: j,
            row: i - 1,
          };
          mat[i - 1][j + 1] = {
            type: rand[4],
            col: j + 1,
            row: i - 1,
          };
          mat[i - 1][j + 2] = {
            type: rand[5],
            col: j + 2,
            row: i - 1,
          };
          mat[i][j] = {
            type: rand[6],
            col: j,
            row: i,
          };
          mat[i][j + 1] = {
            type: rand[7],
            col: j + 1,
            row: i,
          };
          mat[i][j + 2] = {
            type: rand[8],
            col: j + 2,
            row: i,
          };
          j += 2;
        }
        continue;
      } else {
        tile.type = -1;
      }
      mat[i][j] = tile;
    }

    if (i === dirt - 2) {
      i -= 2;
    }
  }
  console.log(mat);
  return mat;
};

random = () => {
  const type = Math.floor(Math.random() * 6);

  switch (type) {
    case 0:
      return [2, 2, 2, 2, 2, 2, -1, 3, -1];
    case 1:
      return [-1, -1, -1, -1, -1, -1, 4, 4, -1];
    case 2:
      return [-1, -1, -1, -1, 2, -1, 2, 2, 2];

    case 3:
      return [-1, 2, -1, -1, 3, 4, -1, 3, 4];
    case 4:
      return [-1, -1, -1, 4, 4, 4, 4, 4, 4];

    default:
      return [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  }
};

const updateLastMindedTIle = (type) => {
  state.lastTile = type;
  lastElement.dataset.type = type;
};
const validTool = (type, selectedTool) => {
  switch (selectedTool) {
    case 0:
      if (type == 4) return true;
      break;
    case 1:
      if (type == 0 || type == 1) return true;
      break;
    case 2:
      if (type == 2 || type == 3) return true;
      break;
    default:
      console.error("invalid tool number");
      break;
  }

  return false;
};

const toolwarning = () => {
  tools.forEach((t) => {
    t.classList.add("warning");
    setTimeout(removeAllWarning, 1000);
  });
};

const removeAllWarning = () => {
  tools.forEach((t) => {
    t.classList.remove("warning");
  });
};

const resetSelectedTools = () => {
  tools.forEach((t) => {
    t.classList.remove("active");
  });
};

const onStartGameClickHandler = (e) => {
  menu.style.display = "none";
  table.style.display = "block";

  state.worldMatrix = createMatrix(12, 16);
  createWorld(state.worldMatrix, tileOnClickHandler);
};

const toolOnClickHandler = (e) => {
  const tool = e.currentTarget;
  const toolType = parseInt(tool.dataset.tool);
  if (isNaN(toolType)) {
    console.error("invalid tool type");
    return;
  }
  resetSelectedTools();
  tool.classList.add("active");
  state.selectedTool = toolType;
};

const tileOnClickHandler = (e) => {
  console.log(e.currentTarget.dataset.type);
  const tile = e.currentTarget;
  let type = parseInt(tile.dataset.type);

  if (isNaN(type)) {
    console.error("invalid type");
    return;
  }

  if (type >= 0) {
    if (!validTool(type, state.selectedTool)) {
      console.error("invalid tool");
      toolwarning();
      return;
    }

    tileStateObject = state.worldMatrix[tile.dataset.row][tile.dataset.col];
    if (!tileStateObject) {
      return;
    }
    tileStateObject.type = -1;
    tile.dataset.type = -1;
    updateLastMindedTIle(type);
  } else if (type == -1) {
    if (state.lastTile >= 0) {
      tile.dataset.type = state.lastTile;
      state.lastTile = -1;
      lastElement.dataset.type = -1;
    }
  }
};

const addEventsToTools = (toolOnClickHandler) => {
  tools.forEach((tool) => {
    tool.addEventListener("click", toolOnClickHandler);
  });
};

table.style.display = "none";
addEventsToTools(toolOnClickHandler);
startBtn.addEventListener("click", onStartGameClickHandler);
