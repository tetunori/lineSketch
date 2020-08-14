
// Image object
let gImg = undefined;
let gToggleGrid = true;
let gToggleQuarterLine = true;

// Cell unit size(pixel)
const CELL_SIZE = 10;

// Line level ranges from 0 to 4.
const LINE_LEVEL_MAX = 4;

// For controller
let gFileSelector;
let gBtToggleGrid = undefined;
let gBtToggleQuarterLine = undefined;
let gBtSave = undefined;

function setup() {


  // Prepare canvas
  const canvas = createCanvas( 800, 800 )
    .dragOver( ( evt ) => {
      background( 'black' );
    } )
    .dragLeave( () => {
      if( gImg === undefined ){
          drawDropCanvas();
      }else{
        drawLineSketch();
      }
    } );

  // drow illustration.
  drawDropCanvas();

  // Prepare drag&drop.
  canvas.drop( onImageDropped );
  
  // Prepare controllers
  gFileSelector = createFileInput( onImageDropped );

  gBtToggleGrid = createButton('Toggle Grid');
  gBtToggleGrid.mousePressed( toggleGrid );

  gBtToggleQuarterLine = createButton('Toggle Quarter lines');
  gBtToggleQuarterLine.mousePressed( toggleQuarterLine );

  gBtSave = createButton('Save');
  gBtSave.mousePressed( save );

  // Redraw controller
  redrawControllers();
}

// Callback for image dropped.
const onImageDropped = ( file ) => {

  if( file.type === 'image' ){

    loadImage( file.data, ( img ) => {

      gImg = img;
      shrinkBigImage();
      drawLineSketch();

    } );
    
  }else{
    console.log( 'Non-supported file type. Please specify jpg or png' );
  }
  
}

// Shrink big image
const shrinkBigImage = () => {

  console.log( gImg.width, gImg.height );

  const maxLength = Math.max( gImg.width, gImg.height );
  const threashold = 1570;

  if( maxLength > threashold ){

    const ratio = maxLength / threashold;
    gImg.resize( gImg.width / ratio, gImg.height / ratio );

  }

  console.log( gImg.width, gImg.height );

}

// Draw waiting-drop canvas 
const drawDropCanvas = () => {

  background( 200 );
  textAlign( CENTER );
  textSize( 22 );
  text( 'Drop image HERE! \n\n The larger the pixel size of an image, \n the longer the analysis time', width / 2, height / 2 );

  redrawControllers();
  
}

// Draw whole line sketch. Main procedure.
const drawLineSketch = () => {

  if( gImg === undefined ){
    return;
  }

  background( 'white' );

  // Create canvas with image size
  resizeCanvas( gImg.width, gImg.height );
  fill('white');
  rect( 0, 0, width, height );

  // Draw grid first
  drawGrid();

  // Convert image data to gray scale
  gImg.filter( GRAY );

  // Draw lines
  drawLines();

  // Draw Quater lines finally.
  drawQuarterLine();

  // Redraw controller
  redrawControllers();

}

// Draw lines
const drawLines = () => {

  stroke('#202020');
  strokeWeight( 1.0 );
  fill('white');

  for( let column = 0; column < height; column += CELL_SIZE ){

    for( let row = 0; row < width; row += CELL_SIZE ){

      // Get pixel color. (Since it's gray-scaled color so all RGB values are same.)
      const color = gImg.get( row, column );
      const grayScaleColor = color[0];

      switch( getLineLevel( grayScaleColor ) ){
        default:
        case 0:
          // No operation.
          break;
        case 1:
          // 2 lines top and bottom
          line( row, column, row + CELL_SIZE, column );
          line( row, column + CELL_SIZE, row + CELL_SIZE, column + CELL_SIZE );
          break;
        case 2:
          // Square
          rect( row, column, CELL_SIZE, CELL_SIZE );   
          break;
        case 3:
          // Square with diagonal line
          rect( row, column, CELL_SIZE, CELL_SIZE );
          line( row, column, row + CELL_SIZE, column + CELL_SIZE );
          break;
        case 4:
          // Square with 2 diagonal lines
          rect( row, column, CELL_SIZE, CELL_SIZE );
          line( row, column, row + CELL_SIZE, column + CELL_SIZE );
          line( row + CELL_SIZE, column, row, column + CELL_SIZE );
          break;
      }
      
    }
  }

}

// Draw base grid.
const drawGrid = () => {

  if( gToggleGrid === false ){
    return;
  }

  stroke( '#BAAFA7' );
  strokeWeight( 1.0 );

  for( let column = 0; column < height; column += CELL_SIZE ){

    for( let row = 0; row < width; row += CELL_SIZE ){

      rect( row, column, CELL_SIZE, CELL_SIZE );

    }

  }

}

// Draw thick vertical/horizontal lines dividing the canvas into 16 regions.
const drawQuarterLine = () => {

  if( gToggleQuarterLine === false ){
    return;
  }

  stroke( 'black' );
  strokeWeight( 2.2 );

  for( let index of [ 1, 2, 3 ] ){

    const qH = index * ( height / 4 );
    line( 0, qH, width, qH );

    const qW = index * ( width / 4 );
    line( qW, 0, qW, height);

  }

}

// Covert gray scale value(0-255) to line level(0-4)
const getLineLevel = ( grayScaleValue ) => {

  const lineLevel = LINE_LEVEL_MAX 
                      - Math.floor( 
                          ( grayScaleValue / 256 ) * ( LINE_LEVEL_MAX + 1 ) 
                        );

  // console.log(grayScaleValue, lineLevel);
  return lineLevel;

}

// Support Key press commands
function keyPressed() {
	
  if( key === 's' || key === 'S' ) {

    save();
  
  }else if( key === 'z' || key === 'Z' ) {
    toggleGrid();
  }else if( key === 'x' || key === 'X' ) {
    toggleQuarterLine();
  }

}

// Toggle Grid
const toggleGrid = () => {

    gToggleGrid = !gToggleGrid;
    drawLineSketch();
  
}

// Toggle quarter lines
const toggleQuarterLine = () => {

    gToggleQuarterLine = !gToggleQuarterLine;
    drawLineSketch();
  
}

const redrawControllers = () => {

  if( gBtToggleGrid ){
    gBtToggleGrid.position( 10, 40 );
  }

  if( gBtToggleQuarterLine ){
    gBtToggleQuarterLine.position( 100, 40 );
  }

  if( gBtSave ){
    gBtSave.position( 240, 40 );
  }

  if( gFileSelector ){
    gFileSelector.position( 10, 10 );
  }

}