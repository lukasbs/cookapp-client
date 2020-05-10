import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FridgeItemModel} from '../model/FridgeItemModel';
import {AppService} from '../app.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FridgeItemEditModel} from '../model/FridgeItemEditModel';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.component.html',
  styleUrls: ['./fridge.component.scss']
})
export class FridgeComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('name') nameRef: ElementRef;
  @ViewChild('amount') amountRef: ElementRef;
  @ViewChild('expirationDate') expirationDateRef: ElementRef;

  messageChanged: Subscription;
  userDataChanged: Subscription;

  public fridgeItems: FridgeItemModel[] = [];

  constructor(public appService: AppService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userDataChanged = this.appService.userDataChanged.subscribe(
      (userData) => {
        this.fridgeItems = userData.fridgeItems;
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.appService.getFridgeItems();
  }

  addHandler(form: NgForm) {
    if (form.value.name === null || form.value.name === '' || form.value.amount === null || form.value.amount === '' ||
      form.value.expirationDate === null || form.value.amountType === null) {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić wszystkie pola!');
    } else {
      this.appService.clearClass(this.messageRef.nativeElement);
      this.appService.addFridgeItem(form.value.name, form.value.amount + ' ' + form.value.amountType, form.value.expirationDate);
      form.reset();
    }
  }

  getItemClass(i: number) {
    const currentDate = new Date();
    const tomorrowDate: Date = new Date(new Date().setDate(currentDate.getDate() + 1)) ;
    if (this.fridgeItems[i].expirationDate.toLocaleDateString() === currentDate.toLocaleDateString() ||
      this.fridgeItems[i].expirationDate.toLocaleDateString() === tomorrowDate.toLocaleDateString()) {
        return {'text-warning': true};
    } else if (this.fridgeItems[i].expirationDate < currentDate) {
      return {'text-danger': true};
    } else {
      return {'text-success': true};
    }
  }

  deleteExpiredHandler() {
    const itemsCopy: FridgeItemModel[] = this.fridgeItems;
    for (const item of itemsCopy) {
      if (item.expirationDate < (new Date())) {
        this.appService.deleteFridgeItem(item.name, item.amount, item.expirationDate);
      }
    }
  }

  deleteHandler(i: number) {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.deleteFridgeItem(this.fridgeItems[i].name, this.fridgeItems[i].amount, this.fridgeItems[i].expirationDate);
  }

  // editHandler(i: number) {
  //   this.appService.currentlyEditedFridgeItem = new FridgeItemEditModel(this.fridgeItems[i].name, this.fridgeItems[i].amount.split(' ')[0],
  //     this.fridgeItems[i].amount.split(' ')[1], this.fridgeItems[i].expirationDate);
  //
  //   this.appService.currentlyEditedFridgeItemChanged.next(this.appService.currentlyEditedFridgeItem);
  //   this.router.navigate(['/fridge-edit']);
  // }

  editHandler(i: number, fridgeEdit) {
    this.appService.currentlyEditedFridgeItem = new FridgeItemEditModel(this.fridgeItems[i].name, this.fridgeItems[i].amount.split(' ')[0],
      this.fridgeItems[i].amount.split(' ')[1], this.fridgeItems[i].expirationDate);

    this.appService.currentlyEditedFridgeItemChanged.next(this.appService.currentlyEditedFridgeItem);
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { edit: 'true' },
        queryParamsHandling: 'merge'
      });
    this.modalService.open(fridgeEdit, { centered: true, backdropClass: 'modal-dark-backdrop'})
      .result.then(() => {}, () => {
      this.router.navigate(['/fridge']);
    });
  }

  ngOnDestroy(): void {
    this.userDataChanged.unsubscribe();
    this.messageChanged.unsubscribe();
  }

}
