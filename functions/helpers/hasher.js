const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const base = alphabet.length; // base is the length of the alphabet (58 in this case)

exports.encode = (num) => {
  let encoded = '';
  while (num) {
    const remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
};

exports.decode = (str) => {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    const letter = str[i];
    const index = alphabet.indexOf(letter);
    const power = str.length - 1 - i;
    decoded += index * Math.pow(base, power);
  }
  return decoded;
};
