// select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownContainer = document.querySelector(".countdown");

//set options
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questonsObjs = JSON.parse(this.responseText);
      let qCount = questonsObjs.length;

      // create bullets + set questions count
      createBullets(qCount);

      let randomArr = shuffleArray(qCount);

      // add questions data
      addQuestionData(questonsObjs[randomArr[currentIndex]], qCount);

      // start count down
      countDown(120, qCount);

      // click on sumbit
      submitButton.onclick = () => {
        // get right answer
        let theRightAnswer = questonsObjs[randomArr[currentIndex]].right_answer;

        // increase currenct index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, qCount);

        // remove old question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questonsObjs[randomArr[currentIndex]], qCount);

        // handle bullets class
        handleBullets();

        // start count down
        clearInterval(countDownInterval);
        countDown(120, qCount);

        // show results
        showResults(qCount);
      };
    }
  };
  myRequest.open(
    "GET",
    "https://hassanwalaa.github.io/josn/html_questions-en.json",
    true
  );

  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // create spans
  for (let i = 0; i < num; i++) {
    // create span
    let span = document.createElement("span");

    // put on class to the first span in the group
    if (i === 0) {
      span.className = "on";
    }
    //apend the span in spans element
    bulletsSpansContainer.appendChild(span);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 questions title
    let questionTitle = document.createElement("h2");

    // create question text

    questionTitle.textContent = obj.title;

    // add the title to it's cotainer
    quizArea.appendChild(questionTitle);

    // create a random arrange fort the questions
    let randomAnswer = shuffleArray(Object.keys(obj).length - 2);

    for (let i = 0; i < Object.keys(obj).length - 2; i++) {
      // creating the answer div
      let answerDiv = document.createElement("div");

      // adding the class to it
      answerDiv.className = "answer";

      // create input + label
      let answerInput = document.createElement("input");
      let answerLabel = document.createElement("label");

      // check the first element
      if (i === 0) {
        answerInput.checked = true;
      }
      // adding attr to the input
      answerInput.id = `answer_${randomAnswer[i] + 1}`;
      answerInput.type = "radio";
      answerInput.name = "questions";
      answerInput.dataset.answer = obj[`answer_${randomAnswer[i] + 1}`];
      // adding attrs to the label
      answerLabel.htmlFor = `answer_${randomAnswer[i] + 1}`;
      // adding the text to the lable
      answerLabel.textContent = obj[`answer_${randomAnswer[i] + 1}`];
      // appending the input and the label to the answer div
      answerDiv.appendChild(answerInput);
      answerDiv.appendChild(answerLabel);
      // ading answer div the it's container
      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (theChoosenAnswer === rAnswer) {
    rightAnswer++;
    console.log("good answer");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let myspan;
  let myText;
  if (currentIndex === count) {
    console.log("qustions is finished");
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      myspan = document.createElement("span");
      myspan.className = "good";
      myspan.textContent = "Good";
      myText = document.createTextNode(
        ` You Answered ${rightAnswer} questions of ${count} that is good and you can do better`
      );
    } else if (rightAnswer === count) {
      myspan = document.createElement("span");
      myspan.className = "perfect";
      myspan.textContent = "Perfect";
      myText = document.createTextNode(
        ` You Answered ${rightAnswer} questions of ${count} that is perfect`
      );
    } else {
      myspan = document.createElement("span");
      myspan.className = "bad";
      myspan.textContent = "Bad";
      myText = document.createTextNode(
        ` You Answered ${rightAnswer} questions of ${count} you need to work more`
      );
    }
    results.appendChild(myspan);
    results.appendChild(myText);
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownContainer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

function shuffleArray(qCount) {
  // create random arrange for the qustions
  let arr = [];
  for (let i = 0; i < qCount; i++) {
    arr[i] = i;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
