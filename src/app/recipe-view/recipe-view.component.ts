import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {RecipeModel} from '../model/RecipeModel';
import {Subscription} from 'rxjs';
import {FridgeItemModel} from '../model/FridgeItemModel';
import {IngredientModel} from '../model/IngredientModel';
import {Router} from '@angular/router';
import {it} from '@angular/core/testing/src/testing_internal';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;

  messageChanged: Subscription;
  userDataChanged: Subscription;

  favourite: boolean;
  highlight: boolean;

  public recipe: RecipeModel;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    if (this.appService.currentlyViewedRecipe === undefined || this.appService.currentlyViewedRecipe === null) {
      this.router.navigate(['/recipe-list']);
    }

    this.recipe = this.appService.currentlyViewedRecipe;

    this.favourite = this.isFavourite();
    this.highlight = false;

    this.userDataChanged = this.appService.userDataChanged.subscribe(
      () => {
        this.favourite = this.isFavourite();
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );
  }

  isFavourite() {
    for (const favourite of this.appService.userData.favouriteRecipes) {
      if (favourite.name === this.recipe.name) {
        return true;
      }
    }
    return false;
  }

  getHighlightClass(i: number) {
    let bgClass;
    if (this.highlight) {
      const foundProduct: FridgeItemModel = this.findInFridge(this.recipe.ingredients[i].name);
      if (foundProduct !== null) {
        bgClass = {'text-warning': true};
        if (this.checkQuantity(foundProduct, this.recipe.ingredients[i].amount)) {
          bgClass = {'text-success': true};
        }
      } else {
        bgClass = {'text-danger': true};
      }
    }
    return bgClass;
  }

  checkQuantity(fridgeProduct: FridgeItemModel, recipeIngredientAmount: string) {
    if (fridgeProduct === null) {
      return false;
    }

    const fridgeProductQuantity = fridgeProduct.amount.toLowerCase().split( ' ')[0].replace(',', '.');
    const fridgeProductUnit = fridgeProduct.amount.toLowerCase().split( ' ')[1];

    const recipeIngredientQuantity = recipeIngredientAmount.toLowerCase().split(' ')[0].replace(',', '.');
    const recipeIngredientUnit = recipeIngredientAmount.toLowerCase().split(' ')[1];

    if (recipeIngredientUnit === null || recipeIngredientUnit === undefined) {
      return false;
    }

    if (recipeIngredientUnit === 'szczypta' || recipeIngredientUnit === 'szczypty' || recipeIngredientUnit === 'szczypt'
          || recipeIngredientUnit === 'do smaku' || recipeIngredientUnit === 'wedle uznania' || recipeIngredientQuantity === '0') {
      return true;
    }

    const normalizedProduct: {quantity: number, unit: string} =
      this.normalize(Number(fridgeProductQuantity), fridgeProductUnit);
    const normalizedIngredient: {quantity: number, unit: string} =
      this.normalize(Number(recipeIngredientQuantity), recipeIngredientUnit);

    if (normalizedProduct === null || normalizedIngredient === null) {
      return false;
    } else if (normalizedProduct.unit === normalizedIngredient.unit) {
      return normalizedProduct.quantity >= normalizedIngredient.quantity;
    } else if ((normalizedProduct.unit === 'g' || normalizedProduct.unit === 'ml') && (normalizedIngredient.unit === 'szklanek' ||
        normalizedIngredient.unit === 'łyżek' || normalizedIngredient.unit === 'łyżeczek' || normalizedIngredient.unit === 'ml' ||
        normalizedIngredient.unit === 'g')) {
      return normalizedProduct.quantity >= this.getConvertedAmount(normalizedIngredient);
    }

    return false;
  }

  normalize(quantity: number, unit: string) {
    switch (unit) {
      case 'g':
      case 'gram':
      case 'gramy':
      case 'gramów':
        return {quantity, unit: 'g'};
      case 'ml':
      case 'mililitr':
      case 'mililitry':
      case 'mililitrów':
      case 'mililitra':
        return {quantity, unit: 'ml'};
      case 'szt.':
      case 'sztuka':
      case 'sztuki':
      case 'sztuk':
        return {quantity, unit: 'sztuk'};
      case 'szklanka':
      case 'szklanki':
      case 'szklanek':
        return {quantity, unit: 'szklanek'};
      case 'łyżka':
      case 'łyżki':
      case 'łyżek':
        return {quantity, unit: 'łyżek'};
      case 'łyżeczka':
      case 'łyżeczek':
      case 'łyżeczki':
        return {quantity, unit: 'łyżeczek'};
      case 'kg':
      case 'kilo':
      case 'kilogram':
      case 'kilogramy':
      case 'kilogramów':
        return {quantity: quantity * 1000 , unit: 'g'};
      case 'dag':
      case 'dkg':
      case 'dg':
      case 'deko':
      case 'dekagram':
      case 'dekagramy':
      case 'dekagramów':
        return {quantity: quantity * 10 , unit: 'g'};
      case 'l':
      case 'litr':
      case 'litry':
      case 'litrów':
        return {quantity: quantity * 1000 , unit: 'ml'};
      case 'opak.':
      case 'opakowanie':
      case 'opakowania':
      case 'opakowań':
        return {quantity , unit: 'sztuk'};
      default:
        return null;
    }
  }

  getConvertedAmount(ingredient: {quantity: number, unit: string}) {
    if (ingredient.unit === 'łyżek') {
      return ingredient.quantity * 20;
    } else if (ingredient.unit === 'łyżeczek') {
      return ingredient.quantity * 8;
    } else if (ingredient.unit === 'szklanek') {
      return ingredient.quantity * 300;
    } else {
      return ingredient.quantity * 1.25;
    }
  }

  findInFridge(name: string) {
    const currentDate = new Date();
    const itemsList = [];
    for (const item of this.appService.userData.fridgeItems) {
      if ((name.toLowerCase() === item.name.toLowerCase() || this.compareMultiWordProducts(name, item.name)) &&
            item.expirationDate >= currentDate) {
        itemsList.push(item);
      }
    }

    if (itemsList.length > 1) {
      let mlCount = 0;
      let gCount = 0;
      let sztCount = 0;

      for (const item of itemsList) {
        if (this.getUnitFromFridgeItemAmount(item.amount) === 'g') {
          gCount += this.getQuantityFromFridgeItemAmount(item.amount);
        } else if (this.getUnitFromFridgeItemAmount(item.amount) === 'ml') {
          mlCount += this.getQuantityFromFridgeItemAmount(item.amount);
        } else {
          sztCount += this.getQuantityFromFridgeItemAmount(item.amount);
        }
      }

      if (gCount >= mlCount && gCount >= sztCount) {
        return new FridgeItemModel(itemsList[0].name, gCount + ' g', itemsList[0].expirationDate);
      } else if (mlCount >= gCount && mlCount >= sztCount) {
        return new FridgeItemModel(itemsList[0].name, mlCount + ' ml', itemsList[0].expirationDate);
      } else {
        return new FridgeItemModel(itemsList[0].name, sztCount + ' szt.', itemsList[0].expirationDate);
      }
    } else if (itemsList.length === 1) {
      return itemsList[0];
    } else {
      return null;
    }
  }

  getUnitFromFridgeItemAmount(amount: string) {
    return amount.toLowerCase().split( ' ')[1].trim();
  }

  getQuantityFromFridgeItemAmount(amount: string) {
    return Number(amount.toLowerCase().split( ' ')[0].replace(',', '.').trim());
  }

  compareMultiWordProducts(ingredient: string, fridgeItem: string) {
    const ingredientArray = ingredient.toLowerCase().split(' ').sort();
    const fridgeItemArray = fridgeItem.toLowerCase().split(' ').sort();

    if (ingredientArray.length !== fridgeItemArray.length) {
      return false;
    } else {
      for (let i = 0; i < ingredientArray.length; i++) {
        if (ingredientArray[i] !== fridgeItemArray[i]) {
          return false;
        }
      }
    }
    return true;
  }

  addToListHandler() {
    this.appService.clearClass(this.messageRef.nativeElement);
    for (const ingredient of this.recipe.ingredients) {
      this.appService.addShoppingListItem(ingredient.name, ingredient.amount);
    }
  }

  addMissingToListHandler() {
    this.appService.clearClass(this.messageRef.nativeElement);
    for (const ingredient of this.recipe.ingredients) {
      if (this.findInFridge(ingredient.name) === null) {
        this.appService.addShoppingListItem(ingredient.name, ingredient.amount);
      }
    }
  }

  addMissingAnduncertainToListHandler() {
    this.appService.clearClass(this.messageRef.nativeElement);
    for (const ingredient of this.recipe.ingredients) {
      const foundProduct: FridgeItemModel = this.findInFridge(ingredient.name);
      if (foundProduct === null || (!this.checkQuantity(foundProduct, ingredient.amount))) {
        this.appService.addShoppingListItem(ingredient.name, ingredient.amount);
      }
    }
  }

  addHandler() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.addFavourite(this.recipe.name);
  }

  deleteHandler() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.deleteFavourite(this.recipe.name);
  }

  ngOnDestroy(): void {
    this.messageChanged.unsubscribe();
    this.userDataChanged.unsubscribe();
  }

}
