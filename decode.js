document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function calculateError(averageColorArray, expectedColorArray){
  const redError = Math.abs(expectedColorArray[0]-averageColorArray[0])
  const greenError = Math.abs(expectedColorArray[1]-averageColorArray[1])
  const blueError = Math.abs(expectedColorArray[2]-averageColorArray[2])

  return [redError, greenError, blueError];
}

function getScoreFromError(ErrorArray){
  const RedComp = ErrorArray[0] ** 2;
  const GreenComp = ErrorArray[1] ** 2;
  const BlueComp = ErrorArray[2] ** 2;
  
  return Math.sqrt(RedComp + GreenComp + BlueComp);
}

function checkAverageColor(averageColorArray){
  let bestScore = 10**6;
  let bestScoreIndex = 0;
  for(let i = 0 ; i < colorSygnaturesDict.length; i ++){
    let score = 0;

    const sigError = [
      calculateError(averageColorArray, colorSygnaturesDict[i][0]),
      calculateError(averageColorArray, colorSygnaturesDict[i][1])
    ]

    score = Math.min(getScoreFromError(sigError[0]),getScoreFromError(sigError[1]))
    if(score < bestScore){
      bestScore = score;
      bestScoreIndex = i;
    }
  }
  return bestScoreIndex;
}

function convertBase10ToText(base10Number){
  let ret = "";

  while(base10Number > 0){
    const rem = base10Number % BigInt(55);
    base10Number /= BigInt(55); 
    ret = lookup[rem] + ret;
  }

  return ret;
}

function calculateAverageColor(tilePixels){
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  for(let i = 0 ; i < tilePixels.length ; i += 4){
    rSum += tilePixels[i];
    gSum += tilePixels[i + 1];
    bSum += tilePixels[i + 2];
  }
  rSum /= (tilePixels.length / 4);
  gSum /= (tilePixels.length / 4);
  bSum /= (tilePixels.length / 4);
  return [rSum, gSum, bSum];
}

function handleFileSelect(event) {
  const file = event.target.files[0];

  if (file && file.type === 'image/png') {
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;

      document.getElementById("download").setAttribute("style", "visibility: hidden;")

      image.onload = function () {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        
        // Set the canvas size to match the image size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image on the canvas
        context.drawImage(image, 0, 0, image.width, image.height);


        const imageData = context.getImageData(0, 0, image.width, image.height);
        const pixels = imageData.data;

        let boardSize = 0;
        let lastColor = "";
        let colorRepetition = 0;
        for (let i = 0 ; i < 4*image.width; i+=4){
          const red = pixels[i];
          const green = pixels[i + 1];
          const blue = pixels[i + 2];
          const color = rgbToHex(red,green,blue)
  
          if(color != lastColor){
            lastColor = color;
            colorRepetition = 0;
          } else {
            colorRepetition++;
          }

          if(colorRepetition == 4){
            boardSize++;
          }
        }

        const tileSequance = generateSequanceOfTiles(boardSize);
        const tileSize = Math.floor(image.width / boardSize);
        
        let result = BigInt(0);
        for(let i = tileSequance.length-1; i >= 0 ; i--){
          const x = (tileSequance[i][0] * tileSize); 
          const y = (tileSequance[i][1] * tileSize);

          const tileData = context.getImageData(x, y, tileSize, tileSize);
          const tilePixels = tileData.data;
          const averageColor = calculateAverageColor(tilePixels);

          if( averageColor[0] != 235 && averageColor[0] != 119){
            const coef = BigInt(checkAverageColor(averageColor) + 1);
            result += coef;
          }

          if(result != 0){
            result *= 13n;
          }
        }
        result /= 13n;

        const decodedText = convertBase10ToText(result)
        document.getElementById("resultContainer").setAttribute("style", "")
        document.getElementById("result").innerText = decodedText;
      };
    };

    reader.readAsDataURL(file);
  } else {
    alert('Please select a valid PNG file.');
  }
}