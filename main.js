{
  //クイズのWebAPIを使用して、URLを定義する
  const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";
  //クラスを作成する
  //引数のクイズのデータを基に、クラス内の設計をする。
  class Quiz {
    constructor(quizData) {
      this._quizzes = quizData.results;
      this._correctAnswersNum = 0;
    }
    getQuizCategory(index) {
      return this._quizzes[index - 1].category;
    }
    getQuizDifficulty(index) {
      return this._quizzes[index - 1].difficulty;
    }
    //クイズの長さを取得するためのgetNumQuizメソッド
    getNumOfQuiz() {
      return this._quizzes.length;
    }
    getQuizQuestion(index) {
      return this._quizzes[index - 1].question;
    }
    //クイズの正答を取得するためのgetCorrectAnswerメソッド
    getCorrectAnswer(index) {
      return this._quizzes[index - 1].correct_answer;
    }
    getIncorrerctAnswers(index) {
      return this._quizzes[index - 1].incorrect_answers;
    }
    //クイズの正答数をカウントするためのcountCorrectAnswersNumメソッド
    countCorrectAnswersNum(index, answer) {
      const correctAnswer = this._quizzes[index - 1].correct_answer;
      if (answer === correctAnswer) {
        return this._correctAnswersNum++;
      }
    }
    //カウントした正答数を取得するためのgetCorrectAnswersNumメソッド
    getCorrectAnswersNum() {
      return this._correctAnswersNum;
    }
  }

  const titleElement = document.getElementById("title");
  const questionElement = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const startButton = document.getElementById("start-button");
  const genreElement = document.getElementById("genre");
  const difficultyElement = document.getElementById("difficulty");

  startButton.addEventListener("click", () => {
    startButton.hidden = true;
    fetchQuizData(1);
  });

  //quizInstanceを生成して、fetchで受け取ったクイズのデータをインスタンスの引数に設置する。
  const fetchQuizData = async (index) => {
    titleElement.textContent = "取得中";
    questionElement.textContent = "少々お待ち下さい";
    //アプリケーションが止まらないようにエラーハンドリング
    try {
      const respnse = await fetch(API_URL);
      quizData = await respnse.json();
      const quizInstance = new Quiz(quizData);
      setNextQuiz(quizInstance, index);
    } catch (error) {
      console.log(error);
    }
  };
  const setNextQuiz = (quizInstance, index) => {
    while (answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }

    if (index <= quizInstance.getNumOfQuiz()) {
      //クイズの問題数が10回以下ならmakeQuiz関数へ
      makeQuiz(quizInstance, index);
    } else {
      //それ以外の場合はfinishQuiz関数へ
      finishQuiz(quizInstance);
    }
  };
  //makeQuiz関数でquizInstanceを用いて、”次へ”が押される度に次の問題へ進むクイズを10回表示する実装をする。
  const makeQuiz = (quizInstance, index) => {
    titleElement.innerHTML = `問題${index}`;
    genreElement.innerHTML = `【ジャンル】 ${quizInstance.getQuizCategory(index)}`;
    difficultyElement.innerHTML = `【難易度】${quizInstance.getQuizDifficulty(index)}`;
    questionElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(index)}`;
    //answerを定義
    const answers = buildAnswers(quizInstance, index);

    answers.forEach((answer) => {
      const answerElement = document.createElement("li");
      answersContainer.appendChild(answerElement);
      //ボタンのテキストに答えを表示
      const buttonElement = document.createElement("button");
      buttonElement.innerHTML = answer;
      answersContainer.appendChild(buttonElement);
      //正答数をカウントするインスタンスメソッドを定義
      buttonElement.addEventListener("click", () => {
        quizInstance.countCorrectAnswersNum(index, answer);
        index++;
        setNextQuiz(quizInstance, index);
      });
    });
  };
  const finishQuiz = (quizInstance) => {
    //カウントした正答数を表示
    titleElement.textContent = `あなたの正答数は${quizInstance.getCorrectAnswerNum()}です`;
    //ジャンルや難易度の項目を空白にする
    genreElement.textContent = "";
    difficultyElement.textContent = "";
    //再チャレンジ用の文面を用意
    questionElement.textContent = "再チャレンジしたい場合は下をクリック"; //クイズが終わった後にもう一度スタート画面に戻れるようにする
    const restartButton = document.createElement("button");
    restartButton.textContent = "ホームに戻る";
    answersContainer.appendChild(restartButton);
    restartButton.addEventListener("click", () => {
      location.reload();
    });
  };
  //buildQuiz関数をmakeQuiz関数の中で呼び出す
  const buildAnswers = (quizInstance, index) => {
    const answers = [quizInstance.getCorrectAnswer(index), ...quizInstance.getIncorrerctAnswers(index)];
    return shuffleArray(answers);
  };
  //Answersの配列をシャッフルする処理
  const shuffleArray = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
}
