'use strict';

var openweathermapapiurl = "http://api.openweathermap.org/data/2.5/weather";
var coordinatesquery = "lat=lat_val&lon=lon_val";
var appid = "appid=0596fe0573fa9daa94c2912e5e383ed3";

var tempcelsiusrounded;
var tempfahrenheitrounded;

if (typeof(Storage) !== "undefined") {
  // browser supports Session Storage
  if (sessionStorage.latitude && sessionStorage.longitude) {
    var latitude = sessionStorage.getItem('latitude');
    var longitude = sessionStorage.getItem('longitude');
    dataHandler(latitude, longitude);

  } else {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        // Breitengrad
        var latitude = position.coords.latitude;
        sessionStorage.setItem('latitude', latitude);

        // Längengrad
        var longitude = position.coords.longitude;
        sessionStorage.setItem('longitude', longitude);

        dataHandler(latitude, longitude);
      });

    }
  }
}

function dataHandler(latitude, longitude) {

  coordinatesquery = "lat=" + latitude + "&lon=" + longitude;

  $.getJSON(openweathermapapiurl + "?" + coordinatesquery + "&" + appid, function(data) {

    var locationname = data.name;
    locationname = locationname.split(/[\/|,|-]/)[0];

    var tempkelvin = data.main.temp;
    var tempcelsius = tempkelvin - 273.15;
    tempcelsiusrounded = parseFloat(tempcelsius).toFixed(1);
    var tempfahrenheit = (tempkelvin * 9 / 5) - 459.67;
    tempfahrenheitrounded = parseFloat(tempfahrenheit).toFixed(1);

    $(".celsius").text(tempcelsiusrounded + " °C");
    $(".place").text(locationname.toUpperCase());

    var humidity = data.main.humidity;
    var windspeed = data.wind.speed;

    $(".humidity-output").text(humidity + " %");
    $(".windspeed-output").text(windspeed + " m/s");

    var icon = data.weather[0].icon;
    var appicon;
    var paddingToAdd;
    var paddingValue;

    switch (icon) {

      case "01d":
        appicon = "wi-day-sunny";
        break;

      case "01n":
        appicon = "wi-night-clear";
        paddingToAdd = "padding-top";
        paddingValue = "7.5px";
        break;

      case "02d":
        appicon = "wi-day-cloudy";
        paddingToAdd = "padding-top";
        paddingValue = "22.5px";
        break;

      case "02n":
        appicon = "wi-night-alt-cloudy";
        paddingToAdd = "padding-top";
        paddingValue = "10px";
        break;

      case "03d":
        appicon = "wi-cloud";
        break;

      case "03n":
        appicon = "wi-cloud";
        break;

      case "04d":
        appicon = "wi-cloudy";
        paddingToAdd = "padding-top";
        paddingValue = "5px";
        break;

      case "04n":
        appicon = "wi-cloudy";
        paddingToAdd = "padding-top";
        paddingValue = "5px";
        break;

      case "09d":
        appicon = "wi-rain";
        paddingToAdd = "padding-bottom";
        paddingValue = "20px";
        break;

      case "09n":
        appicon = "wi-rain";
        paddingToAdd = "padding-bottom";
        paddingValue = "20px";
        break;

      case "10d":
        appicon = "wi-day-rain";
        paddingToAdd = "padding-top";
        paddingValue = "5px";
        break;

      case "10n":
        appicon = "wi-night-alt-rain";
        paddingToAdd = "padding-bottom";
        paddingValue = "15px";
        break;

      case "11d":
        appicon = "wi-thunderstorm";
        paddingToAdd = "padding-bottom";
        paddingValue = "22.5px";
        break;

      case "11n":
        appicon = "wi-thunderstorm";
        paddingToAdd = "padding-bottom";
        paddingValue = "22.5px";
        break;

      case "13d":
        appicon = "wi-day-snow";
        paddingToAdd = "padding-top";
        paddingValue = "6.25px";
        break;

      case "13n":
        appicon = "wi-night-snow";
        paddingToAdd = "padding-bottom";
        paddingValue = "17.5px";
        break;

      case "50d":
        appicon = "wi-fog";
        paddingToAdd = "padding-bottom";
        paddingValue = "15px";
        break;

      case "50n":
        appicon = "wi-fog";
        paddingToAdd = "padding-bottom";
        paddingValue = "15px";
        break;
    }

    if (appicon) {

      removeAllWeatherIconClasses();
      $(".weather-symbol").addClass(appicon);
      if (paddingToAdd && paddingValue) {
        $(".weather-symbol").css(paddingToAdd, paddingValue);
      }

      var description = data.weather[0].description;
      if (description) {
        $(".weather-symbol").attr("title", description);
        $(".weather-symbol").on("mouseover", function() {
          $(this).css("cursor", "help");
        });
      }
    } else {
      failData();
    }
  });
}

function failData() {
  $(".humidity-output, .windspeed-output, .celsius, .place").text("N/A");
  removeAllWeatherIconClasses();
  $(".weather-symbol").addClass("wi-na");
}

function removeAllWeatherIconClasses() {
  $(".weather-symbol").removeClass(function(index, css) {
    return (css.match(/(^|\s)wi-\S+/g) || []).join(' ');
  });
}

$(".celsius").click(function() {
  if (tempfahrenheitrounded && tempcelsiusrounded) {

    if ($(".celsius").text().substring($(".celsius").text().length - 2, $(".celsius").text().length) == "°C") {
      $(".celsius").text(tempfahrenheitrounded + " °F");
    } else {
      $(".celsius").text(tempcelsiusrounded + " °C");
    }
  }
});
