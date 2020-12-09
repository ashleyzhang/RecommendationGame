var unwanted = [];

var unwantedDishesPage = true;

var score = 17;
var threshold = 10;
var initVal = 3;

var questionNumber = 1;
var maxNumQuestions = 10;

var dishValues = {
  "bagel-sandwich": initVal, "burger-fries": initVal, "burrito": initVal, "curry": initVal, "donuts": initVal, 
  "dumplings": initVal, "eggs-benedict": initVal, "falafel": initVal, "fruits": initVal, "grilled-fish": initVal,
  "paella": initVal, "pancakes": initVal, "pasta": initVal, "pizza": initVal, "ramen": initVal,"rolls": initVal, 
  "salad": initVal, "soup": initVal, "sushi": initVal, "tempura": initVal
};

var actualNames = {
  "bagel-sandwich": "Bagel Egg Sandwich", "burger-fries": "Burger & Fries", 
  "burrito": "Beef Burrito", "curry": "Chicken Curry", "donuts": "Donuts", 
  "dumplings": "Steamed Dumplings (Meat)", "eggs-benedict": "Eggs Benedict", 
  "falafel": "Falafel", "fruits": "Fruits", "grilled-fish": "Grilled Salmon",
  "paella": "Paella", "pancakes": "Pancakes", "pasta": "Tomato Pasta", 
  "pizza": "Pepperoni Pizza", "ramen": "Ramen","rolls": "Calfornia Rolls", 
  "salad": "Salad", "soup": "Onion Soup", "sushi": "Sushi", "tempura": "Tempura"
};
var dishIds = {}

// recommendation scoring table
// 1 for yes, 0 for kind of, rest will be filled with -1
var tags = {
  "Bagel Egg Sandwich": {
    "Breakfast": 1, "Brunch": 0, "Lunch": 1, "Dinner": 0, "Vegetarian": 1,
    "American": 1, "Salty": 1, "Cold": 1, "Warm": 0, "Low-Calorie": 0, "Nutrition": 0
  }, 
  "Burger & Fries": {
    "Lunch": 1, "Dinner": 1, "Vegetarian": 0, "American": 1, "Salty": 1, "Warm": 1
  },
  "Beef Burrito": {
    "Lunch": 1, "Dinner": 1, "Mexican": 1, "Salty": 1, "Warm": 1, "Low-Calorie": 0
  }, 
  "Chicken Curry": {
    "Lunch": 1, "Dinner": 1, "Indian": 1, "Japanese": 1, "Salty": 1, "Warm": 1, 
    "Hot": 0, "Low-Calorie": 0, "Nutrition": 0
  }, 
  "Donuts": {
    "Snack": 1, "Vegetarian": 1, "American": 1, "Sweet": 1, "Cold": 1, "Low-Calorie": 0
  }, 
  "Steamed Dumplings (Meat)": {
    "Breakfast": 0, "Lunch": 1, "Dinner": 1, "Japanese": 1, "Korean": 1, "Chinese": 1, 
    "Salty": 1, "Spicy": 0, "Warm": 1, "Hot": 0, "Low-Calorie": 0, "Nutrition": 0
  },
  "Eggs Benedict": {
    "Breakfast": 1, "Brunch": 1, "Vegetarian": 0, "American": 1, "Salty": 1, "Warm": 1,
    "Low-Calorie": 0, "Nutrition": 1
  }, 
  "Falafel": {
    "Lunch": 1, "Dinner": 1, "Vegetarian": 1, "Middle Eastern": 1, "Neutral": 1, "Salty": 0,
    "Warm": 0, "Hot": 1, "Low-Calorie": 0, "Nutrition": 1
  }, 
  "Fruits": {
    "Breakfast": 1, "Brunch": 1, "Snack": 1, "Vegetarian": 1, "American": 0, "Italian": 0, 
    "Spanish": 0, "Japanese": 0, "Mexican": 0, "Korean": 0, "Chinese": 0, "Indian": 0, 
    "Middle Eastern": 0, "Sweet": 1, "Cold": 1, "Low-Calorie": 1, "Nutrition": 1
  }, 
  "Paella": {
    "Lunch": 0, "Dinner": 1, "Warm": 1, "Spanish": 1, "Salty": 1, "Spicy": 1, "Low-Calorie": 0,
    "Nutrition": 0
  },
  "Pancakes": {
    "Breakfast": 1, "Brunch": 1, "Snack": 0, "American": 1, "Warm": 1, "Sweet": 1,
    "Low-Calorie": 0, "Vegetarian": 1
  },
  "Tomato Pasta": {
    "Lunch": 1, "Dinner": 1, "Warm": 1, "Hot": 0, "Italian": 1, "Salty": 1, "Spicy": 1, 
    "Low-Calorie": 0, "Vegetarian": 0, "Nutrition": 0
  },
  "Pepperoni Pizza": {
    "Lunch": 1, "Dinner": 1, "Warm": 1, "Italian": 1, "American": 1, "Salty": 1, "Warm": 1, 
    "Hot": 1
  },
  "Ramen": {
    "Lunch": 1, "Dinner": 1, "Warm": 0, "Hot": 1, "Japanese": 1, "Korean": 1, "Salty": 1, 
    "Spicy": 1, "Vegetarian": 0
  }, 
  "Calfornia Rolls": {
    "Lunch": 1, "Dinner": 1, "Cold": 1, "Japanese": 1, "Korean": 0, "Salty": 1, 
    "Low-Calorie": 0, "Vegetarian": 0, "Nutrition": 0
  },
  "Salad": {
    "Breakfast": 0, "Lunch": 1, "Dinner": 1, "Cold": 1, "Neutral": 1, "Low-Calorie": 1,
    "Vegetarian": 0, "American": 1, "Italian": 1, "Nutrition": 1
  },
  "Onion Soup": {
    "Breakfast": 0, "Lunch": 1, "Dinner": 1, "Hot": 1, "Salty": 1, "Low-Calorie": 1,
    "Vegetarian": 1, "American": 1, "Italian": 1, "Nutrition": 1
  },
  "Sushi": {
    "Lunch": 1, "Dinner": 1, "Cold": 1, "Neutral": 1, "Low-Calorie": 0, "Vegetarian": 0, 
    "Japanese": 1
  },
  "Tempura": {
    "Lunch": 1, "Dinner": 1, "Warm": 1, "Salty": 1, "Low-Calorie": 0, "Japanese": 1
  },
  "Grilled Salmon": {
    "Lunch": 1, "Dinner": 1, "Warm": 1, "Salty": 1, "Low-Calorie": 0, "Japanese": 1,
    "American": 1, "Italian": 1
  }
};

