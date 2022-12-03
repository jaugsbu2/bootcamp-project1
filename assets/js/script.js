var submitInputEl = document.querySelector("#search-input");
var formSubmitEl = document.querySelector('#search-form')
var playlistsContainerEl = document.querySelector('#container-playlists')
var searchResult = '';

var formSubmitHandler = function (event) {
  event.preventDefault();

  var searchResult = submitInputEl.value.trim();
  if (searchResult) {
    getPlaylist(searchResult);
  } else {
    alert('please write something');
  }
}

var getPlaylist = function(searchResult) {
  
  var apiUrl = 'http://api.napster.com/v2.2/search/verbose?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5&per_type_limit=5&query=' + searchResult + '&type=playlist'
  console.log(apiUrl);
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function (info) {
        console.log(info)
        console.log(info.search.data.playlists[0].id);
        // gettracks(data.genres[0].id)
        renderPlaylists(info);
      });
    }
    else {
      console.log(response)
    }
  })
}

var renderPlaylists = function (playlists) {
  console.log('startfor');
  for (var i = 0; i < playlists.length; i++) {
    var playlistName = info.search.data.playlists[i].name;
      var playlistId = info.search.data.playlists[i].id;
      var playlistEl = document.createElement('button')
      console.log(playlistId, playlistName);
      playlistEl.textContent = playlistName + "/" + playlistId
      
      playlistsContainerEl.appendChild(playlistEl)
      
    }
  };

  formSubmitEl.addEventListener('submit', formSubmitHandler);
