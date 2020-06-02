const fetch = require('node-fetch');
const fs = require('fs');

const ab = 'qwertyuiopasdfghjklzxcvbnm1234567890';

getItNotDumb();
let allCocks = JSON.parse(fs.readFileSync('cocks_small.json'));

// getIngredientsList();
let allGreds = JSON.parse(fs.readFileSync('ingredients.json'));

let possibleCocks = allCocks.filter((drink) => {
  for (let i = 0; i < drink.ingredients.length; i++) {
    if (allGreds[drink.ingredients[i].ingredient] == 0) {
      return false;
    }
  }

  return true;
})

console.clear();
console.log(`Choosing from ${possibleCocks.length} possible drinks (out of ${allCocks.length} total)...\n`);
const c = possibleCocks[Math.floor(Math.random()*possibleCocks.length)]; // chosen

let ingredients = '';
for (let i = 0; i < c.ingredients.length; i++) {
  ingredients += '\t'

  if (!!c.ingredients[i].measure) {
    ingredients += c.ingredients[i].measure + ' ';
  }

  ingredients += c.ingredients[i].ingredient + '\n';
}
console.log(`${c.drink} - ${c.glass}
${ingredients}
${c.instructions}
`);


////////////////////////////////////////////////////////////////////////////////

function getItNotDumb () {
  let drinks = JSON.parse(fs.readFileSync('cocks.json'));

  function cleanupArr (arr) {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      for (let key in obj) {
        if (obj[key] === null) {
          delete obj[key];
          continue;
        }

        if (key.slice(0, 3) === 'str') {
          let newKey = key.slice(3);
          newKey = newKey[0].toLowerCase() + newKey.slice(1);
          obj[newKey] = obj[key];
          delete obj[key];
        }
      }

      delete obj['idDrink'];
      delete obj['dateModified'];
      delete obj['instructionsDE'];
      delete obj['drinkThumb'];
      delete obj['creativeCommonsConfirmed'];

      arr[i] = obj;
    }

    return arr;
  }
  drinks = cleanupArr(drinks);

  function consolidateIngredients (drink) {
    let ingredients = [];

    for (let i = 0; i < 15; i++) {
      const iKey = 'ingredient'+i;
      const mKey = 'measure'+i;

      if (!drink[iKey]) {
        delete drink[iKey];
        delete drink[mKey];
        continue; // break may work, but just wanna be safe
      }

      ingredients.push({
        ingredient: drink[iKey],
        measure: drink[mKey],
      });

      delete drink[iKey];
      delete drink[mKey];
    }

    drink.ingredients = ingredients;
    return drink;
  }
  const consolidatedDrinks = drinks.map(d => consolidateIngredients(d));


  drinks = drinks.filter(e => e.alcoholic === 'Alcoholic');

  function fixIngredients (drink) {
    // unslugify
    // to title case
    // bailey -> Baileys
    // baileys irish cream -> irish cream
  }

  fs.writeFileSync('cocks_small.json', JSON.stringify(drinks));
}

function getIngredientsList () {
  let ingredients = {};
  for (let i = 0; i < allCocks.length; i++) {
    for (let j = 0; j < allCocks[i].ingredients.length; j++) {
      const ingredientName = allCocks[i].ingredients[j].ingredient;
      if (!ingredients[ingredientName]) {
        ingredients[ingredientName] = 0;
      }

      // ingredients[ingredientName] += 1;
    }
  }

  fs.writeFileSync('ingredients.json', JSON.stringify(ingredients, '', '  '));
}