// question generating
var cuisines = 
  ["American", "Italian", "Spanish", "Japanese", "Mexican", 
  "Korean", "Chinese", "Indian", "Middle Eastern"];
var meals = ["Breakfast", "Lunch", "Dinner", "Snack", "Brunch"];
var flavors = ["Sweet", "Salty", "Spicy", "Neutral"];
var temperature = ["Cold", "Warm", "Hot"];
var factors = ["Nutrition", "Vegetarian", "Low-Calorie"];
var dishes =
  ["Bagel Egg Sandwich", "Burger & Fries", "Beef Burrito", "Chicken Curry", 
  "Donuts", "Steamed Dumplings (Meat)", "Eggs Benedict", "Falafel", "Fruits", 
  "Paella", "Pancakes", "Tomato Pasta", "Pepperoni Pizza", "Ramen", 
  "Calfornia Rolls", "Salad", "Onion Soup", "Sushi", "Tempura"];

var options = []
var selection = undefined;
// if we're asking the least favorite question
var leastFav = false;

function updateDishValues() {
  if (dishes.includes(selection)) {
    var multiple = 1;
    if (leastFav) {
      multiple = -1;
    }
    var normalizer = 10;
    var allTags = cuisines + meals + flavors + temperature + factors;
    for (var i = 0; i < dishes.length; i++) {
      var id = dishIds[dishes[i]];
      var numSame = 0;
      for (var t = 0; t < allTags.length; t++) {
        var tag = allTags[t];
        if (tags[dishes[i]][tag] == tags[selection][tag]) {
          numSame += 1;
        }
      }
      if (dishValues[id] != undefined) {
        dishValues[id] += 0.5 * multiple * (numSame / normalizer);
        if (dishValues[id] > threshold) {
          dishValues[id] = threshold;
        }
      }
      
      for (var t = 0; t < allTags.length; t++) {
        var tag = allTags[t];
        for (var j = 0; j < options.length; j++) {
          if (tags[dishes[i]][tag] == tags[options[j]][tag]) {
            numSame += 1;
          }
        }
      }
      if (dishValues[id] != undefined) {
        dishValues[id] -= (2 / dishes.length) * multiple * (numSame / normalizer);
        if (dishValues[id] > threshold) {
          dishValues[id] = threshold;
        }
      }
    }
  } else {
    $.each(dishValues, function( dish, _ ) {
      if (dishValues[dish] != undefined) {
        console.log(dish);
        dishValues[dish] += 2 * tags[actualNames[dish]][selection];
        for (var i = 0; i < options.length; i++) {
          if (options[i] != selection) {
            dishValues[dish] -= (2 / options.length) * tags[actualNames[dish]][options[i]];
          }
        }
        if (dishValues[id] > threshold) {
          dishValues[id] = threshold;
        }
      }
    });
  }
}

