import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {IngredientModel} from '../model/IngredientModel';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;

  messageChanged: Subscription;

  public item: IngredientModel;

  constructor(private appService: AppService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    if (this.appService.currentlyEditedShoppingListItem === undefined || this.appService.currentlyEditedShoppingListItem === null) {
      this.router.navigate(['/shopping-list']);
    }

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.item = this.appService.currentlyEditedShoppingListItem;
  }

  editHandler(form: NgForm) {
    if (form.value.name !== null && form.value.name !== '' && form.value.amount !== null && form.value.amount !== '') {
      this.appService.updateShoppingListItem(this.item.name, this.item.amount, form.value.itemName, form.value.itemAmount);
      this.closeHandler();
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    }
  }

  closeHandler() {
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.messageChanged.unsubscribe();
  }
}
