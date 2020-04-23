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

  constructor(private appService: AppService,  private router: Router) { }

  ngOnInit() {
    this.userDataChanged = this.appService.userDataChanged.subscribe(
      (userData) => {
        this.favouriteRecipes = userData.favouriteRecipes;
      }
    );

    this.appService.getFavouriteRecipes();
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
