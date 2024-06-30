console.log("Let's Write JavaScript!");

let songs;
let currentSong = new Audio();
let currFolder;
function secondsToMinutes(seconds){
  if(isNaN(seconds) || seconds < 0){
    return "00:00";
  }
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2,'0')
  const formattedSeconds = String(remainingSeconds).padStart(2,'0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  try {
    currFolder = folder;
    const response = await fetch(`http://127.0.0.1:3000/${folder}/`);
    const text = await response.text();
    const parser = new DOMParser(); // Use DOMParser for safety
    const doc = parser.parseFromString(text, "text/html"); // Parse as HTML

      songs = Array.from(doc.querySelectorAll("a[href$='.mp3']"))
      .map(link => {
        // Extract only the filename from the href
        const filename = link.href.split('/').pop();
        return decodeURI(filename); // Decode potential URI encoding
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
        <div>${song.replace(/,/g, " ")}</div>  <div class="ar">Justin Bieber</div>
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
      playMusic(songTitle.replace(/,/g, " "));
    });
  });
}

function playMusic(track, pause = false) {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "SVG/pause.svg";
  }
  // Display only the song name in the songinfo element
  document.querySelector(".songinfo").innerHTML = track;
}


async function main() {
   await getSongs("songs/Justin_Beiber");
  playMusic(songs[0],true)

  //Attach event listner to play ,next and prev
  play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play();
        play.src = "SVG/pause.svg"
    }
    else{
        currentSong.pause();
        play.src = "SVG/playb.svg"
    }
  })

  currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} : ${secondsToMinutes(currentSong.duration)}`
    document.querySelector(".gol").style.left = (currentSong.currentTime / currentSong.duration) *100 +"%";
  })

  //add eventlistner to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100 ;
    document.querySelector(".gol").style.left = percent+"%";
    currentSong.currentTime = ((currentSong.duration)*percent)/100
  })
   //add eventlistner to hamburger
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = 0;
   })
   //add eventlistner to close
    document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%";
   })

   prev.addEventListener("click",()=>{
    console.log("previous clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) > 0){
      playMusic(songs[index-1])
    }
  })

   next.addEventListener("click",()=>{
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length){
      playMusic(songs[index+1])
    }
})
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
      currentSong.volume = parseInt(e.target.value)/100;
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
      e.addEventListener("click",async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      })
    })
}

main()
