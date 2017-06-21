/*
features to add:
- add search like google with numbers in bottom and max search?
- Wikipedia 1 Random article on start... did you know that?
- fix centering issue with github pages
- fix css when limited info in paragraph is there it centers
- figure out best way to get ideal language for person
- add easter eggs inside of random search like lil ski mask goof.
- try to eliminate redirects, aka 'may refer to:...' articles
- Add AP news feed- like google news
- add twitter feed?
- Add search for smart contracts
- Maybe world bank info
- use npm?
- create new file and refactor everything to react

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

  function processWikiData(data, status, xhr){
    // data
    console.log(data);

    // when successful, search button allowed again
    $subjectSearchField.prop("disabled", false);

    if (data.query === undefined){
      // inform info not found
      $resultsDock.append(createNoInfoDiv());
      // get related info with fuzzy search
      var noInfoValue = $subjectSearchField.val();
      var fuzzyEndPoint = wikipediaQueryString(noInfoValue, 'fuzzy');
      makeJSONCall(fuzzyEndPoint, processWikiData);
    } else {
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
        for (var i = 0; i < resultsKeysArr.length; i++){
          articleMetaInfo = results[resultsKeysArr[i]];
          article.link = articleMetaInfo.canonicalurl;
          article.title = articleMetaInfo.title;
          article.summary = articleMetaInfo.extract;

          // check if has image and output.
          if (articleMetaInfo.hasOwnProperty('original')){
            // add thumbnail
            article.image.source = articleMetaInfo.original.source;
            article.image.height = articleMetaInfo.original.height;
            article.image.width = articleMetaInfo.original.width;
          } else {
            // add default image
            article.image.source = 'assets/page-cc.svg';
          }

          // pass in to createResultsDiv function
          $resultsDock.append(createResultsDiv(article, i));
        }
        console.log(results);
      }
    }
    function createNoInfoDiv(){
      var $resultsHolderDiv = $("<div/>", {
        id: "result-holder-no-info-found"
      });

      var $noInfoFound = $("<div/>", {
        id: "no-info-found",
        class: "article-link-container"
      });

      var $articleImageContainerDiv = $("<div/>", {
        class: "article-image-container"
      });

      var $articleImageImgTag = $("<img />",{
        src: 'assets/page-cc.svg',
        class: "article-image",
      });

      var $articleTextContainerDiv = $("<div/>", {
        class: "article-text-container"
      });
      var $articleTitleH5Tag = $("<h5></h5>", {
        text: 'No articles found',
        class: "article-title"
      });
      var $articleDescriptionPTag = $("<p></p>",{
        text: 'See related the searches below',
        class: "article-description"
      });

      $resultsHolderDiv.append($noInfoFound);
      $noInfoFound.append($articleImageContainerDiv);
      $noInfoFound.append($articleTextContainerDiv);
      $articleImageContainerDiv.append($articleImageImgTag);
      $articleTextContainerDiv.append($articleTitleH5Tag);
      $articleTextContainerDiv.append($articleDescriptionPTag);

      return $resultsHolderDiv;
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
        class: "article-image",
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

      return $resultHolderDiv;
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
      // add randomSubject value to search field
      $subjectSearchField.val(randomSubject);
      var endPoint = wikipediaQueryString(randomSubject, 'strict');
      makeJSONCall(endPoint, processWikiData);
    });
  }

  // query API here- get info here
  function wikipediaQueryString(subject, searchStyle){
    // convert string to percent encoding
    subject = encodeURIComponent(subject);
    // construct path
    var wikipediaEndPoint = 'https://' + language + '.wikipedia.org/w/api.php?'
    // 3rd gen
    + 'format=json'
    + '&action=query'
    + '&generator=prefixsearch'
    + '&gpsnamespace=0'
    + '&gpssearch=' + subject
    + '&gpslimit=10'
    + '&gpsprofile=' + searchStyle
    + '&prop=pageimages|extracts|info'
    + '&piprop=name|original|thumbnail'
    + '&pilimit=max'
    + '&inprop=url|displaytitle'
    + '&exintro'
    + '&explaintext'
    + '&exsentences=1'
    + '&exlimit=max';

    /* search style aka &gpssearch properties allowed:
      "The purpose of this module is similar to action=opensearch:
      to take user input and provide the best-matching titles.
      Depending on the search engine backend, this might include typo correction,
      redirect avoidance, or other heuristics."
      
      source: https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bprefixsearch
      Search profile to use.

      strict:
        Strict profile with few punctuation characters removed but diacritics and stress marks are kept.
      normal:
        Few punctuation characters, some diacritics and stopwords removed.
      normal-subphrases:
        Few punctuation characters, some diacritics and stopwords removed. It will match also subphrases (can be subphrases or subpages depending on internal wiki configuration).
      fuzzy:
        Similar to normal with typo correction (two typos supported).
      fast-fuzzy:
        Experimental fuzzy profile (may be removed at any time)
      fuzzy-subphrases:
        Similar to normal with typo correction (two typos supported). It will match also subphrases (can be subphrases or subpages depending on internal wiki configuration).
      classic:
        Classic prefix, few punctuation characters and some diacritics removed.

      One of the following values: strict, normal, normal-subphrases, fuzzy, fast-fuzzy, fuzzy-subphrases, classic

      Default: fuzzy
    */

    // original open serach with good results
    // + 'action=opensearch'
    // + '&search=' + subject
    // + '&limit=25'
    // + '&format=json'
    // + '&callback=?';

    return wikipediaEndPoint;
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

  function clearPassedResults(){
    if ($resultsDock.children().length > 0){
      $resultsDock.empty();
    }
  }

  function searchAction(evt){
      clearPassedResults();
      // disable search until we get data
      $subjectSearchField.prop("disabled", true);
      //query the subject- get value when searched.
      $subjectSearch = $('#subject-name').val();
      var endPoint = wikipediaQueryString($subjectSearch, 'strict');
      makeJSONCall(endPoint, processWikiData);
  };

  // Run when search button clicked and new subject submitted
  $($submitButton).click(function(evt){
    handleSearch(evt);
  });

  $($randomSearchButton).click(function(evt){
    clearPassedResults();
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
