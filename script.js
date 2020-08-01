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