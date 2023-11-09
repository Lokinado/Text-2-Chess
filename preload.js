let pawns = [];

function preloadPawns(){
  const paths = ["DarkBishop.webp", "DarkPawn.webp", "LightBishop.webp", "LightPawn.webp", "DarkKing.webp", "DarkQueen.webp", "LightKing.webp", "LightQueen.webp", "DarkKnight.webp", "DarkRook.webp", "LightKnight.webp", "LightRook.webp"]

  paths.forEach( value => {
    const pawn = new Image();
    pawn.src = "assets/" + value;
    pawns.push(pawn)
  })
}

preloadPawns();