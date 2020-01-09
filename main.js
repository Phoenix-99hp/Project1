$(document).ready(function () {
    $('.sidenav').sidenav();
});

$("#city-search").on("click", function (event) {
    $(".weather-days").remove();
    event.preventDefault();
    $(".event-content").empty();
    var city = $("#city").val().trim();

    var startMonthQuery = $("#startDate").val().trim().slice(0, 2);
    var startDayQuery = $("#startDate").val().trim().slice(3, 5);
    var startYearQuery = $("#startDate").val().trim().slice(6);
    var endMonthQuery = $("#endDate").val().trim().slice(0, 2);
    var endDayQuery = $("#endDate").val().trim().slice(3, 5);
    var endYearQuery = $("#endDate").val().trim().slice(6);

    var startDateQuery = (startYearQuery + "-" + startMonthQuery + "-" + startDayQuery + "T00:00:00Z");
    var endDateQuery = (endYearQuery + "-" + endMonthQuery + "-" + endDayQuery + "T23:59:59Z");

    var queryURL = "https://app.ticketmaster.com/discovery/v2/events?apikey=WJBXz9pjG5TmRa7XUYBxAoBwsZnR4TZT&locale=*" + "&startDateTime=" + startDateQuery + "&endDateTime=" + endDateQuery + "&city=" + city + "&sort=date,asc";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        for (var i = 0; i < response._embedded.events.length; i++) {
            if (response._embedded.events[i].name == "No Longer on Sale for Web") { continue; }
            else if ($(".listing").length < 5) {
                var newListing = $("<div>").addClass("listing");
                var newImage = $("<img>").addClass("image");
                var newLink = $("<a>").addClass("link");
                var newDate = $("<p>").addClass("eventDate");

                newLink.text(response._embedded.events[i].name);
                newImage.attr("src", response._embedded.events[i].images[0].url).css(
                    "width", "100%");
                newLink.attr("href", response._embedded.events[i].url);
                var dateResponse = response._embedded.events[i].dates.start.localDate;
                var year = dateResponse.slice(0, 4);
                var month = dateResponse.slice(5, 7);
                var day = dateResponse.slice(8);

                newDate.text(month + "-" + day + "-" + year);
                newListing.append(newLink);
                newListing.append(newDate);
                newListing.append(newImage);
                $(".event-content").append(newListing);
            }
            else if (($(".listing").length >= 5)) {
                break;
            }
        }
    })

    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=83ec25aafa25787879adb49e8ad70c00&units=imperial";

    // Ajax call for the forecasted weather
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(forecastURL);
        console.log(response);

        // Declares generateForecast function with arguments day, time, endtime
        function generateForecast(day, startTime, endTime) {
            // Maxtemp array initialized to 0
            maxTemp = [];
            // Weather status initialized to a time in the middle of the day
            weatherStatus = response.list[startTime + 4].weather[0].main;
            // Determines the HTML of each div made for the forecast
            html =
                `<li class="weather-days">
            <h5 id="day${day}"></h5>
            <i id="day${day}-icon"></i>
            <p id="day${day}-temp">Temp: </p>
            </li>`;
            // Appends the HTML to the forecast-divs div
            $("#slide-out").append(html);

            // Main for-loop
            for (i = startTime; i < endTime; i++) {
                // Pushes max temperatures for every three hours to the maxTemp array
                maxTemp.push(Math.floor(response.list[i].main.temp_max));
            }
            // Sets the day temperature text to the maximum temperature in the maxTemp array
            $(`#day${day}-temp`).text(Math.max.apply(Math, maxTemp) + "°F");
            // Sets the date of the div
            $(`#day${day}`).text(moment().add(day, 'days').format("l"));
            // Calls the determineIcon function to determine which icon to use for the day's weather status
            determineIcon(weatherStatus, day);


        }
        // Calls the function for each day
        generateForecast(1, 0, 8);
        generateForecast(2, 9, 16);
        generateForecast(3, 17, 24);
        generateForecast(4, 25, 32);
        generateForecast(5, 33, 40);

        // Determines the weather icon for the forecasted divs depending on the weather status returned in the response
        function determineIcon(weatherStatus, day) {
            if (weatherStatus == "Clear") {
                $(`#day${day}-icon`).addClass("fas fa-sun");
            }
            else if (weatherStatus == "Thunderstorm") {
                $(`#day${day}-icon`).addClass("fas fa-bolt");
            }
            else if (weatherStatus == "Drizzle") {
                $(`#day${day}-icon`).addClass("fas fa-cloud-rain");
            }
            else if (weatherStatus == "Rain") {
                $(`#day${day}-icon`).addClass("fas fa-cloud-showers-heavy");
            }
            else if (weatherStatus == "Snow") {
                $(`#day${day}-icon`).addClass("fas fa-snowflake");
            }
            else if (weatherStatus == "Clouds") {
                $(`#day${day}-icon`).addClass("fas fa-cloud");
            }
            else {
                $(`#day${day}-icon`).addClass("fas fa-water");
            }

        }
    })
});

