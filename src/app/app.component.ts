import { Component, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "translator";
  word: string;
  drawedWord: string;
  definition: string;
  preferSelectWord: string;

  activeEasyTop: boolean = false;
  activeDifficultTop: boolean = false;
  moveEasyButton: boolean = false;
  moveDifficultButton: boolean = false;
  disabledButton: boolean = true;
  disabledBoxButton: boolean = true;

  checkedWord: string;
  checkedDefinition: string;
  checkedExample: string;
  checkedError: string;

  total: number;
  easyNumber: number = 0;
  easyResult: number;
  difficultNumber: number = 0;

  finishGame: boolean = false;

  wordArrayBasic: Array<string> = [
    "home",
    "cat",
    "year",
    "day",
    "woman",
    "life",
    "child",
    "school",
    "family",
    "week",
    // "work",
    // "night",
    // "water",
    // "money",
    // "book",
    // "job",
  ];
  wordArray = this.wordArrayBasic.slice();

  ngOnInit() {
    this.drawTheWord();
    this.total = this.wordArray.length;
    this.easyResult = (this.easyNumber / this.total) * 100;
  }

  onShowDefinition(word: string) {
    this.checkedError = "";
    this.checkedExample = "";
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => response.json())
      .then(
        (data) =>
          (this.checkedDefinition =
            data[0].meanings[0].definitions[0].definition)
      )
      .catch((error: any) => {
        this.checkedError = "Not valid word";
      });
  }
  onShowExample(word: string) {
    this.checkedError = "";
    this.checkedDefinition = "";
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => response.json())
      .then((data) => {
        data[0].meanings.reverse().forEach((item) => {
          item.definitions.forEach((example, index) => {
            if (item.definitions[index].example !== undefined) {
              this.checkedExample = item.definitions[index].example;
            } else return;
          });
        });
      })
      .catch((error: any) => {
        this.checkedError = "Not valid word";
      });
  }

  drawTheWord() {
    const index = Math.floor(Math.random() * this.wordArray.length);
    const drawWord = this.wordArray[index];
    console.log(drawWord);
    this.drawedWord = drawWord;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${drawWord}`)
      .then((response) => response.json())
      .then(
        (data) =>
          (this.definition = data[0].meanings[0].definitions[0].definition)
      )
      .catch((error: any) => {
        console.log("Not valid word in wordArray, index:", index, drawWord);
      });
    this.word = "";
    this.preferSelectWord = "";
    this.activeEasyTop = false;
    this.activeDifficultTop = false;
    this.moveEasyButton = false;
    this.moveDifficultButton = false;
    this.disabledBoxButton = true;
  }
  checkAnswer() {
    if (this.word.toUpperCase() == this.drawedWord.toUpperCase()) {
      console.log("true", this.word, this.drawedWord);
      this.preferSelectWord = "TRUE: click easy BOX";
      this.activeEasyTop = true;
      this.activeDifficultTop = false;
      this.moveEasyButton = true;
    } else {
      console.log("false", this.word, this.drawedWord);
      this.preferSelectWord = "FALSE: click difficult BOX";
      this.activeDifficultTop = true;
      this.activeEasyTop = false;
      this.moveDifficultButton = true;
    }
    this.disabledBoxButton = false;
  }

  onAddPoint(level: string) {
    if (this.word.length > 0) {
      if (level === "easy") {
        this.easyNumber++;
        this.easyResult = (this.easyNumber / this.total) * 100;
        let i = this.wordArray.indexOf(this.drawedWord);
        this.wordArray.splice(i, 1);
        if (this.wordArray.length === 0) {
          this.finishGame = true;
        }
      } else if (level === "difficult") {
        this.difficultNumber++;
      }
      this.word = "";
      this.disabledBoxButton = true;
      this.drawTheWord();
    }
  }
  onNextGame() {
    this.finishGame = false;
    this.wordArray = this.wordArrayBasic.slice();
    this.easyNumber = 0;
    this.difficultNumber = 0;
  }
}
