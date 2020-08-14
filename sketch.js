
// Image object
let gImg = undefined;

// Cell unit size(pixel)
const CELL_SIZE = 10;

// Line level ranges from 0 to 4.
const LINE_LEVEL_MAX = 4;

function setup() {

  // Prepare canvas
  const canvas = createCanvas( 800, 800 )
    .dragOver( ( evt ) => {
      this.background( color( 'black' ) );
      evt.preventDefault;
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

}

// Callback for image dropped.
const onImageDropped = ( file ) => {

  if( file.type === 'image' ){

    loadImage( file.data, ( img ) => {

      gImg = img;
      drawLineSketch();

    } );
    
  }else{
    console.log( 'Non-supported file type. Please specify jpg or png' );
  }
  
}

// Draw waiting-drop canvas 
const drawDropCanvas = () => {

  background( 200 );
  textAlign( CENTER );
  textSize( 26 );
  text( 'Drop image HERE! \n\n The larger the pixel size of an image, \n the longer the analysis time', width / 2, height / 2 );

}

// Draw whole line sketch. Main procedure.
const drawLineSketch = () => {

  // Create canvas with image size
  resizeCanvas( gImg.width, gImg.height );

  // Draw grid first
  drawGrid();

  // Convert image data to gray scale
  gImg.filter( GRAY );

  // Draw lines
  drawLines();

  // Draw Quater lines finally.
  drawQuarterLine();

}

// Draw lines
const drawLines = () => {

  stroke('#202020');
  strokeWeight( 1.0 );
  noFill();

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

  stroke( "#BAAFA7" );
  strokeWeight( 1.0 );

  for( let column = 0; column < height; column += CELL_SIZE ){

    for( let row = 0; row < width; row += CELL_SIZE ){

      rect( row, column, CELL_SIZE, CELL_SIZE );

    }

  }

}

// Draw thick vertical/horizontal lines dividing the canvas into 16 regions.
const drawQuarterLine = () => {

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

