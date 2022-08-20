const readlineSync = require('readline-sync');

function showTerms() {
  console.log(`Правила игры:
    Компьютер загадывает 5-значное число,
    состоящее из цифр от 3 до 6.
    Пользователь пытается отгадать(дается 3 попытки).
    После каждой попытки компьютер сообщает оличество
    совпавших цифр стоящих не на своих местах,
    а также количество правильных цифр на своих местах.
    Например загаданное число: 56478 предположение игрока: 52976
    ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7).
    игра ведется до окончания количества ходов либо до отгадывания\n`);
};


function randDigit() {
  return 3 + Math.round(Math.random()*3);
};

function randNumber() {
  let massive =[];
  for (let i = 0; i < 5; i++) {
    massive[i] = randDigit();
  };
  return massive;
};

function Trying(numberOfTryes, computerHidden) {

  for (var i = 0; i <= numberOfTryes; i++) {
    const userTry = readlineSync.question(`Enter your assumption!\n`).split('');

    let tryingAmount = {
      amountGuessed: 0,
      amountShifted: 0,
    };

    let chekedInHiddenDigits = new Array(5).fill(false,0,5);

    userTry.forEach(function( item, index, array) {
      for (let hiddenIndex = 0; hiddenIndex < computerHidden.length; hiddenIndex++) {
        let hiddenItem = computerHidden[hiddenIndex];
        if (hiddenItem === +item && !chekedInHiddenDigits[hiddenIndex]) {
          if (hiddenIndex === index) {
            tryingAmount.amountGuessed++;
          } else {
            tryingAmount.amountShifted++;
          };
          chekedInHiddenDigits[hiddenIndex] = true;
          break;
        };
      };
      return tryingAmount;
    }, tryingAmount);

    if(+computerHidden.join('') === +userTry.join('')) {
      return 'Вы победили!';
    } else {
      console.log('Количество угаданных цифр', tryingAmount.amountGuessed, '\n',
                  'Количество цифр не на своих местах: ', tryingAmount.amountShifted);
    };
  };
  return 'Количество попыток закончилось и вы проиграли!'
};

(function game() {
  showTerms();
  const numberOfTryes = readlineSync.question(`Enter number of tryes!\n`)
  let computerHidden = randNumber();
  console.log('Компьютер загадал число:  ', new Array(5).fill('* ', 0, 5).join(''));
  console.log(Trying(numberOfTryes, computerHidden));
  console.log('Загаданное число было: ' + computerHidden.join(''));

})();
