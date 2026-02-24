'use strict'
/* jshint esversion: 6 */

/* variables*/
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#toggle');
const answerBtns = document.querySelectorAll('.option');
const moon = document.querySelector('.moon');
const sun = document.querySelector('.sun');
const slider = document.querySelector('.slider');
const menuContainer = document.querySelector('.menu__container');


/* Dark mode */
const enableDarkMode = () => {
    // add the class darkMode to the body
    document.body.classList.add('darkMode');
    // persist state in localStorage
    localStorage.setItem('darkMode', 'enabled');
};

const disableDarkMode = () => {
    // remove the class darkMode from the body
    document.body.classList.remove('darkMode');
    // persist state in localStorage
    localStorage.setItem('darkMode', 'disabled');
};

const updateToggle = (checked) => {
    // keep ARIA in sync with the actual control state
    if (!darkModeToggle) return;
    darkModeToggle.setAttribute('aria-checked', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-pressed', checked ? 'true' : 'false');
    darkModeToggle.setAttribute('aria-label', checked ? 'Disable dark mode' : 'Enable dark mode');
};

/* Toggle answers shadow */
function answerButtonShadow(isDark) {
    if(!answerBtns || answerBtns.length === 0) return;
    answerBtns.forEach(btn => {
        btn.classList.toggle('dark', isDark);
        btn.classList.toggle('light', !isDark);
    });
}


/* Toggle buttons shadow */
function applySubjectButtonTheme(isDark) {
  const subBtns = document.querySelectorAll('.subject__button'); // Re-query to get newly added buttons
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

/* Make sun and moon icons clickable */
if (sun) {
  sun.addEventListener('click', (e) => {
    e.preventDefault();
    if (darkModeToggle) darkModeToggle.click();
  });
}

if (moon) {
  moon.addEventListener('click', (e) => {
    e.preventDefault();
    if (darkModeToggle) darkModeToggle.click();
  });
}

// fetch data from JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json')
        .then((response) =>{
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('data', JSON.stringify(data));
            populateData();
        })
        .catch((error) => {
            console.log('There was a problem with the fetch operation ' + error);
       });
});


