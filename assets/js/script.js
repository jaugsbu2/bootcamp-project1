console.log("start")
var genreContainerEl = document.querySelector('#genres');
var playlistsContainerEl = document.querySelector('#playlists');

var getgenres = function() {

  var apiUrl = 'https://api.napster.com/v2.2/genres?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5'

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data.genres)
        displayGenres(data.genres);
        gettracks(data.genres[0].id)
      });
    }
    else {
      console.log(response)
    }
  })
}

getgenres();

var displayGenres = function (genres) {

  for (var i = 0; i < genres.length; i++) {
    var genreName = genres[i].name;
    var genreEl = document.createElement('button')
    
    genreEl.textContent = genreName

    genreContainerEl.appendChild(genreEl)

  }
};

var gettracks = function(playlist) {
  var apiUrl = 'https://api.napster.com/v2.2/genres/' + playlist + '/playlists/top?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5'

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data.genres)
        displayGenres(data.genres);
        getplaylists(data.genres[0].id)
      });
    }
    else {
      console.log(response)
    }
  })
}

