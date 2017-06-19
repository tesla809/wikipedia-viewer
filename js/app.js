/*
features to add:
- margin space at the end of results dock
- clear last results when searching for new results
- fix css when limited info in paragraph is there it centers
- add more space between text and images
- Add funny things inside of random search, aka lil ski mask
- get default image for non image articles.
- see if all images have thumbnail verison to reduce loading time of big pics
- figure out best way to get ideal language for person
- get better default parameter.
- add easter eggs inside of random search like lil ski mask goof.
- refactor everything to react

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

    function createResultsDiv(articleObj, i){
      // elements
      var $resultHolderDiv = $("<div/>", {
        id: "result-holder-" + i
      });
      var $articleAnchorTag = $("<a></a>", {
        href: articleObj.link
      });
      var $articleLinkContainerDiv = $("<div/>", {
        class: "article-link-container"
      });
      var $articleImageContainerDiv = $("<div/>", {
        class: "article-image-container"
      });
      var $articleImageImgTag = $("<img />",{
        src: articleObj.image.source,
        class: "article-image"
      });
      var $articleTextContainerDiv = $("<div/>", {
        class: "article-text-container"
      });
      var $articleTitleH5Tag = $("<h5></h5>", {
        text: articleObj.title,
        class: "article-title"
      });
      var $articleDescriptionPTag = $("<p></p>",{
        text: articleObj.summary,
        class: "article-description"
      });

      $resultHolderDiv.append($articleAnchorTag);
      $articleAnchorTag.append($articleLinkContainerDiv);
      $articleLinkContainerDiv.append($articleImageContainerDiv);
      $articleImageContainerDiv.append($articleImageImgTag);
      $articleLinkContainerDiv.append($articleTextContainerDiv);
      $articleTextContainerDiv.append($articleTitleH5Tag);
      $articleTextContainerDiv.append($articleDescriptionPTag);

      console.log($resultHolderDiv);
      return $resultHolderDiv;
    }

    for (var i = 0; i < resultsKeysArr.length; i++){
      articleMetaInfo = results[resultsKeysArr[i]];
      article.link = articleMetaInfo.canonicalurl;
      article.title = articleMetaInfo.title;
      article.summary = articleMetaInfo.extract;
      console.log(articleMetaInfo);

      // check if has image and output.
      if (articleMetaInfo.hasOwnProperty('original')){
        article.image.source = articleMetaInfo.original.source;
        article.image.height = articleMetaInfo.original.height;
        article.image.width = articleMetaInfo.original.width;
      } else {
        // add default image
        // ...
      }
      // pass in to createResultsDiv function
      $resultsDock.append(createResultsDiv(article, i));
    }
    console.log(results);
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
    +'format=json'
    + '&action=query'
    + '&generator=search'
    + '&gsrnamespace=0'
    + '&gsrsearch=' + subject
    + '&gsrlimit=10'
    + '&prop=pageimages|extracts|info'
    + '&piprop=name%7Coriginal'
    + '&pilimit=max'
    + '&inprop=url|displaytitle'
    + '&exintro'
    + '&explaintext'
    + '&exsentences=1'
    + '&exlimit=max';

    // old query string
    // + 'action=query'
    // + '&format=json'
    // + '&prop=pageimages'
    // + '%7Cinfo%7Cextracts'
    // + '&meta=&continue=gapcontinue%7C%7C'
    // + '&generator=allpages'
    // + '&utf8=1'
    // + '&piprop=name%7Coriginal'
    // + '&pithumbsize=100'
    // + '&inprop=url%7Cdisplaytitle'
    // + '&exsentences=3'
    // + '&exintro=1'
    // + '&explaintext=1'
    // + '&exsectionformat=plain'
    // + '&gapfrom=' + subject
    // + '&gapfilterredir=nonredirects'
    // + '&gaplimit=25';

    // original open serach with good results
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
