function ClearCanvas() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function GetText() {
  let text = document.getElementById("input").value;
  return text
}

function ConvertTextToBase10(text){
  //This function assumes that input is in base 55 as if characters were digits of a number

  //This function only supports following characters
  //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz., and space

  let ret = 0;
  const lookup = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', ',']
  const values = [ ]

  for(let i = text.length - 1; i >= 0 ; i--){
    const letter = text[i];
    const exponent = (text.length - i) - 1;

    const coeff = lookup.indexOf(letter)
    ret += coeff * (55 ** exponent);
  }

  return ret;
}

function ConvertNumberToBase13(input){
  return input.toString(13)
}

async function Enocode() {
  let input 
}