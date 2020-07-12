import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { BingoNumberService } from "./bingo-number-service";
import { BingoNumber } from "./bingo-number";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  bingoNumbers: BingoNumber[] = [];

  generatedNumber;
  generatedNumberText;
  previouslyGeneratedNumbers = [];

  constructor(
    private bingoNumberService: BingoNumberService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.bingoNumberService.getJson().subscribe((data) => {
      this.bingoNumbers = data;
      console.log(this.bingoNumbers);
    });
  }

  nextNumber() {
    let randomNumber = this.getRandomNumber();

    while (randomNumber.drawn) {
      randomNumber = this.getRandomNumber();
    }
    this.generatedNumber = randomNumber.value;
    this.generatedNumberText = randomNumber.text;

    const numberIndex = this.bingoNumbers.indexOf(randomNumber);
    const updatedBingoNumber = randomNumber;
    updatedBingoNumber.drawn = true;
    this.bingoNumbers[numberIndex] = updatedBingoNumber;
    this.changeDetection.detectChanges();
  }

  getRandomNumber() {
    return this.bingoNumbers[
      Math.floor(Math.random() * this.bingoNumbers.length)
    ];
  }
}
