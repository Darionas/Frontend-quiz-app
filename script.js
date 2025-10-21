//use strict

/* Dark-Light mode */
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#toggle');
const subBtns = document.querySelectorAll('.subject__button');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');

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

const updateToggleA11y = (checked) => {
    // keep ARIA in sync with the actual control state
    if (!darkModeToggle) return;
    darkModeToggle.setAttribute('aria-checked', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-pressed', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-label', checked ? 'Disable dark mode' : 'Enable dark mode');
}

/* Toggle buttons shadow */
function applySubjectButtonTheme(isDark) {
  if (!subBtns || subBtns.length === 0) return;
  subBtns.forEach(btn => {
    btn.classList.toggle('darkShadow', isDark);
    btn.classList.toggle('lightShadow', !isDark);
  });
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
    updateToggleA11y(true);
    applySubjectButtonTheme(true);
} else {
    // ensure a consistent default (light mode)
    disableDarkMode();
    if (darkModeToggle) darkModeToggle.checked = false;
    updateToggleA11y(false);
    applySubjectButtonTheme(false);
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
        updateToggleA11y(isChecked);
        applySubjectButtonTheme(isChecked); // keep buttons synced
    });
}
