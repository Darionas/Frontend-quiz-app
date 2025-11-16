//use strict

/* Check overflow */
// Find elements that overflow document width
(function findOverflow() {
  const docW = document.documentElement.clientWidth;
  const offenders = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > docW + 0.5) {
      offenders.push({ el, rect: r, selector: el.nodeName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.'+el.className.split(' ').join('.') : '') });
    }
  });
  console.table(offenders.map(o => ({ selector: o.selector, right: Math.round(o.rect.right), width: Math.round(o.rect.width) })));
  return offenders;
})();



/* Dark-Light mode */
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#toggle');
const subBtns = document.querySelectorAll('.subject__button');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const answerBtns = document.querySelectorAll('.option');
const slider = document.querySelector('.slider');

const enableDarkMode = () => {
    // add the class darkMode to the body
    document.body.classList.add('darkMode');
    // persist state in localStorage
    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    // remove the class darkMode from the body
    document.body.classList.remove('darkMode');
    // persist state in localStorage
    localStorage.setItem('darkMode', 'disabled');
}

const updateToggle = (checked) => {
    // keep ARIA in sync with the actual control state
    if (!darkModeToggle) return;
    darkModeToggle.setAttribute('aria-checked', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-pressed', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-label', checked ? 'Disable dark mode' : 'Enable dark mode');
}

/* Toggle answers shadow */
function answerButtonShadow(isDark) {
    if(!answerBtns || answerBtns.length === 0) return;
    answerBtns.forEach(btn => {
        btn.classList.toggle('dark', isDark);
        btn.classList.toggle('light', !isDark);
    })
}


/* Toggle buttons shadow */
function applySubjectButtonTheme(isDark) {
  if (!subBtns || subBtns.length === 0) return;
  subBtns.forEach(btn => {
    btn.classList.toggle('darkShadow', isDark);
    btn.classList.toggle('lightShadow', !isDark);
  });
}

/* toggle icons color */
function updateThemeIcons(isDark) {
    if(sun) {
        sun.src = isDark ? './assets/images/icon-sun-light.svg' : './assets/images/icon-sun-dark.svg';
        sun.alt = isDark ? 'Sun-light icon' : 'Sun-dark icon';
    }
    if(moon) {
        moon.src = isDark ? './assets/images/icon-moon-light.svg' : './assets/images/icon-moon-dark.svg';
        moon.alt = isDark ? 'Moon-light icon' : 'Moon-dark icon';
    }
}

/* Load mode kept in localStorage, even after page refresh */
if (darkMode === 'enabled') {
    enableDarkMode();
    if (darkModeToggle) darkModeToggle.checked = true;
    updateToggle(true);
    applySubjectButtonTheme(true);
    updateThemeIcons(true);
    answerButtonShadow(true);
} else {
    // ensure a consistent default (light mode)
    disableDarkMode();
    if (darkModeToggle) darkModeToggle.checked = false;
    updateToggle(false);
    applySubjectButtonTheme(false);
    updateThemeIcons(false);
    answerButtonShadow(false);
}

// Guard: if toggle isn't present, don't attach listeners
if (darkModeToggle) {
    // Use the `change` event so we read the actual checkbox state
    darkModeToggle.addEventListener('change', () => {
        const isChecked = darkModeToggle.checked;
        if (isChecked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
        updateToggle(isChecked);
        applySubjectButtonTheme(isChecked); // keep buttons synced
        updateThemeIcons(isChecked);
        answerButtonShadow(isChecked);
    });
}


/* focus-visible switch slider */
if(slider) {
    // make the visible element reachable by keyboard (so Tab lands here)
    slider.setAttribute('tabindex', '0');
    
    // Keyboard activation: Space or Enter should toggle the checkbox
  slider.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === ' ' || key === 'Spacebar' || key === 'Enter') {
      e.preventDefault();               // prevent page scroll on Space
      if (darkModeToggle) darkModeToggle.click(); // reuse the checkbox click/change logic
    }
  });

  // Also let clicks on the visible slider toggle the checkbox
  slider.addEventListener('click', (e) => {
    e.preventDefault(); 
    if (darkModeToggle) darkModeToggle.click();
  });
}
