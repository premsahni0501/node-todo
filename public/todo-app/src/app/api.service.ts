import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loginStatus: boolean = true;
  constructor() { }

  getLoginStatus(){
    return this.loginStatus;
  }

  setLoginStatus(status: boolean){
    this.loginStatus = status;
  }
}
