import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {FridgeItemModel} from '../model/FridgeItemModel';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  @ViewChild('message') messageRef: ElementRef;
  public searchValue;
  public currentPageRecipes = null;

  recipeListChanged: Subscription;
  currentRecipesPageChanged: Subscription;
  messageChanged: Subscription;

  constructor(public appService: AppService, private router: Router) { }

  ngOnInit() {
    this.recipeListChanged = this.appService.recipeListChanged.subscribe(
      (recipeList) => {
        recipeList.sort((a, b) => a.name.localeCompare(b.name));
        this.appService.recipeListChunked = this.appService.cutIntoChunks(recipeList);

        if (this.appService.currentRecipesPage > this.appService.recipeListChunked.length - 1) {
          this.appService.currentRecipesPage = this.appService.recipeListChunked.length - 1;
        } else if (this.appService.currentRecipesPage < 0) {
          this.appService.currentRecipesPage = 0;
        }

        this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      }
    );

    this.currentRecipesPageChanged = this.appService.currentRecipesPageChanged.subscribe(
      (page) => {
        this.currentPageRecipes = this.appService.recipeListChunked[page];
      }
    );

    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );

    this.appService.getAllRecipes();
    this.appService.getFridgeItems();
  }

  getOverflowClass(recipeNameRef) {
    if ((recipeNameRef.scrollWidth > recipeNameRef.offsetWidth) && !recipeNameRef.innerHTML.toString().includes('...')) {
      while (recipeNameRef.scrollWidth > recipeNameRef.offsetWidth) {
        recipeNameRef.innerHTML = recipeNameRef.innerHTML.slice(0, -1);
      }
      recipeNameRef.innerHTML = recipeNameRef.innerHTML.toString().slice(0, -1);
      recipeNameRef.innerHTML += '...';
    }
    return {'': true};
  }

  nextPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentRecipesPage++;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  previousPage() {
    this.appService.clearClass(this.messageRef.nativeElement);
    this.appService.currentRecipesPage--;
    this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
  }

  previewHandler(i: number) {
    this.appService.currentlyViewedRecipe = this.currentPageRecipes[i];
    this.appService.currentlyViewedRecipeChanged.next(this.appService.currentlyViewedRecipe);
    this.router.navigate(['/recipe-view']);
  }

  searchHandler(form: NgForm) {
    this.appService.clearClass(this.messageRef.nativeElement);
    if (form.value.searchRecipe !== null && form.value.searchRecipe !== '') {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.searchForRecipes(form.value.searchRecipe);
    } else {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.getAllRecipes();
    }
  }

  explicitSearchHandler(form: NgForm) {
    this.appService.clearClass(this.messageRef.nativeElement);
    if (form.value.searchRecipe !== null && form.value.searchRecipe !== '') {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.searchForRecipesExplicit(form.value.searchRecipe);
    } else {
      this.appService.currentRecipesPage = 0;
      this.appService.currentRecipesPageChanged.next(this.appService.currentRecipesPage);
      this.appService.getAllRecipes();
    }
  }

  addFromFridge() {
    const fridgeItemsWithoutExpired: FridgeItemModel[] = this.appService.removeExpiredProducts(this.appService.userData.fridgeItems);

    let val = '';
    for (let i = 0; i < fridgeItemsWithoutExpired.length; i++) {
      if (i === 0) {
        val += fridgeItemsWithoutExpired[i].name;
      } else {
        val += ', ' + fridgeItemsWithoutExpired[i].name;
      }
    }
    this.searchValue = val;
  }

  ngOnDestroy(): void {
    this.recipeListChanged.unsubscribe();
    this.currentRecipesPageChanged.unsubscribe();
    this.messageChanged.unsubscribe();
  }
}