var topBound = 3;
var bottomBound = 82;
var leftBound = 5;
var centerX = 42.5;
var centerY = 52.5;

var dishEdges = {};

function getRandomGoalPoint() {
  var randEdge = Math.floor(Math.random() * 3);
  if (randEdge == 1) {
    var rand = Math.floor(Math.random() * (100 - leftBound - 2)) + leftBound;
    return [topBound, rand];
  } else if (randEdge == 2) {
    var rand = Math.floor(Math.random() * (bottomBound - topBound - 1)) + topBound;
    return [rand, leftBound];
  } else {
    var rand = Math.floor(Math.random() * (100 - leftBound - 1)) + leftBound;
    return [bottomBound, rand];
  }
}

function updateDishLocations() {
  updateDishValues();
  console.log(dishValues);
  $.each(dishValues, function( dish, val ) {
    if (dishValues[dish] != undefined) {
      // higher value means closer to center
      // mult closer to 0 means closer to center
      var mult = -1 * ((val - threshold) / threshold);
      if (mult > 1) {
        dishValues[dish] = undefined;
        if (unwanted.includes(dish)) {
          score += 1;
        } else {
          score -= 1;
        }
        $(".score").text(`Current Score: ${score}`);
        $(`#${dish}`).fadeTo(100, 0.25);
      } else if (mult < 0) {
        mult = 0;
      }
      edgePoint = dishEdges[dish];
      // random offsets so that dishes don't overlap as much in the center
      var offsetX = Math.floor(Math.random() * 5) - 2;
      var offsetY = Math.floor(Math.random() * 5) - 2;
      var cenX = centerX + offsetX;
      var cenY = centerY + offsetY;
      var t = cenX + mult * (edgePoint[0] - cenX);
      var l = cenY + mult * (edgePoint[1] - cenY);
      $(`#${dish}`).animate({top: `${t}%`, left: `${l}%`});
    }
  });
}

function fillNegTags() {
  $.each(tags, function( _, vals ) {
    for (var i = 0; i < cuisines.length; i++) {
      if (vals[cuisines[i]] == undefined) {
        vals[cuisines[i]] = -1;
      }
    }
    for (var i = 0; i < meals.length; i++) {
      if (vals[meals[i]] == undefined) {
        vals[meals[i]] = -1;
      }
    }
    for (var i = 0; i < flavors.length; i++) {
      if (vals[flavors[i]] == undefined) {
        vals[flavors[i]] = -1;
      }
    }
    for (var i = 0; i < temperature.length; i++) {
      if (vals[temperature[i]] == undefined) {
        vals[temperature[i]] = -1;
      }
    }
    for (var i = 0; i < factors.length; i++) {
      if (vals[factors[i]] == undefined) {
        vals[factors[i]] = -1;
      }
    }
  });
}

function generateSubset(values, n) {
  result = []
  while (result.length < n) {
    var ind = Math.floor(Math.random() * values.length);
    if (!result.includes(values[ind])) {
      result.push(values[ind]);
    }
  }
  return result;
}

