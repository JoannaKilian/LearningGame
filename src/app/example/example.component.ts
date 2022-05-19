import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.css"],
})
export class ExampleComponent {
  checkedWord: string;
  checkedDefinition: string;
  checkedExample: string;
  checkedError: string;

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
}
