function ClearCanvas() {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function GetText() {
  let text = document.getElementById("input").value;
  return text
}

function ConvertTextToBase55(text){
  //This function assumes that input is in base 55 as if characters were digits of a number

  //This function only supports following characters
  //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz., and space

  let ret = 0;

  for(let i = text.length - 1; i >= 0 ; i--){
    const letter = text[i]
    const exponent = (text.length - i) - 1

    const coeff = lookup.indexOf(letter)
    ret += coeff * (55 ** exponent)
  }

  return ret
}

function ConvertNumberToBase13(input){
  return input.toString(13)
}

function ChangeTileColor(color){
  return (color == "#ebecd0") ? "#779556" : "#ebecd0";
}

// Takes any integer
function seed(i) {
  m_w = (123456789 + i) & mask;
  m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random()
{
  m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
  m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
  var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
  result /= 4294967296;
  return result;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function generateSequanceOfTiles(size){
  seed(1)

  let ret = [];
  for(let i = 0 ; i < size ; i ++){
    for(let j = 0 ; j < size ; j ++){
      ret.push([i,j])
    }    
  }
  shuffle(ret);
  return ret;
}

async function Encode() {
  const input = GetText();
  const chessboardSeed = ConvertNumberToBase13(ConvertTextToBase55(input))
  const requiredTiles = chessboardSeed.toString().length;
  const requiredBoardSize = Math.ceil(Math.sqrt(requiredTiles))
  const actualBoardSize = Math.max(requiredBoardSize, 8) // standard chess board is 8x8
  const canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.8
  const tileSize = Math.floor(canvasSize / actualBoardSize); 
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")  
  const tileSequance = generateSequanceOfTiles(actualBoardSize);
  document.getElementById("resultContainer").setAttribute("style", "visibility: hidden;")

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  ClearCanvas();
  for(let i = 0 ; i < actualBoardSize; i ++){
    for(let j = 0 ; j < actualBoardSize; j ++){
      ctx.fillStyle = ((i+j) % 2 == 0) ? "#ebecd0" : "#779556"
      ctx.fillRect(j*tileSize,i*tileSize,tileSize,tileSize)
    } 
  }

  const seedStr = chessboardSeed.toString();
  for(let i = 0 ; i < requiredTiles ; i ++){
    const x = tileSequance[i][0];
    const y = tileSequance[i][1];
    const state = parseInt(seedStr[i],13);
    if( state != 0 ){
      ctx.drawImage(pawns[state-1], x*tileSize, y*tileSize,tileSize,tileSize);
    }
  }

  document.getElementById("download").setAttribute("style", "")
}

var download = function(){
  var link = document.createElement('a');
  link.download = 'chessboard.png';
  link.href = document.getElementById('canvas').toDataURL()
  link.click();
}