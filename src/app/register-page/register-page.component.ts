import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  @ViewChild('loginInput') loginInputRef: ElementRef;
  @ViewChild('passwordInput') passwordInputRef: ElementRef;
  @ViewChild('repeatPasswordInput') repeatPasswordInputRef: ElementRef;

  @ViewChild('message') messageRef: ElementRef;

  private messageSubscription: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.messageSubscription = this.appService.messageChanged
      .subscribe(
        () => {
          if (this.appService.message.type === 'ERROR') {
            this.appService.addErrorMessage(this.messageRef.nativeElement, this.appService.message.text);
          }
        }
      );
    this.appService.messageChanged.next(this.appService.message);
  }

  doRegister() {
    const login = this.loginInputRef.nativeElement.value;
    const pass = this.passwordInputRef.nativeElement.value;
    const repeatPass = this.repeatPasswordInputRef.nativeElement.value;

    if(pass !== repeatPass) {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Podane hasła nie są takie same!');
    } else if (login !== null && login !== '' && pass !== null && pass !== '' && repeatPass !== null && repeatPass !== '') {
      this.appService.doRegister(login, pass);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę podać login i hasło!');
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

}
