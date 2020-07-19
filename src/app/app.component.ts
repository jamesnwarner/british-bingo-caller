import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BingoNumberService } from './bingo-number-service';
import { BingoNumber } from './bingo-number';
import { interval } from 'rxjs';

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
  previouslyGeneratedNumbers = [];

  speech;
  sub;

  gameRunning = false;

  constructor(
    private bingoNumberService: BingoNumberService,
    private changeDetection: ChangeDetectorRef
  ) {}

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

  startBingo() {
    this.gameRunning = true;

    this.nextNumber();
    console.log(this.sub);
    if (!this.sub) {
      this.startTimer();
    }
  }

  nextNumber() {
    let randomNumber = this.getRandomNumber();

    while (randomNumber.drawn) {}
    {
      randomNumber = this.getRandomNumber();
    }
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
    return this.bingoNumbers[
      Math.floor(Math.random() * this.bingoNumbers.length)
    ];
  }

  speakWords(words) {
    try {
      console.log(this.speech);
      this.speech.speak({
        text: words,
      });
      console.log('Words spoken!');
    } catch (error) {
      console.log(error);
    }

    console.log(this.sub);
  }

  startTimer() {
    this.sub = interval(8000)
      .pipe()
      .subscribe(() => {
        this.nextNumber();
      });
  }

  pauseBingo() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
