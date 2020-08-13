
let gPict;
let c;

const ROWS = 56;
const COLUMNS = 72;
const CELL_SIZE = 10;
const LINE_LEVELS = 5;

function preload() {
  gPict = loadImage('images/testPict01.png');
}

function setup() {
  createCanvas(COLUMNS * CELL_SIZE, ROWS * CELL_SIZE);
  image(gPict, 0, 0);


  
  gPict.filter(GRAY);

  noStroke();
  for(let j = 0; j < height; j += CELL_SIZE){
    for(let i = 0; i < width; i += CELL_SIZE){
      c = gPict.get(i, j);
      //  console.log(c);
      
      fill(50 * getLineLevel(c[0]));
      // fill(c);
      rect(i, j, CELL_SIZE, CELL_SIZE);
    }
 }
  //image(gPict, width/2, 0);
}

const getLineLevel = ( grayScaleValue ) => {

  const lineLevel = Math.floor( (grayScaleValue / 255) * LINE_LEVELS );

  // console.log(grayScaleValue, lineLevel);
  return lineLevel;

}

// function draw() {
//   background(220);
// }