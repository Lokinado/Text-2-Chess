let pawns = [];
const paths = ["DarkBishop.webp", "DarkPawn.webp", "LightBishop.webp", "LightPawn.webp", "DarkKing.webp", "DarkQueen.webp", "LightKing.webp", "LightQueen.webp", "DarkKnight.webp", "DarkRook.webp", "LightKnight.webp", "LightRook.webp"]

const lookup = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', ',']
//Setting the space as the first character of dictionary removes spaces on the beggining of text
//This function utilises the fact that leading zeros arent represented as a number

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function preloadPawns(){
  paths.forEach( value => {
    const pawn = new Image();
    pawn.src = "assets/" + value;
    pawns.push(pawn)
  })
}

preloadPawns();