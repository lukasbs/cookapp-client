/* tslint:disable:max-line-length */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
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

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faList, faLayerGroup, faLightbulb, faSignOutAlt, faUserEdit, faUserPlus, faUserTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown, faTimes, faEdit, faPlus, faBan, faCheck, faBars, faStar, faExchangeAlt, faShoppingBasket, faTasks, faBook, faSearchPlus, faBroom, faTrash, faSignInAlt, faUserCheck, faReply, faEraser, faCogs} from '@fortawesome/free-solid-svg-icons';
import { faListAlt, faNewspaper, faCircle, faFilePdf, faIdCard} from '@fortawesome/free-regular-svg-icons';

library.add(faUsers, faListAlt, faNewspaper, faLayerGroup, faLightbulb, faSignOutAlt, faUserEdit, faUserPlus, faUserTimes, faSearch, faChevronLeft, faChevronRight, faChevronDown, faTimes, faList, faEdit, faPlus, faBan, faCheck, faBars, faStar, faCircle, faExchangeAlt, faShoppingBasket, faTasks, faBook, faSearchPlus, faFilePdf, faBroom, faTrash, faSignInAlt, faIdCard, faUserCheck, faReply, faEraser,faCogs);
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
    HttpClientModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    AppService,
    AuthGuard,
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
