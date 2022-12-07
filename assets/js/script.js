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
var onPlayEl = document.querySelector('#on-play')
var nextEl = document.querySelector('#next-song')
var dataState = trackListEl.getAttribute('data-list') // added a data-set variable to be set to true or false for playlist, if data-list is false then youtube play button will not work
var searchResult = '';
var playlistId = '';
var trackNumber = 0;

// Searchbar input from user

var formSubmitHandler = function (event) {
  event.preventDefault();

  var searchResult = submitInputEl.value.trim();
  if (searchResult) {
    getPlaylist(searchResult);
  } else {
    alert('please write something'); // need to replace this alert with a modal
  }
}

// Napster section for JS
var getPlaylist = function (searchResult) {

  var apiUrl = 'http://api.napster.com/v2.2/search/verbose?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5&per_type_limit=5&query=' + searchResult + '&type=playlist'

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (info) {
        console.log(info);
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

var clickEventHandler = function (event) {
  playlistId = event.target.getAttribute("id");
  if (playlistId) {
    getTracks(playlistId)
  }
}

var getTracks = function (playlistId) {

  var apiUrl = 'http://api.napster.com/v2.2/playlists/' + playlistId + '/tracks?pretty=true&apikey=NzA2MTliZDAtY2JjMS00ZDg2LTgwZDUtODU4Njk0MWI2N2Y5&limit=20'

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (info) {
        console.log(info)
        renderTracks(info)
        localStorage.setItem(playlistId, JSON.stringify(info)); // save playlistID and the tracks for specific playslit to localstorage as JSON readable
      });
    }
    else {
      console.log(response)
    }
  })
}

var renderTracks = function (info) {

  if (dataState == 'false') {
    trackListEl.setAttribute('data-list', 'true') //once the tracks are listed on screen the youtube play button function will become available
    dataState = 'true';
  }
  for (i = 0; i < info.tracks.length; i++) {
    var trackNum = i;
    var trackName = info.tracks[i].name;
    var artist = info.tracks[i].artistName;
    var trackEl = document.createElement('button') //create button instead of list to choose tracks
    trackEl.textContent = trackNum + 1 + ' ' + artist + " / " + trackName
    trackEl.setAttribute('class', 'track-list')
    trackEl.setAttribute('name', trackName)
    trackEl.setAttribute('artist', artist)
    trackEl.setAttribute('trackNum', trackNum)

    trackListEl.appendChild(trackEl)
  }

}

// Youtube video section of the JS

var onPlayHandler = function (event) {

  if (dataState == 'true') {
    var onPlay = event.target.getAttribute("id");
    if (onPlay) {
      getYoutubeVideo(playlistId)
    }
  } else {
    return;
  }

}

var getYoutubeVideo = function (playlistId, trackNumber = 0) {

  console.log(trackNumber)
  var playlistObject = JSON.parse(localStorage.getItem(playlistId));
  var artistName = playlistObject.tracks[trackNumber].artistName;
  var songTitle = playlistObject.tracks[trackNumber].name;
  var artistNameFormat = artistName.replace(/\s/g, '%20');
  var songTitleFormat = songTitle.replace(/\s/g, '%20');

  var searchString = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=' + artistNameFormat + '%20' + songTitleFormat + '&key=AIzaSyA9MRrVXUUlMjQsmZEy6sFRTB7c4NhqVUU';
  console.log(searchString)

  fetch(searchString)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var videos = data.items
      for (video of videos) {
        var youtubeVideo = video.id.videoId;
        var youtubeEmbedEl = document.querySelector('#youtube-player');
        var youtubeEmbedLink = "https://youtube.com/embed/" + youtubeVideo;
        youtubeEmbedEl.setAttribute("src", youtubeEmbedLink)
      }
    })
}

var nextSongHandler = function(event){
  if (dataState == 'true') {
    var nextSong = event.target.getAttribute("id");
    if (nextSong) {
      trackNumber += 1;
      getYoutubeVideo(playlistId, trackNumber)
    }
  } else {
    return;
  }
}

var chooseSong = function(event){
  if (dataState == 'true') {
    var pickSong = event.target.getAttribute("tracknum");
    if (pickSong) {
      console.log('Choose song hit')
      console.log(pickSong)
      trackNumber = pickSong;
      getYoutubeVideo(playlistId, trackNumber)
    }
  } else {
    return;
  }
}

// Event listeners for button clicks

formSubmitEl.addEventListener('submit', formSubmitHandler);
playlistsContainerEl.addEventListener('click', clickEventHandler);
onPlayEl.addEventListener('click', onPlayHandler);
nextEl.addEventListener('click', nextSongHandler);
trackListEl.addEventListener('click', chooseSong);
