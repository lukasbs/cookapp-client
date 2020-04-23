import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as jsPDF from 'jspdf';
import {IngredientModel} from '../model/IngredientModel';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('name') nameRef: ElementRef;
  @ViewChild('amount') amountRef: ElementRef;

  public shoppingListItems: IngredientModel[] = [];

  userDataChanged: Subscription;
  messageChanged: Subscription;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.userDataChanged = this.appService.userDataChanged.subscribe(
      (userData) => {
        this.shoppingListItems = userData.shoppingListItems;
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.appService.getAllShoppingListItems();
  }

  addHandler(form: NgForm) {
    if (form.value.name === null || form.value.name === '' || form.value.amount === null || form.value.amount === '') {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    } else {
      this.appService.clearClass(this.messageRef.nativeElement);
      this.appService.addShoppingListItem(form.value.name, form.value.amount);
      form.reset();
    }
  }

  deleteHandler(i: number) {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.deleteShoppingListItem(this.shoppingListItems[i].name, this.shoppingListItems[i].amount);
  }

  editHandler(i: number) {
    this.appService.currentlyEditedShoppingListItem = this.shoppingListItems[i];
    this.appService.currentlyEditedShoppingListItemChanged.next(this.appService.currentlyEditedShoppingListItem);
    this.router.navigate(['/shopping-list-edit']);
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(35);
    doc.text(70, 20, 'Lista Zakupów');

    doc.setFontSize(13);

    for (let i = 40, j = 0; j < this.shoppingListItems.length; i += 10, j++) {

      if (j % 25 === 0 && j !== 0) {
        doc.addPage();
        i = 20;
      }

      doc.text(20, i, (j + 1) + '. ' + this.shoppingListItems[j].name);
      doc.text(155, i, this.shoppingListItems[j].amount);

    }

    doc.save('ListaZakupów.pdf');
  }

  ngOnDestroy(): void {
    this.userDataChanged.unsubscribe();
    this.messageChanged.unsubscribe();
  }

}
