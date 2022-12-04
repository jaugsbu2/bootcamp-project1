// form submit search box
// call napster search api for playlists
// Write 5 playlists to screen
// event.target click on playlists, pass the playlist id
// call napster playlist tracks endpoint
// write 25 tracks to screen with artist, song name.
// call youtube api search with artist and song name of first song.
// embed the first result.
// next button
// repeat 7 and 8.

var submitInputEl = document.querySelector("#search-input");
var formSubmitEl = document.querySelector('#search-form')
var playlistsBtnEl = document.querySelector('#playlists')
var playlistsContainerEl = document.querySelector('#container-playlists')
var trackListEl = document.querySelector('#tracks')

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

var getPlaylist = function (searchResult) {

  var apiUrl = 'http://api.napster.com/v2.2/search/verbose?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5&per_type_limit=5&query=' + searchResult + '&type=playlist'

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (info) {
      
        renderPlaylists(info);
      });
    }
    else {
      console.log(response)
    }
  })
}

var renderPlaylists = function (info) {

  for (i = 0; i < info.search.data.playlists.length; i++) {
    var playlistName = info.search.data.playlists[i].name;
    var playlistId = info.search.data.playlists[i].id;
    var playlistEl = document.createElement('button')
    playlistEl.textContent = playlistName + " / " + playlistId
    playlistEl.setAttribute('name', playlistName)
    playlistEl.setAttribute('id', playlistId)

    playlistsContainerEl.appendChild(playlistEl)

  }
};

var clickEventHandler = function(event) {
  var playlistId = event.target.getAttribute("id");
  if (playlistId) {
    getTracks(playlistId)
  }
}

var getTracks = function(playlistId) {

  var apiUrl = 'http://api.napster.com/v2.2/playlists/' + playlistId + '/tracks?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5&limit=20'

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (info) {
      
        console.log(info)
        renderTracks(info)
      });
    }
    else {
      console.log(response)
    }
  })
}

var renderTracks = function(info) {

  console.log(info.tracks.length)

  for (i = 0; i < info.tracks.length; i++) {
    var trackName = info.tracks[i].name;
    var artist = info.tracks[i].artistName;
    var trackEl = document.createElement('li')
    trackEl.textContent = artist + " / " + trackName
    trackEl.setAttribute('name', trackName)
    trackEl.setAttribute('artist', artist)
    trackListEl.appendChild(trackEl)
  }

}


var youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=' + renderTracks + '&key=AIzaSyA9MRrVXUUlMjQsmZEy6sFRTB7c4NhqVUU'
fetch(youtubeUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data);
        var videos = data.items
        for (video of videos){
            var ytVideo = video.id.videoId;
            console.log(ytVideo)
            var ytEmbedEl = document.querySelector('.ytplayer');
            var ytEmbedLink = "https://youtube.com/embed/" + ytVideo;
            ytEmbedEl.setAttribute("src", ytEmbedLink)
        }
    })



formSubmitEl.addEventListener('submit', formSubmitHandler);
playlistsContainerEl.addEventListener('click', clickEventHandler);
