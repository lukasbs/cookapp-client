import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './auth.guard';
import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {RecipeViewComponent} from './recipe-view/recipe-view.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {ShoppingListEditComponent} from './shopping-list-edit/shopping-list-edit.component';
import {FridgeComponent} from './fridge/fridge.component';
import {FavouriteComponent} from './favourite/favourite.component';
import {FridgeEditComponent} from './fridge-edit/fridge-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/login-page', pathMatch: 'full'},
  { path: 'recipe-list', component: RecipeListComponent, canActivate: [AuthGuard]},
  { path: 'recipe-view', component: RecipeViewComponent, canActivate: [AuthGuard]},
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard]},
  { path: 'shopping-list-edit', component: ShoppingListEditComponent, canActivate: [AuthGuard]},
  { path: 'fridge', component: FridgeComponent, canActivate: [AuthGuard]},
  { path: 'fridge-edit', component: FridgeEditComponent, canActivate: [AuthGuard]},
  { path: 'favourite', component: FavouriteComponent, canActivate: [AuthGuard]},
  { path: 'login-page', component: LoginPageComponent },
  { path: 'register-page', component: RegisterPageComponent },
  { path: '**', redirectTo: 'recipe-list', canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
