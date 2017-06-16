/*
features to add:
- request links and photos as well
- get data out of json response.
- figure out best way to get ideal language for person
- get better default parameter.

Style:
-Add wikipedia icon in back
- When info is fetched, the search screen fades
and the search list is found.
- at the very top the search and random icons can be hovered
over to get search and get new subjects.
- fix reponsive resizing
- Get inspiration from codedoodl.es for UI ideas.
- error handler for subject not found

- see: https://www.mediawiki.org/wiki/API:Main_page#The_endpoint
*/

// iife module pattern to avoid polluting global namespace
(function(){
  // global variables
  var $subjectSearchField = $('#subject-name');
  var $subjectSearch = $('#subject-name').val();
  var $submitButton = $('#submitSearchButton');
  var $randomSearchButton = $('#randomSearchButton');
  // changes later with detection
  var language = 'en';

  // get results dock div
  var $resultsDock = $('#results-dock');

  // if location search needed,
  // get iffe function from weather app and place here
  // this is where query info goes.
  // insert query data here
  // https://www.youtube.com/watch?v=pn5eOoJF8bw
  // see at 10:12
  function processWikiData(data, status, xhr){
    // var pagesResults = $('<div id="pageResults"></div>');
    // $resultsDock.append(pagesResults);
    // console.log($resultsDock);
    console.log(data);
    console.log(data[0]);
    console.log(data[1]);
    console.log(data[2]);
    console.log(data[3]);
  }

  function makeJSONCall(endpointAddress, callback){
    callback = callback || function(x) { console.log(x); }
    $.ajax({
      url: endpointAddress,
      type: 'GET',
      dataType: "jsonp",
      contentType: 'json',
      success: callback,
      error: function () {
        console.log("Error retrieving search results, please refresh the page");
      }
    });
  }

  function randomSubjectPopulate(){
    var addressForRandomSubject = 'https://' + language + '.wikipedia.org/w/api.php?'
    + 'action=query'
    + '&prop=info'
    + '&inprop=url'
    + '&inprop=displaytitle'
    + '&list=random'
    + '&rnnamespace=0'
    + '&rnlimit=1'
    + '&rnfilterredir=nonredirects'
    + '&format=json'
    + '&origin=*';

    $.getJSON(addressForRandomSubject).done(function(x){
      var randomSubject = x.query.random[0].title;
      wikipediaQuery(randomSubject, processWikiData);
    });
  }

  // query API here- get info here
  function wikipediaQuery(subject){
    // convert string to percent encoding
    subject = encodeURIComponent(subject);
    // construct path
    var wikipediaEndPoint = 'https://' + language + '.wikipedia.org/w/api.php?'
    + 'action=query'
    + '&format=json'
    + '&prop=pageimages'
    + '&titles=' + subject;
    + '&piprop=thumbnail%7Cname'
    + '&pithumbsize=100';

    // better string search
    ///w/api.php?action=query&format=json&prop=pageimages%7Cinfo%7Cextracts&meta=&continue=gapcontinue%7C%7C&generator=allpages&piprop=thumbnail%7Cname&pithumbsize=60&inprop=url%7Cdisplaytitle&exsentences=3&exintro=1&explaintext=1&exsectionformat=plain&gapfrom=Allah&gapcontinue=Allah-Las&gapfilterredir=nonredirects

    // first attempt with open search, no pictures, would have to make 2 calls
    // this and then wait on the other call for images.
    // if no images then we can just use this
    // + 'action=opensearch'
    // + '&search=' + subject
    // + '&limit=25'
    // + '&format=json'
    // + '&callback=?';

    // when successful, search button allowed again
    $subjectSearchField.prop("disabled", false);

    // get data and do something with it
    makeJSONCall(wikipediaEndPoint, processWikiData);
  }

  function handleSearch(evt){
    // get value of subject name
    $subjectSearch = $('#subject-name').val();
    // if value is blank alert
    if($subjectSearch === ''){
      $subjectSearchField.css('background-color','rgba(255,215,0,0.3)');
    }
    else {
      $subjectSearchField.css('background-color','white');
      searchAction(evt);
    }
  }

function searchAction(evt){
    // disable search until we get data
    $subjectSearchField.prop("disabled", true);
    //query the subject- why did I do this?
    $subjectSearch = $('#subject-name').val();
    wikipediaQuery($subjectSearch);
  };

  // Run when search button clicked and new subject submitted
  $($submitButton).click(function(evt){
    handleSearch(evt);
  });

  $($randomSearchButton).click(function(evt){
    randomSubjectPopulate();
  });

// turn subjectSearchField to white on focus if not white
$($subjectSearchField).on('focus', function(evt) {
  if($subjectSearchField.css('background-color') === 'rgba(255, 215, 0, 0.3)'){
    $subjectSearchField.css('background-color', 'white');
  }
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
