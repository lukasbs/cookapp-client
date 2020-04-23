import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {AppService} from './app.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './auth.guard';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { HeaderComponent } from './header/header.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { FridgeComponent } from './fridge/fridge.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { FridgeEditComponent } from './fridge-edit/fridge-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RecipeListComponent,
    HeaderComponent,
    RecipeViewComponent,
    RegisterPageComponent,
    ShoppingListComponent,
    ShoppingListEditComponent,
    FridgeComponent,
    FavouriteComponent,
    FridgeEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AppService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
