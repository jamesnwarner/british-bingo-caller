import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class BingoNumberService {
  constructor(private http: HttpClient) {
    this.getJson().subscribe((data) => {
      console.log(data);
    });
  }

  public getJson(): Observable<any> {
    return this.http.get("../assets/numbers.json");
  }
}
