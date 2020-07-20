import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BingoNumberService } from './bingo-number-service';
import { BingoNumber } from './bingo-number';

import Speech from 'speak-tts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  bingoNumbers: BingoNumber[] = [];

  generatedNumber;
  generatedNumberText;
  drawnNumbers = [];

  speech;

  myInnerHeight = (window.innerHeight * 0.7);

  constructor(
    private bingoNumberService: BingoNumberService,
    private changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bingoNumberService.getJson().subscribe((data) => {
      this.bingoNumbers = data;
      console.log(this.bingoNumbers);

      this.initializeSpeechLibrary();
    });
  }

  initializeSpeechLibrary() {
    this.speech = new Speech();
    this.speech.init().then(() => {
      this.speech.setLanguage('en-GB');
      this.speech.setVoice('Google UK English Female');
    });
  }

  nextNumber() {
    let randomNumber = this.getRandomNumber();

    while (this.drawnNumbers.includes(randomNumber.value)) {
      randomNumber = this.getRandomNumber();
    }
    this.drawnNumbers.push(randomNumber.value);

    this.generatedNumber = randomNumber.value;
    this.generatedNumberText = randomNumber.text;

    const numberIndex = this.bingoNumbers.indexOf(randomNumber);
    const updatedBingoNumber = randomNumber;
    updatedBingoNumber.drawn = true;
    this.bingoNumbers[numberIndex] = updatedBingoNumber;
    this.changeDetection.detectChanges();

    const wordsToSay = `${randomNumber.text}. ${randomNumber.value}`;
    this.speakWords(wordsToSay);
  }

  getRandomNumber() {
    const undrawnNumbers = this.getUndrawnNumbers();
    return undrawnNumbers[
      Math.floor(Math.random() * undrawnNumbers.length)
    ];
  }

  getUndrawnNumbers() {
    const undrawnNumbers = this.bingoNumbers.filter((bingoNumber) => {
      return bingoNumber.drawn === false;
    });

    console.log(undrawnNumbers.length + ' numbers remaining...');
    return undrawnNumbers;
  }

  speakWords(words) {
    this.speech.speak({
      text: words,
    });
  }
}
