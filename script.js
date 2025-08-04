document.addEventListener('DOMContentLoaded', () => {
    // Elemts for Quiz Setup
    const questionCountDiplay = document.querySelector("#num-questions")
    const categoryDisplay = document.querySelector("#category")
    const quizSetup = document.querySelector("#quiz-setup-form")
    const skelton = document.querySelector('.skeleton-container')
    const startBtn = document.querySelector('.start-btn')
    // Element for Quiz
    const quiz = document.querySelector('.quiz-container')
    const questionCounter = document.querySelector('#question-counter')
    const score = document.querySelector('#score')
    const question = document.querySelector('#question')
    const answerButtons = document.querySelector('#answer-buttons')
    const nextBtn = document.querySelector('#next-btn')
    // Element For Result
    const finalScore = document.querySelector('#final-score')
    const scorePercentage = document.querySelector('#score-percentage')
    const resultContainer = document.querySelector('.result-container')
    const restartBtn = document.querySelector('#restart-btn')


    let questions = []
    let currentQuestionNumber = 0
    let totalScore = 0

    restartBtn.addEventListener('click', restartQuiz)
    quizSetup.addEventListener('submit', startQuiz)
    nextBtn.addEventListener('click', () => {
        currentQuestionNumber++
        if (currentQuestionNumber < questions.length) {
            quiz.classList.add('hidden')
            skelton.classList.remove('hidden')
            setTimeout(() => {
                displayQuestion()
            }, 300);

        } else {
            quiz.classList.add('hidden')
            skelton.classList.remove('hidden')
            setTimeout(() => {
                showResult()
            }, 300);
        }
    })

    async function startQuiz() {
        event.preventDefault()
        let questionCount = questionCountDiplay.value
        let categoty = categoryDisplay.value
        try {
            let question = await getQuestions(questionCount, categoty)
            questions = question.results
        } catch (error) {
            alert("Unable to Start Quiz")
        }
        finally {
            quizSetup.classList.add('hidden')
            skelton.classList.remove('hidden')
            setTimeout(() => {
                displayQuestion()
            }, 200);

        }

    }

    function displayQuestion() {
        skelton.classList.add('hidden')
        quiz.classList.remove('hidden')
        questionCounter.innerHTML = `Question ${currentQuestionNumber + 1} of ${questions.length}`
        
        question.innerHTML = questions[currentQuestionNumber].question
        answerButtons.innerHTML = ''
        nextBtn.classList.add('hidden')

        let options = []
        options.push(questions[currentQuestionNumber].correct_answer)
        questions[currentQuestionNumber].incorrect_answers.forEach(option => options.push(option));
        shuffleArray(options)
        options.forEach((option) => {
            const btn = document.createElement('button')
            btn.classList.add('btn')
            btn.innerHTML = `${option}`
            answerButtons.append(btn)
            btn.addEventListener('click', () => {
                selectAnswer(option, btn)
                nextBtn.classList.remove('hidden')
            }, { once: true })
        })
    }

    function selectAnswer(option, selectedBtn) {
        const allBtn = document.querySelectorAll('.btn')
        allBtn.forEach((btns) => {
            btns.classList.add('disabled')
            if (btns.textContent === questions[currentQuestionNumber].correct_answer) {
                btns.classList.add('correct')
            }
        })

        if (option === questions[currentQuestionNumber].correct_answer) {
            totalScore++
            selectedBtn.classList.add('correct')
        } else {
            selectedBtn.classList.add('incorrect')
        }
        score.innerHTML = `Score: ${totalScore}`
    }
    // Shuffles array elements in place
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    function showResult() {
        skelton.classList.add('hidden')
        resultContainer.classList.remove('hidden')
        quiz.classList.add('hidden')
        finalScore.innerHTML = `${totalScore}/${questions.length}`
        const percentage = ((totalScore / questions.length) * 100).toFixed(2)
        scorePercentage.innerHTML = `${percentage}%`

    }

    function restartQuiz() {
        resultContainer.classList.add('hidden');
        quizSetup.classList.remove('hidden');
        questions = [];
        currentQuestionNumber = 0;
        totalScore = 0;
    }
    // Getting Question from API
    async function getQuestions(count, cat) {
        let respose = await fetch(`https://opentdb.com/api.php?amount=${count}&category=${cat}&type=multiple`)
        if (!respose.ok) {
            throw new Error("Unable to Start the Quiz")
        }
        let questions = await respose.json()
        return questions
    }
})