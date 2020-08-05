//RESTAURANT GENERATOR

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
      console.log(placesData.results[0].name);
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


//MOVIE GENERATOR


$("#movie-btn").on("click", function () {

  // Assigning variables to our user-selected search criteria
  var startYear = $(".earliest-year-selector").val();
  var endYear = $(".latest-year-selector").val();
  var genre = $("#genre-input").val();
  
  // Ajax call to retrieve movie titles based off of above criteria (tmdb)
  $.ajax({
      url: "https://api.themoviedb.org/3/discover/movie?api_key=183cf14b0fa970fabe87a2879d2f3aa1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=" + startYear + "-01-01&primary_release_date.lte=" + endYear + "-12-31&with_genres=" + genre + "&with_original_language=en",
      method: "GET",
  }).then(function(response) {
  
      // Ensuring we do not always populate the top three results, allowing the user to search multiple times if the three titles that populate do not meet their needs

    var j = Math.floor(Math.random() * response.results.length - 4);

      // console.log(response.results.length + " is how many we have to choose from");
      for (var i = j; i < (j + 3); i++) {
        var tmdbFullYear = response.results[i].release_date;
        var tmdbYearOnly = tmdbFullYear.substring(0,4);
        var title = response.results[i].original_title;
      // console.log(response);
      // console.log("index " + i + " "  + title + " is the tmdb title");
      // Clearing out previous movies generated
        $(".movie-col").remove();

        // Setting parameters for second ajax call (omdb)
        var param = $.param({
          t: title,
          y: tmdbYearOnly,
          plot: "short",
          apikey: "dadc91b3"
        });
    
        $.ajax({
            url:"https://www.omdbapi.com/?" + param,
            method: "GET", 
        }).then(function(movie) {
    
          // console.log(movie.Title + " is the movie name in omdb");
          // Generating card elements for each movie chosen.
            var movieRow = $(".movie-row");
            var movieCol = $("<div>").attr("class", "col-lg-4 movie-col");
            var movieCard = $("<div>").attr("class", "card movie-card");
            var movieCardHeader = $("<div>").attr("class", "card-header movie-card-header");
            var movieCardBody = $("<div>").attr("class", "card-body movie-card-body");
            var movieName = $("<h4>").html(movie.Title).attr("class", "movie-title");
            var movieRating = $("<p>").html("Rated " + movie.Rated).attr("class", "p-rated");
            var movieCast = $("<p>").html("Starring | " + movie.Actors).attr("class", "p-cast");
            var moviePlot = $("<p>").html(movie.Plot).attr("class", "p-plot");
            var movieTrailer = $("<a>").attr("href", "https://www.youtube.com/results?search_query=" + movie.Title + "+trailer").attr("target", "_blank").html("View trailers here");
            var linkSeparator = $("<div>");
            var movieStreams = $("<a>").attr("href", "https://www.justwatch.com/us/search?q=" + movie.Title).attr("target", "_blank").html("Where to find it");
    
            movieRow.append(movieCol.append(movieCard));
            movieCard.append(movieCardHeader.append(movieName));
            movieCard.append(movieCardBody);
            movieCardBody.append(movieRating);
            movieCardBody.append(movieCast);
            movieCardBody.append(moviePlot);
            movieCardBody.append(movieTrailer);
            movieCardBody.append(linkSeparator);
            movieCardBody.append(movieStreams);
    
    
          
          })
        }
      });
});





