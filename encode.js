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

function isInputValid(text){
  let ret = true;
  for(let i = text.length - 1; i >= 0 ; i--){
    const letter = text[i]
    const index = lookup.indexOf(letter)
    ret &= !( index == -1 ) 
  }

  return ret;
}

async function Encode() {
  const input = GetText();

  if( !isInputValid(input) ){
    alert("Input is invalid. Supported characters are: space and ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,")
    document.getElementById("input").value = "";
    return;
  }

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