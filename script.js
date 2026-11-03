// =====================================
// IZZAH'S SECTION — API JAVASCRIPT
// =====================================

// Helper: select an HTML element
const $ = (id) => document.getElementById(id);

// Helper: fetch API data
async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Helper: display an image
function setImage(id, url, alt) {
  const image = $(id);

  if (url) {
    image.src = url;
    image.alt = alt || "Discovery image";
    image.classList.remove("hidden");
  } else {
    image.removeAttribute("src");
    image.classList.add("hidden");
  }
}

// Helper: display a link
function setLink(id, url) {
  const link = $(id);

  if (url) {
    link.href = url;
    link.classList.remove("hidden");
  } else {
    link.removeAttribute("href");
    link.classList.add("hidden");
  }
}

// Helper: choose a random item
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}


// =====================================
// 1. DEEZER API — MUSIC DISCOVERY
// =====================================

async function discoverMusic() {
  const button = $("music-btn");

  button.disabled = true;
  button.textContent = "Finding music...";

  $("music-title").textContent = "Searching for a song...";
  $("music-artist").textContent = "";
  $("music-album").textContent = "";
  $("music-status").textContent = "Finding something special for you...";

  setImage("music-image", "", "");
  setLink("music-link", "");

  const preview = $("music-preview");
  preview.pause();
  preview.removeAttribute("src");
  preview.classList.add("hidden");

  try {
    const searches = [
      "pop hits",
      "love songs",
      "indie pop",
      "kpop",
      "acoustic",
      "R&B",
      "Taylor Swift",
      "Ariana Grande",
      "Bruno Mars",
      "Lana Del Rey"
    ];

    const search = randomItem(searches);

    const apiURL =
      "https://proxy.cors.dev/https://api.deezer.com/search?q=" +
      encodeURIComponent(search);

    const data = await fetchJSON(apiURL);

    if (!data.data || data.data.length === 0) {
      throw new Error("No songs found.");
    }

    const track = randomItem(data.data);

    $("music-title").textContent = track.title;
    $("music-artist").textContent =
      `Artist: ${track.artist.name}`;
    $("music-album").textContent =
      `Album: ${track.album.title}`;

    setImage(
      "music-image",
      track.album.cover_big || track.album.cover_medium,
      `Album cover for ${track.title}`
    );

    if (track.preview) {
      preview.src = track.preview;
      preview.classList.remove("hidden");
    }

    setLink("music-link", track.link);

    $("music-status").textContent =
      "Your song is ready! Enjoy listening. 🎶";

  } catch (error) {
    console.error("Deezer error:", error);

    $("music-title").textContent = "Music discovery unavailable.";
    $("music-status").textContent =
      "Please try again. The music service may be unavailable.";
  } finally {
    button.disabled = false;
    button.textContent = "🎵 Discover Music";
  }
}


// =====================================
// 2. TVMAZE API — SERIES DISCOVERY
// =====================================

async function discoverMovie() {
  const button = $("movie-btn");

  button.disabled = true;
  button.textContent = "Finding a series...";

  $("movie-title").textContent = "Searching for a series...";
  $("movie-year").textContent = "";
  $("movie-rating").textContent = "";
  $("movie-genre").textContent = "";
  $("movie-overview").textContent = "";
  $("movie-status").textContent = "Your next binge-watch is on its way...";

  setImage("movie-image", "", "");
  setLink("movie-link", "");

  try {
    const categories = [
      "drama",
      "comedy",
      "fantasy",
      "romance",
      "adventure",
      "mystery",
      "science fiction",
      "action",
      "thriller"
    ];

    const category = randomItem(categories);

    const apiURL =
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(category)}`;

    const data = await fetchJSON(apiURL);

    const shows = data.filter(
      item => item.show && item.show.name
    );

    if (!shows.length) {
      throw new Error("No TV shows found.");
    }

    const selected = randomItem(shows);
    const show = selected.show;

    $("movie-title").textContent = show.name;

    $("movie-year").textContent =
      `Premiered: ${show.premiered || "Unknown"}`;

    $("movie-rating").textContent =
      `⭐ Rating: ${show.rating?.average ?? "Not rated"}/10`;

    $("movie-genre").textContent =
      `Genres: ${show.genres?.join(", ") || "Not available"}`;

    // Display the summary as plain text
    const description = show.summary
      ? show.summary.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : "No description available.";

    $("movie-overview").textContent = description;

    const poster =
      show.image?.medium || show.image?.original || "";

    setImage("movie-image", poster, `Poster for ${show.name}`);
    setLink("movie-link", show.url);

    $("movie-status").textContent =
      "Series discovered! Enjoy your next binge-watch. 🍿";

  } catch (error) {
    console.error("TVmaze error:", error);

    $("movie-title").textContent =
      "Series discovery unavailable.";

    $("movie-overview").textContent =
      "Please try again later.";

    $("movie-status").textContent =
      "The TVmaze service may be temporarily unavailable.";
  } finally {
    button.disabled = false;
    button.textContent = "📺 Discover a Series";
  }
}


// =====================================
// 3. GAMERPOWER API — FREE GAME DISCOVERY
// =====================================

async function discoverGame() {
  const button = $("game-btn");

  button.disabled = true;
  button.textContent = "Finding a game...";

  $("game-title").textContent = "Searching for a free game...";
  $("game-platform").textContent = "";
  $("game-worth").textContent = "";
  $("game-type").textContent = "";
  $("game-status").textContent = "Looking for free games...";

  setImage("game-image", "", "");
  setLink("game-link", "");

  try {
    const apiURL = "https://www.gamerpower.com/api/giveaways";

    const data = await fetchJSON(apiURL);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No games found.");
    }

    const game = randomItem(data);

    $("game-title").textContent = game.title || "Unknown game";

    $("game-platform").textContent =
      `Platform: ${game.platforms || "Not available"}`;

    $("game-worth").textContent =
      `Worth: ${game.worth || "Free"}`;

    $("game-type").textContent =
      `Type: ${game.type || "Giveaway"}`;

    setImage(
      "game-image",
      game.thumbnail,
      `Image for ${game.title}`
    );

    setLink(
      "game-link",
      game.open_giveaway_url
    );

    $("game-status").textContent =
      "Game found! Check the giveaway before it expires. 🎮";

  } catch (error) {
    console.error("GamerPower error:", error);

    $("game-title").textContent =
      "Game discovery unavailable.";

    $("game-status").textContent =
      "Please try again later. The game service may be unavailable.";
  } finally {
    button.disabled = false;
    button.textContent = "🕹️ Discover a Game";
  }
}


// =====================================
// SURPRISE ME — ALL THREE APIS
// =====================================

async function surpriseMe() {
  const button = $("surprise-btn");

  button.disabled = true;
  button.textContent = "✨ Preparing your surprises...";

  await Promise.allSettled([
    discoverMusic(),
    discoverMovie(),
    discoverGame()
  ]);

  button.disabled = false;
  button.textContent = "✨ Surprise Me!";
}


// =====================================
// BUTTON EVENT LISTENERS
// =====================================

$("music-btn").addEventListener("click", discoverMusic);
$("movie-btn").addEventListener("click", discoverMovie);
$("game-btn").addEventListener("click", discoverGame);
$("surprise-btn").addEventListener("click", surpriseMe);