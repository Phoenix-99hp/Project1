var city = "Austin";
var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?" + "city=" + city + "&apikey=WJBXz9pjG5TmRa7XUYBxAoBwsZnR4TZT";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
})

$("#city-search").on("click", function (event) {
    $(".weather-days").remove();
    event.preventDefault();
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=83ec25aafa25787879adb49e8ad70c00&units=imperial";
})