import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class ALMService {

  constructor(private http:Http) {
  }
  getAllFixedDefects() {
    this.fixedDefects = {};
    return this.http.get('http://localhost:3000/defects/status/fixed')
      .map(res => res.json());
  }

  getAllOpenDefects() {
    this.fixedDefects = {};
    return this.http.get('http://localhost:3000/defects/status/open,new,reopen')
      .map(res => res.json());
  }

  getAllInProgressDefects() {
    this.fixedDefects = {};
    return this.http.get('http://localhost:3000/defects/status/noticed')
      .map(res => res.json());
  }


  getAllClosedDefects() {
    this.fixedDefects = {};
    return this.http.get('http://localhost:3000/defects/status/closed')
      .map(res => res.json());
  }
}
