var dishes =
  ["bagel-sandwich", "burger-fries", "burrito", "curry", "donuts", 
  "dumplings", "eggs-benedict", "falafel", "fruits", "grilled-fish",
  "paella", "pancakes", "pasta", "pizza", "ramen",
  "rolls", "salad", "soup", "sushi", "tempura"];

var unwanted = [];

var unwantedDishesPage = true;

var score = 0;

$(document).ready(function(){
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
      console.log(unwanted);
    }
  });

  $(".next-button").click(function() {
    unwantedDishesPage = false;
    $(".col-sm").empty();
    $(".img-container").removeClass("selected");
    $(".checkmark").remove();
  });
});