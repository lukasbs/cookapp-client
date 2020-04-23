import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {FridgeItemEditModel} from '../model/FridgeItemEditModel';

@Component({
  selector: 'app-fridge-edit',
  templateUrl: './fridge-edit.component.html',
  styleUrls: ['./fridge-edit.component.scss']
})
export class FridgeEditComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;

  messageChanged: Subscription;

  public item: FridgeItemEditModel;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    if (this.appService.currentlyEditedFridgeItem === undefined || this.appService.currentlyEditedFridgeItem === null) {
      this.router.navigate(['/fridge']);
    }

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.item = this.appService.currentlyEditedFridgeItem;
  }

  editHandler(form: NgForm) {
    if (form.value.name === null || form.value.name === '' || form.value.amount === null || form.value.amount === '' ||
      form.value.expirationDate === null || form.value.amountType === null) {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    } else {
      this.appService.updateFridgeItem(this.item.name, this.item.amount + ' ' + this.item.amountType, this.item.expirationDate,
        form.value.name, form.value.amount + ' ' + form.value.amountType, form.value.expirationDate);
      this.router.navigate(['/fridge']);
    }
  }

  ngOnDestroy(): void {
    this.messageChanged.unsubscribe();
  }

}
