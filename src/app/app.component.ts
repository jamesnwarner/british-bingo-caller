import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  previouslyGeneratedNumbers = [];

  speech;

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

    const wordsToSay = `${randomNumber.text}, ${randomNumber.value}`;
    this.speakWords(wordsToSay);
  }

  getRandomNumber() {
    return this.bingoNumbers[
      Math.floor(Math.random() * this.bingoNumbers.length)
    ];
  }

  speakWords(words) {
    console.log(this.speech);
    this.speech
      .speak({
        text: words,
      })
      .then(() => {
        console.log('Success !');
      })
      .catch((e) => {
        console.error('An error occurred :', e);
      });
  }
}
