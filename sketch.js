
let gPict;

const CELL_SIZE = 10;

const ROWS = 56;
const COLUMNS = 72;



function preload() {
  gPict = loadImage('images/testPict01.png');
}  


function setup() {
  createCanvas(gPict.width, gPict.height);

  stroke( "#BAAFA7" );
  for(let j = 0; j < height; j += CELL_SIZE){
    for(let i = 0; i < width; i += CELL_SIZE){
      rect(i, j, CELL_SIZE, CELL_SIZE);
    }
  }



  // image(gPict, 0, 0);
  gPict.filter(GRAY);

  noStroke();
  noFill();
  for(let j = 0; j < height; j += CELL_SIZE){
    for(let i = 0; i < width; i += CELL_SIZE){
      const color = gPict.get(i, j);
      const grayScaleColor = color[0];
      //  console.log(c);
      
      // fill(51 * getLineLevel(c[0]));
      // fill(c);
      stroke('#202020');
      if( getLineLevel(grayScaleColor) === 1 ){
        line(i, j,  i+CELL_SIZE, j);
        line(i, j+CELL_SIZE,  i+CELL_SIZE, j+CELL_SIZE);
      }else if( getLineLevel(grayScaleColor) === 2 ){
        rect(i, j, CELL_SIZE, CELL_SIZE);   
      }else if( getLineLevel(grayScaleColor) === 3 ){
        rect(i, j, CELL_SIZE, CELL_SIZE);
        line(i, j,  i+CELL_SIZE, j+CELL_SIZE);
      }else if( getLineLevel(grayScaleColor) === 4 ){
        rect(i, j, CELL_SIZE, CELL_SIZE);
        line(i, j,  i+CELL_SIZE, j+CELL_SIZE);
        line(i+CELL_SIZE, j,  i, j+CELL_SIZE);
      }
    }
 }


  stroke( 'black' );
  strokeWeight(2.2);
  line(0, height/4, width, height/4);
  line(0, height/2, width, height/2);
  line(0, 3 * height/4, width, 3 * height/4);

  line(width/4, 0, width/4, height);
  line(width/2, 0, width/2, height);
  line(3 * width/4, 0, 3 * width/4, height);

}

const getLineLevel = ( grayScaleValue ) => {

  const LINE_LEVELS = 5;

  // line level ranges from 0 to 4.
  const lineLevel = 4 - Math.floor( (grayScaleValue / 256) * LINE_LEVELS );

  // console.log(grayScaleValue, lineLevel);
  return lineLevel;

}