function generateRandomQuestion() {
  leastFav = false;
  var random = Math.floor(Math.random() * 12);
  var question = "";
  options = [];
  if (random < 3) {
    question = "Which of the following cuisines would you prefer?";
    options = generateSubset(cuisines, 3);
  } else if (random < 5) {
    question = "Which of the following foods would you prefer?";
    options = generateSubset(dishes, 2);
  } else if (random < 7) {
    question = "Which of these flavors of food are you more likely to choose?";
    options = generateSubset(flavors, 2);
  } else if (random < 9) {
    leastFav = true;
    question = "Which of the following foods is your least favorite?";
    options = generateSubset(dishes, 3);
  } else if (random < 10) {
    question = "Which meal is your favorite?";
    options = generateSubset(meals, 2);
  } else if (random < 11) {
    question = "If you could only eat one of the following foods for the rest of your life, which would it be?"
    options = generateSubset(dishes, 3);
  } else {
    question = "When deciding on food options, which of the following factors is more important?"
    options = generateSubset(factors, 2);
  }

  var options_html = "";
  for (var i = 0; i < options.length; i++) {
    options_html += `<button class="btn answer">${options[i]}</button>`
  }
  var question_html =
    `<p class="question">Q${questionNumber}. ${question}</p>
    ${options_html}
    <button class="btn next-button" disabled>Next</button>`;
  $(".col-sm").empty().append(question_html);
};

$(document).ready(function(){
  fillNegTags();

  $.each(actualNames, function( id, name ) {
    dishIds[name] = id;
    dishEdges[id] = getRandomGoalPoint();
  });

  $(".img-container").click(function() {
    if (unwantedDishesPage) {
      if (unwanted.includes(this.id)) {
        var index = unwanted.indexOf(this.id);
        unwanted.splice(index, 1);
        $(this).removeClass("selected");
        $(this).children(".checkmark").remove();
        $(".next-button").prop("disabled", true);
      } else if (unwanted.length < 3) {
        unwanted.push(this.id);
        $(this).addClass("selected");
        $(this).append("<span class='checkmark'>&#10003;</span>")
        if (unwanted.length == 3) {
          $(".next-button").prop("disabled", false);
        }
      }
      var unwanted_names = [];
      for (var i = 0; i < unwanted.length; i++) {
        unwanted_names.push(actualNames[unwanted[i]]);
      }
      $(".unwanted").text(`Unwanted dishes: ${unwanted_names.join(", ")}`);
    }
  });

  $("body").on("click", ".answer", function() {
    $(".next-button").prop("disabled", false);
    if ($(this).is(':focus')) {
      selection = $(this).text();
    }
  });

  $("body").on("click", function() {
    if (!$(".answer").is(':focus') && questionNumber > 1) {
      $(".next-button").prop("disabled", true);
    }
  });

  $("body").on("click", ".next-button", function() {
    if (unwantedDishesPage) {
      unwantedDishesPage = false;
      $(".col-sm").empty();
      $(".img-container").removeClass("selected");
      $(".checkmark").remove();
      $(".score").text(`Current Score: ${score}`);
      var new_html = 
        `<p class="small-title">Try keeping your options open</p>
        <p class="description">
          Your goal is to keep as many dishes on the table as possible, except the ones you don’t like.
          <br /><br />
          We will be impressed if you can score above 10.
          <br /><br />
          Good luck!
        </p>
        <button class="btn next-button">Start the game</button>
      `;
      $(".col-sm").empty().append(new_html);
    } else {
      if (selection != undefined) {
        updateDishLocations();
      }
      if (questionNumber < maxNumQuestions) {
        generateRandomQuestion();
        questionNumber += 1;
      } else if (questionNumber == maxNumQuestions) {
        generateRandomQuestion();
        $(".next-button").text("Final Result");
        $(".score").text(`Final Score: ${score}`);
        questionNumber += 1;
      } else {
        var new_html = "";
        if (score >= 10) {
          new_html =
            `<p class="final-score">Your final score: ${score}</p>
            <p class="result-title">
              Great!
              <br /><br />
              You did a good job diversifying your options within the recommendation system.
            </p>
            <a href="conclusion.html" class="btn next-button" role="button">Next</a>`;
        } else {
          new_html =
            `<p class="final-score">Your final score: ${score}</p>
            <p class="result-title">
              Oops.
              <br /><br />
              You only have a few dishes left. You were not able to keep as many dishes as you liked.
            </p>
            <a href="conclusion.html" class="btn next-button" role="button">Next</a>`;
        }
        $(".col-sm").empty().append(new_html);
      }
    }
  });
  
});