const form = document.querySelector("#linkForm");
const input = document.querySelector("#videoUrl");
const result = document.querySelector("#result");
const title = document.querySelector("#resultTitle");
const playerWrap = document.querySelector("#playerWrap");
const player = document.querySelector("#player");
const teraboxNotice = document.querySelector("#teraboxNotice");
const watchBtn = document.querySelector("#watchBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const copyBtn = document.querySelector("#copyBtn");
const clearBtn = document.querySelector("#clearBtn");
const status = document.querySelector("#status");

function isDirectVideo(url) {
  try {
    const parsed = new URL(url);
    return /\.(mp4|webm|ogg|ogv|mov|m4v)(?:$|[?#])/i.test(parsed.pathname + parsed.search + parsed.hash);
  } catch {
    return false;
  }
}

function isTeraBox(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return /(^|\\.)(terabox\\.com|teraboxapp\\.com|1024terabox\\.com|4funbox\\.com|dubox\\.com|nephobox\\.com)$/.test(host);
  } catch {
    return false;
  }
}

function reset() {
  player.pause();
  player.removeAttribute("src");
  player.load();
  result.classList.add("hidden");
  playerWrap.classList.add("hidden");
  teraboxNotice.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  status.textContent = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  reset();

  let url;
  try {
    url = new URL(input.value.trim());
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only web links are supported.");
  } catch {
    status.textContent = "Please enter a valid http or https link.";
    result.classList.remove("hidden");
    title.textContent = "Invalid link";
    return;
  }

  const link = url.href;
  const direct = isDirectVideo(link);
  const terabox = isTeraBox(link);

  result.classList.remove("hidden");
  title.textContent = terabox ? "TeraBox share link" : (direct ? "Direct video link" : "Shared link");
  watchBtn.href = link;

  if (direct) {
    player.src = link;
    playerWrap.classList.remove("hidden");
    downloadBtn.href = link;
    downloadBtn.classList.remove("hidden");
    // The browser may still refuse playback/download for cross-origin or protected URLs.
    status.textContent = "If playback fails, the host may require access permissions or may not allow direct browser playback.";
  } else if (terabox) {
    teraboxNotice.classList.remove("hidden");
    status.textContent = "Trying an embedded share view is not reliable because TeraBox may block framing. Use “Watch / open link” if the preview does not appear.";
  } else {
    status.textContent = "This does not look like a direct video file. Open the original link to view it.";
  }
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(input.value.trim());
    status.textContent = "Link copied to clipboard.";
  } catch {
    status.textContent = "Clipboard access was blocked. Select and copy the link from the input field.";
  }
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  reset();
  input.focus();
});

// If the browser cannot play a direct link, show a useful hint instead of a blank player.
player.addEventListener("error", () => {
  status.textContent = "The browser could not play this URL. It may not be a direct video file, or the host may block cross-origin playback.";
});
