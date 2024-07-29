console.log("Let's Write JavaScript!");
let access_token = "BQDHZ_aI3ftHvMDVLEStVjBy6exEWW51vLuRwk4_2zvKI-3Ql-I5XC7RI_U8Nl5IgoA8xSl3IyC9tob-wNjSloc7CBHU46I3nQwWPqjMQbegPZBV9jI";
let songs = [];
let currentSong = new Audio();
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  try {
    currFolder = folder;

    // Fetching data from Spotify API
    const response = await fetch(`https://api.spotify.com/v1/playlists/${folder}/tracks`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    const data = await response.json();

    songs = data.items.map(item => {
      const track = item.track;
      return {
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(", "),
        url: track.preview_url || ""
      };
    });

  } catch (error) {
    console.error("Error fetching songs:", error);
  }
  
  const songList = document.querySelector(".songlist ul");
  songList.innerHTML = "";

  for (const song of songs) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <img src="Album/632x632bb.webp" alt="">
      <div class="info">
        <div>${song.name}</div>  <div class="ar">${song.artist}</div>
      </div>
      <div class="playnow">
        <img src="SVG/play.svg" alt="">
      </div>
    `;
    songList.appendChild(listItem);
  }

  const songItems = Array.from(songList.querySelectorAll("li"));
  songItems.forEach(item => {
    item.addEventListener("click", () => {
      const songTitle = item.querySelector(".info div").textContent.trim();
      const songUrl = songs.find(s => s.name === songTitle).url;
      if (songUrl) {
        playMusic(songUrl);
      }
    });
  });
}

function playMusic(track, pause = false) {
  currentSong.src = track;
  if (!pause) {
    currentSong.play();
    play.src = "SVG/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
}

async function main() {
  await getSongs("playlist_id"); // Replace 'playlist_id' with your actual playlist ID from Spotify

  playMusic(songs[0].url, true);

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "SVG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "SVG/playb.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} : ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".gol").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".gol").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  prev.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.findIndex(s => s.url === currentSong.src);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1].url);
    }
  });

  next.addEventListener("click", () => {
    console.log("Next clicked");
    let index = songs.findIndex(s => s.url === currentSong.src);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1].url);
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  Array.from(document.getElementsByClassName("square")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

main();
