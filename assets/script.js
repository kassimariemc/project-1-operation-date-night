
$(document).ready(function () {

  //RESTAURANT GENERATOR

  //SETUP Variables
  //================================================
  var authKey = "&key=AIzaSyAApQZVRRj-sNhF5LM9eZVQM8qOii5Orq4";

  // URL Base
  var queryURLBase = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=";

  //Functions
  //================================================

  function runQuery(rQueryURL) {

    //AJAX Function
    $.ajax({
      url: rQueryURL,
      method: "GET"
    })
      .then(function (placesData) {

        var j = Math.floor(Math.random() * (placesData.results.length - 4));

        // console.log(response.results.length + " is how many we have to choose from");
        for (var i = j; i < (j + 3); i++) {
          $(".restaurant-col").remove();
          getRestaurantDetails(placesData.results[i].place_id);
        }
      })
  };

  //Function to Call for restaurant Details
  function getRestaurantDetails(restaurant) {
    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + restaurant + "&fields=name,photo,formatted_address,url,website,rating,formatted_phone_number" + authKey,
      method: "GET"
    }).then(function (placesData2) {
      console.log(placesData2);

      //Restaurant Name
      var restaurantName = placesData2.result.name;
      var restaurantNameCard = $("<h4>").html(restaurantName).attr("class", "rest-title");

      //Restaurant Photo
      var restaurantPhotoCard = $("<img>").attr("src", "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + placesData2.result.photos[0].photo_reference + "&sensor=false&maxheight=200&maxwidth=200" + authKey)

      //Restaurant Address
      var restaurantAddress = placesData2.result.formatted_address;
      var restaurantAddressCard = $("<p>").html("Address: " + restaurantAddress).attr("class", "p-address");

      //Restaurant Number
      var restaurantPhone = placesData2.result.formatted_phone_number;
      var restaurantPhoneCard = $("<p>").html("Phone: " + restaurantPhone).attr("class", "p-phone");

      //Restaurant Rating
      var restaurantRating = placesData2.result.rating
      var restaurantRatingCard = $("<p>").html("Rating: " + restaurantRating + "/5").attr("class", "p-address");

      //Restaurant GoogleMaps Link      
      var restaurantMap = $("<a>").text("Google Maps").attr("href", placesData2.result.url).attr("target", "_blank");

      //Restaurant Website Link
      var restaurantURL = $("<a>").text("Restaurant Website").attr("href", placesData2.result.website).attr("target", "_blank");

      //Restaurant Cards
      var restaurantRow = $(".restaurant-row");
      var restaurantCol = $("<div>").attr("class", "col-lg-4 restaurant-col");
      var restaurantCard = $("<div>").attr("class", "card restaurant-card").attr("style", "height: 500px;");
      var restaurantCardHeader = $("<div>").attr("class", "card-header restaurant-card-header");
      var restaurantCardBody = $("<div>").attr("class", "card-body restaurant-card-body");

      restaurantRow.append(restaurantCol.append(restaurantCard));
      restaurantCard.append(restaurantCardHeader.append(restaurantNameCard));
      restaurantCard.append(restaurantCardBody);
      restaurantCardBody.append(restaurantPhotoCard, restaurantAddressCard, restaurantMap, restaurantPhoneCard, restaurantRatingCard, restaurantURL);

    });
  };

  //MAIN PROCESS
  //================================================

  $('#rest-btn').on('click', function () {

    //Get Cuisine
    var cuisine = $('#rest-cuisine').val();

    //Add Cuisine
    if (cuisine == "any") {
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
    console.log(restURL);
    //Send the AJAX Call the newly assembled URL
    runQuery(restURL);
  });




  //MOVIE GENERATOR
  $("#movie-btn").on("click", function findMovie() {

    // Assigning variables to our user-selected search criteria
    var startYear = $(".earliest-year-selector").val();
    var endYear = $(".latest-year-selector").val();
    var genre = $("#genre-input").val();


    // Ajax call to retrieve movie titles based off of above criteria (tmdb)
    $.ajax({
      url: "https://api.themoviedb.org/3/discover/movie?api_key=183cf14b0fa970fabe87a2879d2f3aa1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=" + startYear + "-01-01&primary_release_date.lte=" + endYear + "-12-31&with_genres=" + genre + "&with_original_language=en",
      method: "GET",
    }).then(function (response) {
      console.log(response.results);

      // Ensuring we do not always populate the top three results, allowing the user to search multiple times if the three titles that populate do not meet their needs

      var j = Math.floor(Math.random() * (response.results.length - 4));

      for (var i = j; i < (j + 3); i++) {

        console.log("We are starting at index " + j);

        var tmdbFullYear = response.results[i].release_date;
        var tmdbYearOnly = tmdbFullYear.substring(0, 4);
        var title = response.results[i].original_title;

        console.log("index " + i + " " + title + " is the tmdb title");
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
          url: "https://www.omdbapi.com/?" + param,
          method: "GET",
        }).then(function (movie) {

          console.log(movie);

          // Sometimes the movie in tmdb won't be in the omdb database, or its title will be in a format that omdb won't recognize and therefore will return the movie as undefined.  This conditional restarts the function should that happen so that three movies fully populate.  

          if (movie.Response === "False") {

            // console.log("Here is the tmdb one messing us up " + title);
            // console.log("And here is the omdb value which should say undefined" + movie.Title);
            findMovie();

          }

          console.log(movie.Title + " is the movie name in omdb");
          // Generating card elements for each movie chosen.
          var movieRow = $(".movie-row");
          var movieCol = $("<div>").attr("class", "col-lg-4 movie-col");
          var movieCard = $("<div>").attr("class", "card movie-card");
          var movieCardHeader = $("<div>").attr("class", "card-header movie-card-header");
          var movieCardBody = $("<div>").attr("class", "card-body movie-card-body")

          // We're going to make something like line 183 work for the above.  Thinking maybe just set the poster as the body and then on hover show the other p-tags??  Currently I can't format the image without also formatting the text, so it's not readable.

          // .css({"background-image":"url(" + movie.Poster + ")","background-size":"100%"});

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
          movieCardBody.append(movieRating, movieCast, moviePlot, movieTrailer, linkSeparator, movieStreams);

        })
      }
    });
  });





