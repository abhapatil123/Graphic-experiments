let cols = 90;
let rows = 90;
let colWidths = [];
let rowHeights = [];
let cellColors = []; // Array to store the colors of each cell
let cellShapes = []; // Array to store the shape of each cell
let dragCol = -1;
let dragRow = -1;
let offsetX = 0;
let offsetY = 0;
let dragging = false; // Flag to indicate if dragging is happening
let selectedColor;
let drawShape = 'rect'; // Variable to store the current shape

function setup() {
  createCanvas(1500, 700);
  // Initialize column widths and row heights
  for (let i = 0; i < cols; i++) {
    colWidths[i] = 10000 / cols;
  }
  for (let j = 0; j < rows; j++) {
    rowHeights[j] = 3000 / rows;
  }

  // Initialize cell colors to white and shapes to rectangle
  for (let i = 0; i < cols; i++) {
    cellColors[i] = [];
    cellShapes[i] = [];
    for (let j = 0; j < rows; j++) {
      if (j == 0 || i == 0) {
        cellColors[i][j] = color(33, 115, 70); // Green color for the first row and first column
        cellShapes[i][j] = 'rect'; // Default shape
      } else {
        cellColors[i][j] = color(255);
        cellShapes[i][j] = 'rect'; // Default shape
      }
    }
  }

  // Set default selected color
  selectedColor = color(0); // Default to black

  // Create buttons for shapes
  let roundBtn = createButton('Round');
  roundBtn.position(10, height + 10);
  roundBtn.mousePressed(() => drawShape = 'circle');

  let triangleBtn = createButton('Triangle');
  triangleBtn.position(70, height + 10);
  triangleBtn.mousePressed(() => drawShape = 'triangle');

  let fillBtn = createButton('Fill');
  fillBtn.position(140, height + 10);
  fillBtn.mousePressed(() => drawShape = 'rect');

  // Create color swatches
  createSwatch(color(0, 0, 0), 10, height + 50); // Black
  createSwatch(color(78, 78, 78), 40, height + 50); // Dark Grey
  createSwatch(color(150, 150, 150), 70, height + 50); // Grey
  createSwatch(color(230, 230, 230), 100, height + 50); // Light Grey

  // Add event listener to the download button
  let downloadBtn = select('#downloadBtn');
  downloadBtn.mousePressed(downloadCanvas);
}

function draw() {
  background(255);
  drawGrid();
}

