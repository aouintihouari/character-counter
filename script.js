const container = document.querySelector(".container");
const toggleMode = document.querySelector(".toggle-mode");
const toggleModeIcon = document.querySelector(".toggle-mode__icon");
const logoIcon = document.querySelector(".logo__icon");

const info = document.querySelector(".info");

const textarea = document.getElementById("textarea-custom");
const excludeSpaces = document.getElementById("exclude-spaces");
const characterLimit = document.getElementById("character-limit");

const includeSpacesText = document.querySelector(".counter__sub-title-spaces");
const readingTimeCounter = document.querySelector(".reading-time__counter");

const counterCharacters = document.querySelector(".counter__characters");
const counterWords = document.querySelector(".counter__words");
const counterSentences = document.querySelector(".counter__sentences");
const characterLimitInput = document.querySelector(".character-limit__input");
const maxChars = document.querySelector(".max-characters");
const noChars = document.querySelector(".no-characters");

const densityContainer = document.querySelector(".density__container");

const charactersList = {};
const alphabet = "abcdefghijklmnopqrstuvwxyz";

let totalCharacters = 0;
let totalWords = 0;
let totalSentences = 0;
let charactersLimit = 0;

for (let char of alphabet) {
  charactersList[char] = 0;
}

function displayLettersDensity(totalLetters) {
  let entries = Object.entries(charactersList);
  entries.sort((a, b) => b[1] - a[1]);

  let densityHTML = "";
  let extraDensityHTML = "";

  entries.forEach(([key, value], index) => {
    if (value > 0) {
      let percentage =
        totalLetters > 0 ? ((value / totalLetters) * 100).toFixed(2) : 0;
      let elementHTML = `
        <div class="density__element">
          <span class="letter text-preset-4">${key.toUpperCase()}</span>
          <progress class="progress-bar" value="${value}" max="${totalLetters}"></progress>
          <span class="density__number text-preset-4">${value}</span>&nbsp;
          <span class="density__percentage text-preset-4">(${percentage}%)</span>
        </div>
      `;
      if (index < 5) densityHTML += elementHTML;
      else extraDensityHTML += elementHTML;
    }
  });

  densityContainer.innerHTML = densityHTML;

  if (extraDensityHTML) {
    let seeMore = document.createElement("p");
    seeMore.textContent = "Show More v";
    seeMore.classList.add("text-preset-3", "show-more");

    let seeLess = document.createElement("p");
    seeLess.textContent = "Show Less ^";
    seeLess.classList.add("text-preset-3", "show-less");
    seeLess.style.display = "none";

    seeMore.onclick = () => {
      densityContainer.innerHTML = densityHTML + extraDensityHTML;
      densityContainer.appendChild(seeLess);
      seeMore.style.display = "none";
      seeLess.style.display = "block";
    };

    seeLess.onclick = () => {
      densityContainer.innerHTML = densityHTML;
      densityContainer.appendChild(seeMore);
      seeLess.style.display = "none";
      seeMore.style.display = "block";
    };

    densityContainer.appendChild(seeMore);
  }
}

function countLetterDensity() {
  let text = textarea.value.trim().toLowerCase();
  Object.keys(charactersList).forEach((key) => (charactersList[key] = 0));
  let totalLetters = 0;
  for (let char of text) {
    if (char in charactersList) {
      charactersList[char] += 1;
      totalLetters++;
    }
  }
  displayLettersDensity(totalLetters);
}

function countCharacters() {
  let text = textarea.value.trim();
  totalWords = text.length > 0 ? text.split(/\s+/).length : 0;
  totalSentences =
    text.length > 0
      ? text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0)
          .length
      : 0;
  counterWords.textContent = totalWords || "00";
  totalCharacters = textarea.value.length;
  counterSentences.textContent = totalSentences || "00";
  if (excludeSpaces.checked) {
    totalCharacters = textarea.value.replace(/\s/g, "").length;
    includeSpacesText.textContent = "(no space)";
  } else includeSpacesText.textContent = "";
  counterCharacters.textContent = totalCharacters || "00";
  if (characterLimit.checked) {
    characterLimitInput.style.display = "block";
    if (totalCharacters > charactersLimit && charactersLimit !== 0) {
      info.style.display = "flex";
      textarea.style.outline = "2px solid #fe8159";
      maxChars.textContent = charactersLimit;
    } else {
      info.style.display = "none";
      textarea.style.outline = "none";
    }
  } else {
    {
      characterLimitInput.style.display = "none";
      info.style.display = "none";
      textarea.style.outline = "none";
    }
  }
}

function calculateReadingTime() {
  const wordsPerMinute = 200;
  const time = Math.ceil(totalWords / wordsPerMinute);
  if (totalWords > 0) readingTimeCounter.textContent = "<" + time;
  else readingTimeCounter.textContent = "0";
}

characterLimitInput.addEventListener("change", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  if (e.target.value.length > 1 && e.target.value[0] === "0")
    e.target.value = e.target.value.replace(/^0+/, "");
  if (!isNaN(e.target.value)) charactersLimit = parseInt(e.target.value, 10);
  countCharacters();
});

textarea.addEventListener("input", () => {
  countCharacters();
  calculateReadingTime();
  countLetterDensity();
  if (totalCharacters > 0) noChars.style.display = "none";
  else noChars.style.display = "block";
});

excludeSpaces.addEventListener("change", countCharacters);
characterLimit.addEventListener("change", countCharacters);

toggleMode.addEventListener("click", () => {
  if (container.classList.contains("dark-mode")) {
    container.classList.remove("dark-mode");
    container.style.backgroundImage = 'url("assets/images/bg-light-theme.png")';
    toggleModeIcon.src = "assets/images/icon-moon.svg";
    logoIcon.src = "assets/images/logo-light-theme.svg";
  } else {
    container.classList.add("dark-mode");
    container.style.backgroundImage = 'url("assets/images/bg-dark-theme.png")';
    toggleModeIcon.src = "assets/images/icon-sun.svg";
    logoIcon.src = "assets/images/logo-dark-theme.svg";
  }
});
