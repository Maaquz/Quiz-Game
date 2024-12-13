const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");

let currentQuestionIndex = 0;
let score = 0;
let questions = []


// Hämta frågor från json
fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        startQuiz();
    })
    .catch((error) => console.error("Error loading questions:"));


// Starta quiz
function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Nästa fråga";
    showQuestion();
}

// Visa fråga
function showQuestion(){
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question; 

// Lägg till svars knapp
    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.innerHTML = option;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if(option === currentQuestion.answer){
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
    });
}

// Reset inför nästa fråga
function resetState(){
    nextButton.style.display = "none";
    while(answerButton.firstChild){
        answerButton.removeChild(answerButton.firstChild);
    }
    questionElement.classList.remove("correct", "incorrect");
}

// Hantera användar input
function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }

// Highlight korrekt svar
    Array.from(answerButton.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

// Visa spelarens resultat och lägg till 'spela igen' knapp
function showScore(){
    resetState();
    questionElement.innerHTML = `Du fick ${score} av ${questions.length} poäng!`;
    nextButton.innerHTML = "Spela igen";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

startQuiz();