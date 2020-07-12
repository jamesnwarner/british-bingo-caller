import { Component, OnInit } from "@angular/core";
import { BingoNumberService } from "./bingo-number-service";
import { BingoNumber } from "./bingo-number";

let bingoNumbers: BingoNumber[] = [];

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private bingoNumberService: BingoNumberService) {}

  ngOnInit() {
    console.log(bingoNumbers);

    this.bingoNumberService.getJson().subscribe((data) => {
      console.log("GOT NUMBERS!");
      console.log(data);
      bingoNumbers = data;

      bingoNumbers.forEach((number) => {
        console.log(`Number: ${number.value}`);
      });
    });
  }
}
