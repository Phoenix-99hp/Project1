var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=WJBXz9pjG5TmRa7XUYBxAoBwsZnR4TZT";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
})


