/*
features to add:
- re name variables to match task.
- figure out best way to get ideal language for person
- add api search from wikipedia
- add functionality to random search
- add styling to random search.
- Get inspiration from codedoodl.es for UI ideas.
- modularize and turn into anonymous functions
- error handler for subject not found
*/

// global variables
var $subjectSearchField = $('#city-name');
var $subjectSearch = $('#city-name').val();
var $submitButton = $('#submit');

// anon function to find location
// use this to determine language.
(function(){
  // one method of finding current location based on IP
  var findLocation = function(){
  // location address API
  // corsorigin.me to get around CORS issues in codepen
  var getLocationAPI = 'http://ipinfo.io';
  // success callback
  function locationSuccess(data){
    var location = data.city.toString() + ", " + data.country.toString();
    // add location to field
    $subjectSearchField.val(location);
  }
  // actual JSON call
  $.getJSON(getLocationAPI,locationSuccess);
}; // end findLocation

// gets location and weather of current location
var currentLocation = findLocation();
currentLocal = currentLocation;

// Calls for location
wikipediaQuery(currentLocation);
})();

// query API here- get info here
function wikipediaQuery(subject){
  var wikipediaAPI = 'http://api.openweathermap.org/data/2.5/weather?';
  var subjectLookup = "q=" + subject;
  var apiKey = "&APPID=...";
  var wikipediaPath = wikipediaAPI + subjectLookup + apiKey;

  // when successful, search button allowed again
  // $subjectSearchField.prop("disabled", false);
}


// this is where query info goes.
// insert query data here
function populateData(){
  // ...
}

var searchAction = function(evt){
  // disable search until we get data
  $subjectSearchField.prop("disabled", true);

  //query the subject
  $subjectSearch = $('#city-name').val();
  wwikipediaQuery($subjectSearch);
};
// Run when go clicked and new location submitted
$($submitButton).click(function(evt){
  searchAction(evt);
});

$($subjectSearchField).on('keyup keypress', function(evt) {
  var keyCode = evt.keyCode || evt.which;
  if (keyCode === 13) {
    evt.preventDefault();
    searchAction(evt);
    return false;
  }
});

// background chanage based on weather
