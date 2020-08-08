
$(document).ready(function () {

//_________________________________________________________________
//RESTAURANT GENERATOR

  // ______________________________________________________________
  // Variables for url for ajax call

  // API Key
  var authKey = "&key=AIzaSyAApQZVRRj-sNhF5LM9eZVQM8qOii5Orq4";

  // URL Base
  var queryURLBase = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=";

  // ______________________________________________________________
  // Function to generate restaurants
  function runQuery(rQueryURL) {

    // Loading Animation
    var loadingEl = $("<div>").attr("class", "loading-dots");
    var loadingH1 = $("<h1>").text("Loading");
    var loadingDot1 = $("<h1>").text(".").attr("class", "dot one");
    var loadingDot2 = $("<h1>").text(".").attr("class", "dot two");
    var loadingDot3 = $("<h1>").text(".").attr("class", "dot three");
    $(".restaurant-row").prepend(loadingEl);
    loadingEl.append(loadingH1, loadingDot1, loadingDot2, loadingDot3);


    //AJAX Function to get restaurants
    $.ajax({
      url: rQueryURL,
      method: "GET"
    })
      .then(function (placesData) {

        var restIDS = [];
        console.log(rQueryURL);


        console.log("Here are our places " + placesData);
 
        if (placesData.status == "ZERO_RESULTS") {
          $(".restaurant-error-box").css("display", "block").text("Oops!  Please check above fields for spelling errors.")

        } else {

          for (var i = 0; i < placesData.results.length; i++) {
            if (placesData.results[i].business_status === "OPERATIONAL") {
              restIDS.push(placesData.results[i].place_id);
            }
          }

          var restNextPageURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + placesData.next_page_token + authKey;

          setTimeout(() => { $.ajax({
            url: restNextPageURL,
            method: "GET"
          }).then(function (placesDataNextPage) {
            for (var i = 0; i < placesDataNextPage.results.length; i++) {
              if (placesDataNextPage.results[i].business_status === "OPERATIONAL") {
                restIDS.push(placesDataNextPage.results[i].place_id);
              }
            }
          })
          // Empty loading animation
          $(".restaurant-row").empty();

          // Randomize generator
          var j = Math.floor(Math.random() * (restIDS.length - 3));
          for (var i = j; i < (j + 3); i++) {
            // Empty previous generated restaurants
            $(".restaurant-col").remove();
    
            getRestaurantDetails(restIDS[i]);
          }; }, 1500);
        };
      });
  };

  // ______________________________________________________________
  //Function to Call for restaurant Details

  function getRestaurantDetails(restaurant) {
    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + restaurant + "&fields=name,photo,formatted_address,url,website,rating,formatted_phone_number,opening_hours" + authKey,
      method: "GET"
    }).then(function (placesData2) {
      console.log(placesData2);
      //Restaurant Name & Element
      var restaurantName = placesData2.result.name;
      var restaurantNameCard = $("<h4>").html(restaurantName).attr("class", "rest-title");

      //Restaurant Photo & Element
      var restaurantPhoto = $("<img>").attr("src", "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + placesData2.result.photos[0].photo_reference + "&sensor=false&maxheight=200&maxwidth=200" + authKey).css("display", "block");

      //Restaurant Address & Element
      var restaurantAddress = placesData2.result.formatted_address;
      var restaurantAddressCard = $("<p>").html(restaurantAddress).attr("class", "p-address");

      //Restaurant GoogleMaps Link      
      var restaurantMap = $("<a>").html("Google Maps").attr("href", placesData2.result.url).attr("target", "_blank").attr("class", "p-maps");

      //Restaurant Number & Element
      var restaurantPhone = placesData2.result.formatted_phone_number;
      var restaurantPhoneCard = $("<p>").html(restaurantPhone).attr("class", "p-phone");

      //Restaurant Rating & Element
      var restaurantRating = placesData2.result.rating
      var restaurantRatingCard = $("<p>").html("Rating: " + restaurantRating + "/5").attr("class", "p-address");

      //Restaurant GoogleMaps Link & Element     
      var restaurantMap = $("<a>").text("Google Maps").attr("href", placesData2.result.url).attr("target", "_blank");

      //Restaurant Website Link & Element
      var restaurantURL = $("<a>").text("Restaurant Website").attr("href", placesData2.result.website).attr("target", "_blank");

      //Restaurant Cards & Elements
      var restaurantRow = $(".restaurant-row");
      var restaurantCol = $("<div>").attr("class", "col-lg-4 restaurant-col");
      var restaurantCard = $("<div>").attr("class", "card restaurant-card");
      var restaurantCardHeader = $("<div>").attr("class", "card-header restaurant-card-header");
      var restaurantCardBody = $("<div>").attr("class", "card-body restaurant-card-body overflow-auto");

      // Appending the restaurant cards above to the page
      restaurantRow.append(restaurantCol.append(restaurantCard));
      restaurantCard.append(restaurantCardHeader.append(restaurantNameCard));
      restaurantCard.append(restaurantCardBody);
      var restaurantRow1 = $("<div>").attr("class", "row justify-content-between");
      restaurantCardBody.append(restaurantRow1);
      var restaurantPhotoEl = $("<div>").addClass("class", "col-sm-5 offset-sm-2 col-md-6 offset-md-0");
      var restaurantHoursEl = $("<div>").addClass("class", "col-sm-5 offset-sm-2 col-md-6 offset-md-0");
      restaurantRow1.append(restaurantPhotoEl, restaurantHoursEl);
      restaurantPhotoEl.append(restaurantPhoto);
      //Restaurant Hours
      var restaurantHours = placesData2.result.opening_hours.weekday_text;
      for (var i = 0; i < restaurantHours.length; i++) {
        var restaurantHoursCard = $("<p>").html(restaurantHours[i]).attr("class", "rest-hours");
        restaurantHoursEl.append(restaurantHoursCard);
      }
      restaurantCardBody.append(restaurantPhoneCard, restaurantAddressCard, restaurantMap, restaurantRatingCard, restaurantURL);

      var scrollBtnR = $(".scroll-btnR")
      $(scrollBtnR).removeClass("hidden");
    });
  };

  //col-sm-12 col-md-6 col-lg-12

  // ______________________________________________________________
  // Main Function when the "Get Restaurant" button is clicked
  $('#rest-btn').on('click', function () {

    //Get Cuisine
    var cuisine = $('#rest-cuisine').val();

    //Add Cuisine, with an option to search for any type or a specified one.
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
    var userState = $('#rest-state').val().trim();
    //Add in the State
    var restURL = restURL + "+" + userState;
    //Get Radius
    var radius = $('#rest-radius').val() * 1609;
    //Add in the radius
    var restURL = restURL + "&radius=" + radius;
    //Add API Key
    var restURL = restURL + authKey;

    var states = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "dc", "fl", "ga", "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "my", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy"];
    ///Conditions for input error
    if (userCity == "") {
      $(".restaurant-error-box").css("display", "block").text("Oops!  Please enter a city.")
    } else if (userState == "") {

      $(".restaurant-error-box").css("display", "block").text("Oops!  Please enter a state.")
    }
    else if (states.indexOf(userState.toLowerCase()) == -1) {
      $(".restaurant-error-box").css("display", "block").text("Oops!  Please enter the abbreviation for your state. Example: North Carolina - NC")
    }
    else if (cuisine == "choose") {
      $(".restaurant-error-box").css("display", "block").text("Oops!  Please choose a cuisine.")
    } else {
      $(".restaurant-error-box").css("display", "none")
      //Send the AJAX Call the newly assembled URL
      runQuery(restURL);
  
    };
  });

  // ______________________________________________________________
  //MOVIE GENERATOR

  $("#movie-btn").on("click", function findMovie() {

    $("h5").remove();
  // ______________________________________________________________
  // Assigning variables to our user-selected search criteria:

    // Earliest year to show
    var startYear = $(".earliest-year-selector").val().trim();
    // Latest year to show
    var endYear = $(".latest-year-selector").val().trim();
    // User genre selection
    var genre = $("#genre-input").val();

  // ______________________________________________________________
  // Testing validity of user entries:

    // Ensures genre is selected from the drop-down
  if (genre == "Choose...") {
    $(".movie-error-box").css("display", "block").text("Oops!  Please choose a genre.")
    // Ensures a date isn't selected too far in the past or in the future
  } else if (startYear > 2020 || startYear < 1900 || endYear < 1900 || endYear > 2020) {
    $(".movie-error-box").css("display", "block").text("Oops!  Please choose a start and end year between 1900 and 2020.")
    // Ensures the start date isn't later than the end date
  } else if (startYear > endYear) {
    $(".movie-error-box").css("display", "block").text("Oops!  Please choose a starting year earlier than or equal to the ending year.")
    // Ensures the date parameters are numbers
  } else if (parseInt(startYear) != startYear || parseInt(endYear) != endYear) {
    $(".movie-error-box").css("display", "block").text("Oops!  Your start and end year must be a four-digit number.")
    // All clear to proceed with the search
  } else {
    $(".movie-error-box").css("display", "none");

  // ______________________________________________________________
  // Main process to retrieve three movie names from TMDB

      // Ajax call to retrieve movie titles based off of above criteria (tmdb)
      $.ajax({
        url: "https://api.themoviedb.org/3/discover/movie?api_key=183cf14b0fa970fabe87a2879d2f3aa1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=" + startYear + "-01-01&primary_release_date.lte=" + endYear + "-12-31&with_genres=" + genre + "&with_original_language=en",
        method: "GET",
      }).then(function (response) {

        // Ensuring we do not always populate the top three results, allowing the user to search multiple times if the three titles that populate do not meet their needs
        var j = Math.floor(Math.random() * (response.results.length - 3));

        for (var i = j; i < (j + 3); i++) {
          // Retrieving the release date of the movie (YYYY-MM-DD)
          var tmdbFullYear = response.results[i].release_date;
          // Converting the above date to only a 4-digit year, this is how our next AJAX search syntax is read
          var tmdbYearOnly = tmdbFullYear.substring(0, 4);
          // Retrieving the movie title
          var title = response.results[i].original_title;
          // Clearing out previous movies generated
          $(".movie-col").remove();

  // ______________________________________________________________
  // With the movie name and release year retrieved, we are now ready to plug these values into an ajax call from OMDB that will give us more info about the movie

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

            // Sometimes the movie in tmdb won't be in the omdb database, or its title will be in a format that omdb won't recognize and therefore will return the movie as undefined.  This conditional restarts the function should that happen so that three movies fully populate.  
            if (movie.Response === "False") {
              findMovie();
            }

  // ______________________________________________________________
  // Generating dynamic elements for each movie chosen.
            
            // Variable for the movie row existing in the HTML
            var movieRow = $(".movie-row");
            // Creating a column within the movie row
            var movieCol = $("<div>").attr("class", "col-lg-4 movie-col");
            // Creating a Bootstrap card within the column
            var movieCard = $("<div>").attr("class", "card movie-card ");
            // Movie Poster which will be overlaid on top of the body initially
            var moviePoster = $("<img>").attr({"src":movie.Poster,"class":"movie-poster"});
            // Body of the card, where the movie info will be
            var movieCardBody = $("<div>").attr("class", "card-body movie-card-body");        
            // Movie Name element
            var movieName = $("<h4>").html(movie.Title).attr("class", "movie-title");
            // Movie's MPAA rating
            var movieRating = $("<p>").html("Rated " + movie.Rated).attr("class", "p-rated");
            // Movie cast
            var movieCast = $("<p>").html("Starring | " + movie.Actors).attr("class", "p-cast");
            // A short plot of the movie
            var moviePlot = $("<p>").html(movie.Plot).attr("class", "p-plot");
            // A link to the youtube search results for the movie trailer
            var movieTrailer = $("<a>").attr("href", "https://www.youtube.com/results?search_query=" + movie.Title + "+trailer").attr("target", "_blank").html("View trailers here");

            var linkSeparator = $("<div>");

            // A link to the justwatch search results showing movie availability on various platforms
            var movieStreams = $("<a>").attr("href", "https://www.justwatch.com/us/search?q=" + movie.Title).attr("target", "_blank").html("Where and how to watch it");
            // Text informing the user to tap or hover
            
            

            // Appending each movie
            movieRow.append(movieCol.append(movieCard));       
            movieCard.append(movieCardBody, moviePoster);
            movieCardBody.append(movieName, movieRating, movieCast, moviePlot, movieTrailer, linkSeparator, movieStreams);
            

          })
        }
        var viewInstructions = $("<h5>").attr("class", "view-instructions").html("Tap or hover over your movie poster to see details!");
        $(".col-movie-text").append(viewInstructions);

      });
    }
  });
});