function drawGrid() {
  let x = 0;
  let y = 0;

  textAlign(CENTER, CENTER);
  textSize(16);
  strokeWeight(0.5);

  // Draw columns
  for (let i = 0; i <= cols; i++) {
    if (i < cols) {
      x += colWidths[i];
      // Draw column labels (A-Z, AA-AZ, BA-BZ, etc.) excluding the first null column
      if (i > 0) {
        text(getColumnName(i), x - colWidths[i] / 2, rowHeights[0] / 2);
      }
    }
    line(x, 0, x, height);
  }

  // Draw rows
  for (let j = 0; j <= rows; j++) {
    if (j < rows) {
      y += rowHeights[j];
      // Draw row labels (1-18) excluding the first null row
      if (j > 0) {
        text(j, colWidths[0] / 2, y - rowHeights[j] / 2);
      }
    }
    line(0, y, width, y);
  }

  // Draw cells with their respective colors and shapes
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      fill(cellColors[i][j]);
      if (cellShapes[i][j] === 'circle') {
        ellipse(x + colWidths[i] / 2, y + rowHeights[j] / 2, colWidths[i], rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleTopLeft') {
        triangle(x, y, x + colWidths[i], y, x, y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleTopRight') {
        triangle(x + colWidths[i], y, x, y, x + colWidths[i], y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleBottomRight') {
        triangle(x + colWidths[i], y + rowHeights[j], x + colWidths[i], y, x, y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleBottomLeft') {
        triangle(x, y + rowHeights[j], x + colWidths[i], y + rowHeights[j], x, y);
      } else {
        rect(x, y, colWidths[i], rowHeights[j]);
      }
      // Draw column labels in the first row
      if (j == 0 && i > 0) { // Skip the first cell (i = 0)
        fill(255); // Text color white
        text(getColumnName(i), x + colWidths[i] / 2, y + rowHeights[j] / 2);
      }
      // Draw row labels in the first column
      if (i == 0 && j > 0) { // Skip the first cell (j = 0)
        fill(255); // Text color white
        text(j, x + colWidths[i] / 2, y + rowHeights[j] / 2);
      }
      y += rowHeights[j];
    }
    x += colWidths[i];
  }
}

function mousePressed() {
  let x = 0;
  let y = 0;

  // Check for column drag (only in the first row) and exclude the null column
  if (mouseY < rowHeights[0] && mouseX > colWidths[0]) {
    for (let i = 1; i < cols; i++) { // Start from 1 to exclude the null column
      x += colWidths[i - 1];
      if (mouseX > x - 5 && mouseX < x + 5) {
        dragCol = i;
        offsetX = mouseX - x;
        dragging = true;
        return;
      }
    }
  }

  // Check for row drag (only in the first column) and exclude the null row
  if (mouseX < colWidths[0] && mouseY > rowHeights[0]) {
    for (let j = 1; j < rows; j++) { // Start from 1 to exclude the null row
      y += rowHeights[j - 1];
      if (mouseY > y - 5 && mouseY < y + 5) {
        dragRow = j;
        offsetY = mouseY - y;
        dragging = true;
        return;
      }
    }
  }

  // Check for cell click to change color and shape
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      // Skip the cells in the first row and first column
      if (i == 0 || j == 0) {
        y += rowHeights[j];
        continue;
      }
      if (mouseX > x && mouseX < x + colWidths[i] && mouseY > y && mouseY < y + rowHeights[j]) {
        if (cellShapes[i][j] === 'triangleTopLeft') {
          cellShapes[i][j] = 'triangleTopRight';
        } else if (cellShapes[i][j] === 'triangleTopRight') {
          cellShapes[i][j] = 'triangleBottomRight';
        } else if (cellShapes[i][j] === 'triangleBottomRight') {
          cellShapes[i][j] = 'triangleBottomLeft';
        } else if (cellShapes[i][j] === 'triangleBottomLeft') {
          cellColors[i][j] = color(255); // Toggle to white
          cellShapes[i][j] = 'rect'; // Toggle to rectangle
        } else {
          cellColors[i][j] = selectedColor;
          cellShapes[i][j] = drawShape === 'triangle' ? 'triangleTopLeft' : drawShape;
        }
        return; // Exit after finding the cell
      }
      y += rowHeights[j];
    }
    x += colWidths[i];
  }
}

function mouseDragged() {
  // Set dragging flag to true if mouse is moved while pressed
  dragging = true;

  // Resize columns
  if (dragCol > 0) { // Prevent resizing the null column
    let xOffset = mouseX - offsetX;
    let newWidth = xOffset - sumArray(colWidths, dragCol - 1);
    colWidths[dragCol - 1] = max(newWidth, 20); // Minimum column width
  }

  // Resize rows
  if (dragRow > 0) { // Prevent resizing the null row
    let yOffset = mouseY - offsetY;
    let newHeight = yOffset - sumArray(rowHeights, dragRow - 1);
    rowHeights[dragRow - 1] = max(newHeight, 20); // Minimum row height
  }
}

function mouseReleased() {
  dragCol = -1;
  dragRow = -1;
  dragging = false;
}

function createSwatch(col, x, y) {
  let swatch = createDiv('');
  swatch.style('width', '30px');
  swatch.style('height', '30px');
  swatch.style('background-color', col);
  swatch.position(x, y);
  swatch.mousePressed(() => selectedColor = col);
}

function downloadCanvas() {
  saveCanvas('myCanvas', 'jpg');
}

function sumArray(arr, end) {
  let sum = 0;
  for (let i = 0; i < end; i++) {
    sum += arr[i];
  }
  return sum;
}

function getColumnName(index) {
  let name = '';
  while (index > 0) {
    index--;
    name = String.fromCharCode(65 + (index % 26)) + name;
    index = Math.floor(index / 26);
  }
  return name;
}
