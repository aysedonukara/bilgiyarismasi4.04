const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
//const questionCounterText = document.getElementById('questionCounter'); //ilk 1/3 için kullandığımız kod.
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];


let questions = [];

fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple'
).then((res) => {
    return res.json();
}).then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => { //map() function sayesinde dizi içerisinde dizi oluşturduk.
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer);
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });

        return formattedQuestion;
    });
    startGame();
    
}).catch((err) => {
    console.error(err);
});


const CORRECT_BONUS = 10;
const MAX_QUESTION = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};
getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTION) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Soru ${questionCounter}/${MAX_QUESTION}`;
    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTION}`;  //altgr + ; = `$
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);

            getNewQuestion();

        }, 300);

    });
});
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
