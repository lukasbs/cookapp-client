import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppService} from './app.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private appService: AppService, private http: HttpClient) {}

  async canActivate() {
    this.appService.message = {text: '', type: ''};
    this.appService.messageChanged.next(this.appService.message);

    let data;

    try {
      data = await this.http.post('http://localhost:8080/api/user/auth/isvalid', {}, {
        observe: 'response',
        withCredentials: true
      }).toPromise();
    } catch (e) {
      // console.error(e);
    }

    if (data === undefined || data.status !== 200) {
      await this.router.navigate(['/login-page']);
      this.appService.message = {text: 'Proszę się zalogować aby uzyskać dostęp do tego zasobu!', type: 'ERROR'};
      this.appService.messageChanged.next(this.appService.message);
      return false;
    } else {
      return true;
    }
  }

}
