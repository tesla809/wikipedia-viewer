/*
features to add:
- re name variables to match task.
- figure out best way to get ideal language for person
- add api search from wikipedia
- add functionality to random search
- add styling to random search.
- When info is fetched, the search screen fades
and the search list is found.
- at the very top the search and random icons can be hovered
over to get search and get new subjects.
- Get inspiration from codedoodl.es for UI ideas.
- modularize and turn into anonymous functions
- error handler for subject not found
*/

// global variables
var $subjectSearchField = $('#subject-name');
var $subjectSearch = $('#subject-name').val();
var $submitButton = $('#submit');
// changes later with detection
var language = 'en';
// if location search needed,
// get iffe function from weather app
// and place here

// query API here- get info here
function wikipediaQuery(subject){
  var wikipediaAPI = '...';
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
  // console.log()
}

var searchAction = function(evt){
  // disable search until we get data
  $subjectSearchField.prop("disabled", true);

  //query the subject- why did I do this?
  $subjectSearch = $('#subject-name').val();
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
