const readlineSync = require('readline-sync');

function randIndex(minIndex, maxIndex) {
  return minIndex + Math.round(Math.random()*(maxIndex-minIndex));
};

function getCharacteristics(item) {
  return `${item.physicalDmg}       |  ${item.magicDmg}      |  ${item.physicArmorPercents}        |  ${item.magicArmorPercents}       |  ${item.cooldownLeft}`;
};

const characteristicsTitles = `physDmg | magDmg  |  physArm  |  magArm  |  cooldown`;

function Monster() {
  this.maxHealth = 10;
  this.name = "Лютый";
  this.moves = [
    {
      "name": "Удар когтистой лапой",
      "physicalDmg": 3, // физический урон
      "magicDmg": 0,    // магический урон
      "physicArmorPercents": 20, // физическая броня
      "magicArmorPercents": 20,  // магическая броня
      "cooldown": 0     // ходов на восстановление
    },
    {
      "name": "Огненное дыхание",
      "physicalDmg": 0,
      "magicDmg": 4,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3
    },
    {
      "name": "Удар хвостом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 50,
      "magicArmorPercents": 0,
      "cooldown": 2
    },
  ];

  this.chooseMove = function(moves) {
    let index = randIndex(0, 2);
    let move = moves[index];
    if(!move["cooldownLeft"]) {
      return index;
    } else {
      // console.log(`trying find anover move`);
      return this.chooseMove(moves);
    };
  };

  this.move =  function() {

    let index = this.chooseMove(this.moves);

    let move =  this.moves[index];
    move["cooldownLeft"] = move["cooldown"] + 1;

    this.moves.forEach((item) => {
      if(item["cooldownLeft"] <= 1 || !item["cooldownLeft"]) {
        item["cooldownLeft"] = 0;
      } else {
        item["cooldownLeft"]--;
      };
    });

    return move;

  };
};

function User(name, difficult) {
  this.name = name;
  switch (difficult) {
    case "easy":
      this.maxHealth = 20;
      break;
    case "normal":
      this.maxHealth = 15;
      break;
    case "hard":
      this.maxHealth = 10;
      break;
  };
  this.moves = [
    {
      "name": "Удар боевым кадилом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 50,
      "cooldown": 0
    },
    {
      "name": "Вертушка левой пяткой",
      "physicalDmg": 4,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 4
    },
    {
      "name": "Каноничный фаербол",
      "physicalDmg": 0,
      "magicDmg": 5,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3
    },
    {
      "name": "Магический блок",
      "physicalDmg": 0,
      "magicDmg": 0,
      "physicArmorPercents": 100,
      "magicArmorPercents": 100,
      "cooldown": 4
    },
  ];
  this.chooseMove = function(moves) {
    movesForChoice = moves.map(item => getCharacteristics(item));
    moves.forEach((item, index) => console.log(`[${index + 1}] ` + item.name));
    console.log('\n ' + characteristicsTitles);
    index = readlineSync.keyInSelect(movesForChoice, '');
    if(!moves[index].cooldownLeft) {
      return index;
    } else {
      console.log(`Please choose another move, cooldown is: ${moves[index].cooldownLeft}`);
      return this.chooseMove(moves);
    };

  }
  this.move = new Monster().move;
};

function chooseCharacter() {
  const name = readlineSync.question(`Enter your name!\n`);
  let difficults = ['easy', 'normal', 'hard'];
  let index = readlineSync.keyInSelect(difficults, 'choose the difficult');
  console.log(`Вы выбрали сложность: ${difficults[index]}`);
  return new User(name, difficults[index]);
};

function amountDmg(move, target) {
  return move.physicalDmg*(1 - target.physicArmorPercents/100) + move.magicDmg*(1 - target.magicArmorPercents/100);
};


(function game() {
  let user = chooseCharacter();//Chose name and difficult(maxHealth)
  user.currentHealth = user.maxHealth;
  let monster = new Monster();
  monster.currentHealth = monster.maxHealth;
  console.log('Бой начинается!\n');
  console.log(`Здоровье ${monster.name}: ${monster.currentHealth}`);
  console.log(`Здоровье ${user.name}: ${user.currentHealth}\n`);


  let i = 1;
  while(true) {
    console.log(`______________Раунд ${i}___________________\n`);
    console.log('Ход монстра:');
    let monsterMove = monster.move();
    console.log(monsterMove.name, ':');
    console.log(characteristicsTitles);
    console.log(getCharacteristics(monsterMove) + '\n' +
     '-------------------------------------------------' +
      '\n');

    console.log('Ваш ход:\n');
    let userMove = user.move();
    console.log('Вы сходили:');
    console.log(userMove.name, ':');
    console.log(characteristicsTitles);
    console.log(getCharacteristics(userMove) + '\n' +
     '-------------------------------------------------' +
      '\n');

    console.log(`Наснесеный монстром урон: ${amountDmg(monsterMove, userMove)}`);
    console.log(`Наснесеный вами урон: ${amountDmg(userMove, monsterMove)}`);
    user.currentHealth = user.currentHealth - amountDmg(monsterMove, userMove);
    monster.currentHealth = monster.currentHealth - amountDmg(userMove, monsterMove);

    console.log(`\n_____________________________________\n`);
    console.log(`Здоровье ${monster.name}: ${monster.currentHealth}`);
    console.log(`Здоровье ${user.name}: ${user.currentHealth}\n`);
    console.log(`\n_____________________________________\n`);


    i++;
    // key = readlineSync.keyIn(`\n------------------Any key to continue, 'q' to exit--------------------\n`);
    // if(key == "q") break;


    if(user.currentHealth <= 0) {
      console.log(`ПОРАЖЕНИЕ!`);
      let menu = ['AGAIN', 'EXIT'];
      let index = readlineSync.keyInSelect(menu, 'Play again?');
      console.log(`Вы выбрали: ${menu[index]}`);
      if (menu[index] == 'AGAIN') {
        game();
      } else break;
    } else if(monster.currentHealth <= 0) {
      console.log(`ПОБЕДА!`);
      let menu = ['AGAIN', 'EXIT'];
      let index = readlineSync.keyInSelect(menu, 'Play again?');
      console.log(`Вы выбрали: ${menu[index]}`);
      if (menu[index] == 'AGAIN') {
        game();
      } else break;
    }
    // console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n`);



  };
})();