function populateData() {
    const data = JSON.parse(localStorage.getItem('data'));
    if(!data) return;
    const quizzes = data.quizzes;
    
    /* start page */
    const startContainer = document.createElement('div');
    startContainer.classList.add('grid', 'main__container', 'start__container');
    
    const startIntro = document.createElement('div');
    startIntro.classList.add('start__intro');
    startContainer.appendChild(startIntro);
    
    const title = document.createElement('h1');
    title.classList.add('fs-64', 'fw-300', 'lh-1');
    title.innerHTML = 'Welcome to the ' + `<span class="fw-500">Frontend Quiz!</span>`;
    startIntro.appendChild(title);
    
    const notice = document.createElement('p');
    notice.classList.add('fs-20', 'lh-15', 'fst-italic', 'text-grey-5001', 'notice');
    notice.textContent = 'Pick up subject to get started.';
    startIntro.appendChild(notice);
    
    const subjects = document.createElement('div');
    subjects.classList.add('grid', 'subjects');
    startContainer.appendChild(subjects);
    
    quizzes.forEach((quiz) => {
        subjects.innerHTML += 
            `<button class="flex bg-white fs-28 lh-1 text-blue-900 fw-500 subject__button" type="button" name="subject" value="${quiz.title}" aria-label="Select ${quiz.title} subject">
            <span class="flex bg-orange-50 subject__icon"><img src="${quiz.icon}" alt="${quiz.title} icon"></span> ${quiz.title}</button>`;
    
    });
    
    menuContainer.appendChild(startContainer);
           
    // Apply theme to newly created buttons
    const isDarkMode = darkMode === 'enabled';
    applySubjectButtonTheme(isDarkMode);
    
    /* question page*/
    const subBtns = document.querySelectorAll('.subject__button');
    subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subjTitle = btn.value;
            const selectedQuiz = quizzes.find(quiz => quiz.title === subjTitle);

            if (!selectedQuiz) return;
            
            let currentQuestionIndex = 0;
            let score = 0; // Track correct answers
            const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
            
            // Hide start container
            const startContainer = document.querySelector('.start__container');
            startContainer.classList.add('closed');
                    
            /* create logo */
            const header = document.querySelector('.header');
            
            const logo = document.createElement('div');
            logo.classList.add('flex', 'logo');
            logo.innerHTML = 'Hello';
            logo.classList.add('visi');
            logo.innerHTML = `
                <div class="logo__img bg-purple-100">
                    <img src="${selectedQuiz.icon}" alt="${selectedQuiz.title} icon" />
                </div>
                <p class="fs-28 fw-500 lh-1 logo__text">${selectedQuiz.title}</p>`;
            
            header.insertAdjacentElement('afterbegin', logo);      
            
            // Create question container
            const questionContainer = document.createElement('div');
            questionContainer.classList.add('grid', 'main__container', 'question__container');
                    
            // Create question intro wrapper
            const questionIntro = document.createElement('div');
            questionIntro.classList.add('question__intro');
            questionContainer.appendChild(questionIntro);
                                        
            // Question number
            const questionInfo = document.createElement('p');
            questionInfo.classList.add('fs-20', 'lh-15', 'fst-italic', 'text-grey-5001');
            questionInfo.textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuiz.questions.length}`;
            questionIntro.appendChild(questionInfo);
            
            // Question text
            const question = document.createElement('p');
            question.classList.add('fs-36', 'lh-12', 'fw-500');
            question.textContent = currentQuestion.question;
            questionIntro.appendChild(question);
                    
            // Progress bar container     
            const progressBarContainer = document.createElement('div');
            progressBarContainer.classList.add('bg-grey-50', 'progress__bar-container');
            questionIntro.appendChild(progressBarContainer);
                    
            const progressBar = document.createElement('div');
            progressBar.classList.add('flex', 'progress__bar', 'bg-white');
            progressBarContainer.appendChild(progressBar);
            
            const progress = document.createElement('div');
            progress.classList.add('progress');
            progress.style.width = `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%`;
            progressBar.appendChild(progress);
            
            // Answer options container
            const answerOption = document.createElement('div');
            answerOption.classList.add('grid', 'answer__option');
            questionContainer.appendChild(answerOption);
            
            // Create button for each option
            const optionLetters = ['A', 'B', 'C', 'D'];
            currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('option', 'light', 'bg-white', 'fs-28', 'lh-1', 'fw-500');
                button.type = 'button';
                button.name = 'answer';
                button.value = option;
                
                // Create elements manually to avoid HTML parsing issues
                const tag = document.createElement('span');
                tag.className = 'option__tag bg-grey-50 text-grey-5001';
                tag.textContent = optionLetters[index];
                
                const result = document.createElement('span');
                result.className = 'text-blue-900 result';
                result.textContent = option;
                
                const iconDiv = document.createElement('div');
                iconDiv.innerHTML = `
                    <img class="correct__icon" src="assets/images/icon-correct.svg" alt="correct" />
                    <img class="incorrect__icon" src="assets/images/icon-incorrect.svg" alt="incorrect" />`;
                
                button.appendChild(tag);
                button.appendChild(result);
                button.appendChild(iconDiv);
            
                // Add click handler to mark button as selected
                button.addEventListener('click', () => {
                    // Check if any option is already selected
                    const alreadySelected = answerOption.querySelector('.option.selected');
                    if (alreadySelected) return; // Prevent changing selection
                    
                    // Add 'selected' class to clicked button
                    button.classList.add('selected');
                    
                    // Hide error message when an option is selected
                    error.style.display = 'none';
                    answerValidation(button, currentQuestion);
                });
            
                answerOption.appendChild(button);
                
            });
                    
            // Submit button
            const submitButton = document.createElement('button');
            submitButton.classList.add('fs-28', 'lh-1', 'bg-purple-600', 'submit__button');
            submitButton.textContent = 'Submit Answer';
            answerOption.appendChild(submitButton);
                    
            // Error message
            const error = document.createElement('div');
            error.classList.add('flex', 'error');
            error.innerHTML = `
                <img src="assets/images/icon-error.svg" alt="Error" />
                <p class="fs-24 text-red-500">Please select an answer</p>`;
            answerOption.appendChild(error);
                    
            menuContainer.appendChild(questionContainer);
            
            function answerValidation(selectedButton, question) {
                const correctIcon = selectedButton.querySelector('.correct__icon');
                const incorrectIcon = selectedButton.querySelector('.incorrect__icon');
                
                if(selectedButton.value === question.answer) {
                    // Correct answer - add green border and show checkmark
                    selectedButton.classList.add('correct__answer');
                    correctIcon.classList.add('show');
                    incorrectIcon.classList.add('hide');
                    score++; // Increment score for correct answer
                } else {
                    // Wrong answer - add red border and show X icon
                    selectedButton.classList.add('incorrect__answer');
                    incorrectIcon.classList.add('show');
                    correctIcon.classList.add('hide');
                }
            }
            
            submitButton.addEventListener('click', () => {
                // Check if any option is selected
                const selectedOption = answerOption.querySelector('.option.selected');
                
                if (!selectedOption) {
                    // No option selected - show error
                    error.style.display = 'flex';
                } else {
                    // Option selected - process answer
                    error.style.display = 'none';
                    
                    currentQuestionIndex++;
                    
                    // Check if there are more questions
                    if (currentQuestionIndex < selectedQuiz.questions.length) {
                        // Load next question
                        const nextQuestion = selectedQuiz.questions[currentQuestionIndex];
                        
                        // Update question number
                        questionInfo.textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuiz.questions.length}`;
                        
                        // Update question text
                        question.textContent = nextQuestion.question;
                        
                        // Update progress bar
                        progress.style.width = `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%`;
                        
                        // Clear and rebuild answer options
                        answerOption.innerHTML = '';
                        
                        nextQuestion.options.forEach((option, index) => {
                            const button = document.createElement('button');
                            button.classList.add('option', 'light', 'bg-white', 'fs-28', 'lh-1', 'fw-500');
                            button.type = 'button';
                            button.name = 'answer';
                            button.value = option;
                            
                            // Create elements manually to avoid HTML parsing issues
                            const tag = document.createElement('span');
                            tag.className = 'option__tag bg-grey-50 text-grey-5001';
                            tag.textContent = optionLetters[index];
                            
                            const result = document.createElement('span');
                            result.className = 'text-blue-900 result';
                            result.textContent = option;
                            
                            const iconDiv = document.createElement('div');
                            iconDiv.innerHTML = `
                                <img class="correct__icon" src="assets/images/icon-correct.svg" alt="correct" />
                                <img class="incorrect__icon" src="assets/images/icon-incorrect.svg" alt="incorrect" />`;
                            
                            button.appendChild(tag);
                            button.appendChild(result);
                            button.appendChild(iconDiv);
                            
                            button.addEventListener('click', () => {
                                const alreadySelected = answerOption.querySelector('.option.selected');
                                if (alreadySelected) return;
                                
                                button.classList.add('selected');
                                error.style.display = 'none';
                                answerValidation(button, nextQuestion);
                            });
                            
                            answerOption.appendChild(button);
                        });
                        
                        // Re-add submit button
                        answerOption.appendChild(submitButton);
                        
                        // Re-add error message
                        answerOption.appendChild(error);
                        
                    } else {
                        // Quiz completed - show score page                        
                        questionContainer.classList.add('closed');
                        
                        const scoreContainer = document.createElement('div');
                        scoreContainer.classList.add('grid', 'main__container', 'score__container');
                        
                        const scoreIntro = document.createElement('div');
                        scoreIntro.classList.add('flex', 'score__intro');
                        scoreContainer.appendChild(scoreIntro);
                        
                        const scoreTitle = document.createElement('h1');
                        scoreTitle.classList.add('fs-64', 'fw-300', 'lh-1');
                        scoreTitle.innerHTML = `Quiz completed <br/><span class="fw-500">You scored...</span>`;
                        scoreIntro.appendChild(scoreTitle);
                        
                        const scoreWrapper = document.createElement('div');
                        scoreWrapper.classList.add('flex', 'score__wrapper');
                        scoreContainer.appendChild(scoreWrapper);
                        
                        const scoreData = document.createElement('div');
                        scoreData.classList.add('grid', 'bg-white', 'score__data');
                        scoreData.innerHTML = `
                            <div class="flex logo">
                                <div class="logo__img bg-purple-100">
                                    <img src="assets/images/icon-accessibility.svg" alt="Accessibility icon" />
                                </div>
                                <p class="logo_text fs-28 fw-500 lh-1">Accessibility</p>
                            </div>
                            <div class="grid score__value">
                                <p class="fs-144 totalValue">${score}</p>
                                <p class="fs-24 text-grey-5001">out of ${selectedQuiz.questions.length}</p>
                            </div>`;
                        
                        scoreWrapper.appendChild(scoreData);
                            
                        const playAgainBtn = document.createElement('button');
                        playAgainBtn.classList.add('fs-28', 'lh-1', 'bg-purple-600', 'submit__button');
                        playAgainBtn.textContent = 'Play Again';
                        playAgainBtn.addEventListener('click', () => {
                            window.location.reload();
                        });
                        scoreWrapper.appendChild(playAgainBtn);
                        
                        menuContainer.appendChild(scoreContainer);
                    }
                }
            });
        });
    });
}

