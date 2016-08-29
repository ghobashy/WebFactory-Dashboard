import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class ALMService {

  constructor(private http:Http) {
  }
  getAllDefects(){
    return this.http.get('http://localhost:3000/alm/all')
      .map(res => res.json());
  }
}
