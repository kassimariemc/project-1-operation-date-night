

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


