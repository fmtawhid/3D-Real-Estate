
const video = document.getElementById("propertyVideo");
const story = document.getElementById("story");

const card = document.getElementById("sceneCard");
const eyebrow = document.getElementById("sceneEyebrow");
const title = document.getElementById("sceneTitle");
const description = document.getElementById("sceneDescription");
const progressLabel = document.getElementById("progressLabel");

const scenes = [
  {
    eyebrow: "01 — A NEW STANDARD OF LIVING",
    title: "Find a place<br>to call extraordinary.",
    description:
      "Discover thoughtfully designed spaces where comfort meets timeless architecture."
  },
  {
    eyebrow: "02 — THOUGHTFUL DESIGN",
    title: "Beauty in<br>every detail.",
    description:
      "Architecture and carefully chosen materials shaped around the way you live."
  },
  {
    eyebrow: "03 — EVERYDAY COMFORT",
    title: "Space to live.<br>Room to grow.",
    description:
      "A welcoming setting for life's moments, with a considered approach to lasting value."
  },
  {
    eyebrow: "04 — YOUR NEXT CHAPTER",
    title: "A place to<br>belong.",
    description:
      "Connect with our property team and discover whether this feels like your place in the world."
  }
];

let duration = 0;
let currentScene = -1;
let ticking = false;
let sceneTimeout;

function updateScene(progress) {
  const sceneIndex = Math.min(
    scenes.length - 1,
    Math.floor(progress * scenes.length)
  );

  if (sceneIndex === currentScene) return;

  currentScene = sceneIndex;
  const scene = scenes[sceneIndex];

  card.classList.add("changing");

  window.clearTimeout(sceneTimeout);
  sceneTimeout = window.setTimeout(() => {
    eyebrow.textContent = scene.eyebrow;
    title.innerHTML = scene.title;
    description.textContent = scene.description;
    progressLabel.textContent =
      `0${sceneIndex + 1} / 0${scenes.length}`;

    card.classList.remove("changing");
  }, 220);
}

function updateVideoFromScroll() {
  ticking = false;

  const rect = story.getBoundingClientRect();
  const scrollableDistance = story.offsetHeight - window.innerHeight;

  if (scrollableDistance <= 0) return;

  const progress = Math.max(
    0,
    Math.min(1, -rect.top / scrollableDistance)
  );

  updateScene(progress);

  if (!duration || !Number.isFinite(duration)) return;

  const targetTime = progress * duration;

  if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.04) {
    try {
      video.currentTime = targetTime;
    } catch (error) {
      // Some browsers cannot seek until media metadata is available.
    }
  }

  updateScene(progress);
}

function requestScrollUpdate() {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(updateVideoFromScroll);
}

video.addEventListener("loadedmetadata", () => {
  duration = video.duration;
  video.pause();
  requestScrollUpdate();
});

video.addEventListener("play", () => {
  // Keep this video scroll-controlled, not continuously playing.
  video.pause();
});

video.addEventListener("seeked", requestScrollUpdate);

window.addEventListener("scroll", requestScrollUpdate, {
  passive: true
});

window.addEventListener("resize", requestScrollUpdate);
requestScrollUpdate();

video.addEventListener("error", () => {
  console.error(
    "Video could not be loaded. Check assets/property-tour.mp4."
  );
});
