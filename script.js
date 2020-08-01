function getTitle() {

    var tmdbArr = [];
    var startYear = $("#start-year-input").val();
    var endYear = $("#end-year-input").val();
   
    if ($("#genre-input").val() == "Action") {

    var genreNum = 28;

    } else if ($("#genre-input").val() == "Adventure") {

    var genreNum = 12;

    } else if ($("#genre-input").val() == "Animated") {

    var genreNum = 16;

    } else if ($("#genre-input").val() == "Comedy") {

    var genreNum = 35;

    } else if ($("#genre-input").val() == "Crime") {

    var genreNum = 80;

    } else if ($("#genre-input").val() == "Documentary") {

    var genreNum = 99;

    } else if ($("#genre-input").val() == "Drama") {

    var genreNum = 18;

    } else if ($("#genre-input").val() == "Family") {

    var genreNum = 10751;

    } else if ($("#genre-input").val() == "Fantasy") {

    var genreNum = 14;

    } else if ($("#genre-input").val() == "History") {

    var genreNum = 36;

    } else if ($("#genre-input").val() == "Horror") {

    var genreNum = 27;

    } else if ($("#genre-input").val() == "Musical") {

    var genreNum = 10402;

    } else if ($("#genre-input").val() == "Mystery") {

    var genreNum = 9648;

    } else if ($("#genre-input").val() == "Romance") {

    var genreNum = 10749;

    } else if ($("#genre-input").val() == "Sci-Fi") {

    var genreNum = 878;

    } else if ($("#genre-input").val() == "Thriller") {

    var genreNum = 53;

    } else if ($("#genre-input").val() == "War") {

    var genreNum = 10752;

    } else {

    var genreNum = 12;

    }

    $.ajax({
        url: "https://api.themoviedb.org/3/discover/movie?api_key=183cf14b0fa970fabe87a2879d2f3aa1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&release_date.gte=1981-01-01&release_date.lte=1982-01-01&with_genres=80",
        method: "GET",
      }).then(function(response) {
        
        for (var i = 0; i < 1; i++) {

        getMovieDetails(response.results[i].title)


        }
    });

}

function getMovieDetails(title) {

    var param = $.param({
        t: title,
        plot: "short",
        apikey: "dadc91b3"
    });

    $.ajax({
        url:"https://www.omdbapi.com/?" + param,
        method: "GET", 
    }).then(function(movie) {

        console.log(movie);

    })
    
};

getTitle();



//SETUP Variables
//================================================
var authKey= "&key=AIzaSyAApQZVRRj-sNhF5LM9eZVQM8qOii5Orq4";

var cuisine= "";
var userCity= "";
var userState= "";
var radius= 0;

// URL Base
var queryURLBase = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";

//Functions
//================================================

function runQuery(rQueryURL){

  //AJAX Function
  $.ajax({
    url: rQueryURL,
    method: "GET"})
  // .done(function(placesData){
  //   console.log(rQueryURL);
  //   console.log(placesData);
  // })
  .then(function(placesData){
    for (var i=0; i<3; i++){
      var name = placesData.results[i].name;
      console.log(name);
    }
  })
};

//MAIN PROCESS
//================================================

$('#rest-btn').on('click', function(){

  //Get Cuisine
  var cuisine = $('#rest-cuisine').val();

  //Add Cuisine
  if (cuisine == "any"){
    var restURL = queryURLBase + "restaurants+in+"; 
  } else {
  var restURL = queryURLBase + cuisine + "+restaurants+in+";
  };

  //Get City
  var userCity = $('#rest-city').val().trim();

  //Add in the City
  var restURL = restURL + userCity;

  //Get State
  var userState = $('#rest-state').val();

  //Add in the State
  var restURL = restURL + "+" + userState;

  //Get Radius
  var radius = $('#rest-radius').val() * 1609;

  //Add in the radius
  var restURL = restURL + "&radius=" + radius

  //Add API Key
  var restURL = restURL + authKey;

  //Send the AJAX Call the newly assembled URL
  runQuery(restURL);
});



//1. Retrieve user inputs and convert to variables
//2. Use those variables to run an AJAX call to Google Places
//3. Break down the Google Places object into usable fields
//4. Dynamically generate html content
//5. Dealing with "edge cases" -- bugs or situations that are not intuitive

