import { Component, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "translator";
  word: string = "";
  drawedWord: string;
  definition: string;
  preferSelectWord: string;

  activeEasyTop: boolean = false;
  activeDifficultTop: boolean = false;
  moveEasyButton: boolean = false;
  moveDifficultButton: boolean = false;
  disabledButton: boolean = true;
  disabledBoxButton: boolean = true;

  total: number;
  easyNumber: number = 0;
  difficultNumber: number = 0;

  startGame: boolean = true;
  valueSlider: number = 10;
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
    "work",
    "night",
    "water",
    "money",
    "book",
    "job",
    "drink",
    "internet",
    "circle",
    "building",
  ];
  wordCoppyBasicArray: Array<string> = [];
  wordStartArray: Array<string> = [];
  wordArray: Array<string> = [];

  onStartGame() {
    this.wordCoppyBasicArray = this.wordArrayBasic.slice();
    for (let i = 0; i < this.valueSlider; i++) {
      let index: number = Math.floor(
        Math.random() * this.wordCoppyBasicArray.length
      );
      this.wordStartArray.push(this.wordCoppyBasicArray[index]);
      this.wordCoppyBasicArray.splice(index, 1);
    }
    this.wordArray = this.wordStartArray.slice();
    this.total = this.wordArray.length;
    this.drawTheWord();
    this.startGame = false;
  }

  drawTheWord() {
    const index = Math.floor(Math.random() * this.wordArray.length);
    const drawWord = this.wordArray[index];
    console.log("word:", drawWord);
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
      this.preferSelectWord = "TRUE: click easy BOX";
      this.activeEasyTop = true;
      this.activeDifficultTop = false;
      this.moveEasyButton = true;
    } else {
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
    this.startGame = true;
  }
}
