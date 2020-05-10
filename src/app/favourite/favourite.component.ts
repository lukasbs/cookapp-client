import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Subscription} from 'rxjs';
import {RecipeModel} from '../model/RecipeModel';
import {Router} from '@angular/router';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit, OnDestroy {
  userDataChanged: Subscription;

  public favouriteRecipes: RecipeModel[] = [];

  constructor(public appService: AppService,  private router: Router) { }

  ngOnInit() {
    this.userDataChanged = this.appService.userDataChanged.subscribe(
      (userData) => {
        this.favouriteRecipes = userData.favouriteRecipes;
      }
    );

    this.appService.getFavouriteRecipes();
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

  previewHandler(i: number) {
    this.appService.currentlyViewedRecipe = this.favouriteRecipes[i];
    this.appService.currentlyViewedRecipeChanged.next(this.appService.currentlyViewedRecipe);
    this.router.navigate(['/recipe-view']);
  }

  ngOnDestroy(): void {
    this.userDataChanged.unsubscribe();
  }
}
