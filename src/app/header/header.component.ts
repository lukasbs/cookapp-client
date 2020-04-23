import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private appService: AppService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  logoutHandler() {
    this.http.post('http://localhost:8080/api/user/auth/logout', { }, {
      observe: 'response',
      withCredentials: true
    }).subscribe();

    this.router.navigate(['/login-page']);
  }

}
