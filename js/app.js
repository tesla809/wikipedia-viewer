/*
features to add:
- create div for output
- get default image for non image articles.
- figure out best way to get ideal language for person
- get better default parameter.
- add easter eggs inside of random search like lil ski mask goof.

Style:
- style of div is like google's suggested location on maps like this:
https://www.google.com/search?q=ice+cream&oq=ice+cream
-when hover it gets a bit darker
- underline display
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
    // data
    var results = data.query.pages;
    var resultsKeysArr = Object.keys(results);
    var articleMetaInfo;
    var article = {
      link: null,
      title: null,
      summary: null,
      image: {
        source: null,
        width: null,
        height: null
      }
    }

    function createResultsDiv(obj, i){
      // elements
      var finalResultsDiv;

      var resultHolderDiv;
      var articleAnchorTag;
      var articleLinkContainerDiv;
      var articleImageContainerDiv;
      var articleImageImgTag;
      var articleTextContainerDiv;
      var articleTitleH5Tag;
      var articleDescriptionPTag;

      return finalResultDiv;
    }

    // everything links
    // then info is added
    // then that div is added to main results div
    // if error occurs, then copy to new variable before adding

    console.log(results);

    for (var i = 0; i < resultsKeysArr.length; i++){
      articleMetaInfo = results[resultsKeysArr[i]];
      article.link = articleMetaInfo.canonicalurl;
      article.title = articleMetaInfo.title;
      article.summary = articleMetaInfo.extract;
      console.log(articleMetaInfo);
      console.log(article.link);
      console.log(article.title);
      console.log(article.summary);

      // check if has image and output images.
      if (articleMetaInfo.hasOwnProperty('original')){
        article.image.source = articleMetaInfo.original.source;
        article.image.height = articleMetaInfo.original.height;
        article.image.width = articleMetaInfo.original.width;

        console.log(article.image.source);
        console.log(article.image.height);
        console.log(article.image.width);
        // pass in to createResultsDiv function
      } else {
        // add default image
        // ...
        // pass in to createResultsDiv function
      }
    }
    // note that if variables declared here,
    // they are still hoisted to top of function
    // because we used var keyword.
    // but because we want to avoid impression to people of other language
    // that they don't, we write it like this.
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
    + '%7Cinfo%7Cextracts'
    + '&meta=&continue=gapcontinue%7C%7C'
    + '&generator=allpages'
    + '&utf8=1'
    + '&piprop=name%7Coriginal'
    + '&pithumbsize=100'
    + '&inprop=url%7Cdisplaytitle'
    + '&exsentences=3'
    + '&exintro=1'
    + '&explaintext=1'
    + '&exsectionformat=plain'
    + '&gapfrom=' + subject
    + '&gapfilterredir=nonredirects'
    + '&gaplimit=25';

// /w/api.php?action=query&format=json&prop=pageimages%7Cinfo%7Cextracts&continue=gapcontinue%7C%7C&generator=allpages&utf8=1&piprop=name%7Coriginal&inprop=url%7Cdisplaytitle&exsentences=3&exintro=1&explaintext=1&exsectionformat=wiki&gapfrom=Allah&gapcontinue=Allah-Las&gapfilterredir=nonredirects&gaplimit=10

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

    // to json
    var strin = wikipediaEndPoint;
    console.log(strin);
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
    //query the subject- get value when searched.
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
