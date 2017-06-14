/*
features to add:
- add api search from wikipedia
- get data out of json response.
- figure out best way to get ideal language for person
- add functionality to random search
- add styling to random search.
- When info is fetched, the search screen fades
and the search list is found.
- at the very top the search and random icons can be hovered
over to get search and get new subjects.
- fix reponsive resizing
- Get inspiration from codedoodl.es for UI ideas.
- modularize and turn into anonymous functions
- error handler for subject not found

- see: https://www.mediawiki.org/wiki/API:Main_page#The_endpoint
*/

// iife module pattern to avoid polluting global namespace
(function(){
  // global variables
  var $subjectSearchField = $('#subject-name');
  var $subjectSearch = $('#subject-name').val();
  var $submitButton = $('#submit');
  // changes later with detection
  var language = 'en';

  // if location search needed,
  // get iffe function from weather app
  // and place here

  // this is where query info goes.
  // insert query data here
  // https://www.youtube.com/watch?v=pn5eOoJF8bw
  // see at 10:12
  function processWikiData(data, status, xhr){
    var actualData = data;
    console.log(actualData.query.pages);
  }

  // query API here- get info here
  function wikipediaQuery(subject){
    // convert string to percent encoding
    subject = encodeURIComponent(subject);
    // construct path
    var wikipediaEndPoint = 'https://' + language + '.wikipedia.org/w/api.php?';
    var action = 'action=query';
    var subjectLookup = "&titles=" + subject;
    var prop = '&prop=revisions';
    var rvProp = '&rvprop=content';
    var format = '&format=json';
    var origin = '&origin=*';
    var wikipediaPath = wikipediaEndPoint + action + subjectLookup
                        + prop + format + rvProp + format + origin;

    // when successful, search button allowed again
    $subjectSearchField.prop("disabled", false);

    // get data and display it in console.log
    console.log(wikipediaPath);

    // get data and do something with it
    $.getJSON(wikipediaPath, processWikiData);
  }

  var searchAction = function(evt){
    // disable search until we get data
    $subjectSearchField.prop("disabled", true);

    //query the subject- why did I do this?
    $subjectSearch = $('#subject-name').val();
    wikipediaQuery($subjectSearch);
  };
  // Run when go clicked and new location submitted
  $($submitButton).click(function(evt){
    searchAction(evt);
  });

  // Press Enter button for search
  $($subjectSearchField).on('keyup keypress', function(evt) {
    var keyCode = evt.keyCode || evt.which;
    if (keyCode === 13) {
      evt.preventDefault();
      searchAction(evt);
      return false;
    }
  });
}());
