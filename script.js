let cols = 90;
let rows = 90;
let colWidths = [];
let rowHeights = [];
let cellColors = []; // Array to store the colors of each cell
let dragCol = -1;
let dragRow = -1;
let offsetX = 0;
let offsetY = 0;
let dragging = false; // Flag to indicate if dragging is happening

function setup() {
  createCanvas(1500, 700);
  // Initialize column widths and row heights
  for (let i = 0; i < cols; i++) {
    colWidths[i] = 10000 / cols;
  }
  for (let j = 0; j < rows; j++) {
    rowHeights[j] = 3000 / rows;
  }

  // Initialize cell colors to white, first row and first column (except the first cell) to green
  for (let i = 0; i < cols; i++) {
    cellColors[i] = [];
    for (let j = 0; j < rows; j++) {
      if (j == 0 || i == 0) {
        cellColors[i][j] = color(33, 115, 70); // Green color for the first row and first column
      } else {
        cellColors[i][j] = color(255);
      }
    }
  }

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

  // Draw cells with their respective colors
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      fill(cellColors[i][j]);
      rect(x, y, colWidths[i], rowHeights[j]);
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

  // Check for column drag (only in the first row)
  if (mouseY < rowHeights[0]) {
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

  // Check for row drag (only in the first column)
  if (mouseX < colWidths[0]) {
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

  // Check for cell click to change color
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
        // Toggle cell color between black and white
        let currentColor = cellColors[i][j];
        if (red(currentColor) === 0 && green(currentColor) === 0 && blue(currentColor) === 0) {
          cellColors[i][j] = color(255);
        } else {
          cellColors[i][j] = color(0);
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
  if (dragCol != -1) {
    let xOffset = mouseX - offsetX;
    let newWidth = xOffset - sumArray(colWidths, dragCol - 1);
    colWidths[dragCol - 1] = max(newWidth, 20); // Minimum column width
  }

  // Resize rows
  if (dragRow != -1) {
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

function downloadCanvas() {
  saveCanvas('canvas', 'jpg');
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
