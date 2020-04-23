import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MessageModel} from './model/MessageModel';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RecipeModel} from './model/RecipeModel';
import {UserDataModel} from './model/UserDataModel';
import {IngredientModel} from './model/IngredientModel';
import {FridgeItemModel} from './model/FridgeItemModel';
import {FridgeItemEditModel} from './model/FridgeItemEditModel';

@Injectable()
export class AppService {
  public userData: UserDataModel = new UserDataModel('', [], [], []);
  public userDataChanged = new Subject<UserDataModel>();

  public message: MessageModel = {text: '', type: ''};
  public messageChanged = new Subject<MessageModel>();

  public recipeList: RecipeModel[] = [];
  public recipeListChanged = new Subject<RecipeModel[]>();

  public currentRecipesPage = 0;
  public currentRecipesPageChanged = new Subject<number>();
  public recipeListChunked = [];

  public currentlyViewedRecipe: RecipeModel;
  public currentlyViewedRecipeChanged = new Subject<RecipeModel>();

  public currentlyEditedShoppingListItem: IngredientModel;
  public currentlyEditedShoppingListItemChanged = new Subject<IngredientModel>();

  public currentlyEditedFridgeItem: FridgeItemEditModel;
  public currentlyEditedFridgeItemChanged = new Subject<FridgeItemEditModel>();

  constructor(private http: HttpClient, private router: Router) { }

  doLogin(login, pass) {
    this.http.post('http://localhost:8080/api/user/auth/login', {
      name: login,
      password: pass
    }, {
      observe: 'response',
      withCredentials: true
    }).subscribe(
      data => {
        this.userData = data.body as UserDataModel;
        this.userDataChanged.next(this.userData);
        this.router.navigate(['/recipe-list']);
      },
      err => {
        if (err.status === 403) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  doRegister(login, pass) {
    this.http.post('http://localhost:8080/api/user/auth/register', {
      name: login,
      password: pass
    }, {
      observe: 'response',
      withCredentials: true
    }).subscribe(
      data => {
        this.router.navigate(['/login-page']);
        this.message = {text: 'Zarejestrowano!', type: 'SUCCESS'};
      },
      err => {
        if (err.status === 400) {
          this.message = {text: 'Proszę podać login i hasło!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Taki użytkownik już istnieje!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  getAllRecipes() {
    this.http.get('http://localhost:8080/api/recipe/all', {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as RecipeModel[];
        } else {
          this.recipeList = [] as RecipeModel[];
        }
        this.recipeListChanged.next(this.recipeList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  searchForRecipes(searchString: string) {
    this.http.get('http://localhost:8080/api/recipe/get/' + searchString, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as RecipeModel[];
        } else {
          this.recipeList = [] as RecipeModel[];
        }
        this.recipeListChanged.next(this.recipeList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  searchForRecipesExplicit(searchString: string) {
    this.http.get('http://localhost:8080/api/recipe/explicit/get/' + searchString, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as RecipeModel[];
        } else {
          this.recipeList = [] as RecipeModel[];
        }
        this.recipeListChanged.next(this.recipeList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  getAllShoppingListItems() {
    this.http.get('http://localhost:8080/api/shopping/all', {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userData.shoppingListItems = data.body as IngredientModel[];
        } else {
          this.userData.shoppingListItems = [] as IngredientModel[];
        }
        this.userDataChanged.next(this.userData);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  addShoppingListItem(name: string, amount: string) {
    this.http.post('http://localhost:8080/api/shopping/add', {
      name,
      amount
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getAllShoppingListItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas dodawania, niepoprawne dane potrzebne do utworzenia przedmiotu z listy!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  deleteShoppingListItem(name: string, amount: string) {
    this.http.request('delete', 'http://localhost:8080/api/shopping/delete', {
      body: {
        name,
        amount
      },
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getAllShoppingListItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas usuwania, niepoprawne dane potrzebne do usunięcia przedmiotu z listy!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  updateShoppingListItem(oldName: string, oldAmount: string, name: string, amount: string) {
    this.http.request('put', 'http://localhost:8080/api/shopping/update/' + oldName + '/' + oldAmount, {
      body: {
        name,
        amount
      },
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getAllShoppingListItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edycji, niepoprawne dane potrzebne do edycji przedmiotu!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas edycji, nie ma takiego przedmiotu!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  getFridgeItems() {
    this.http.get('http://localhost:8080/api/fridge/all', {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userData.fridgeItems = data.body as FridgeItemModel[];
          for (const fridgeItem of this.userData.fridgeItems) {
            fridgeItem.expirationDate = new Date(fridgeItem.expirationDate);
          }
        } else {
          this.userData.fridgeItems = [] as FridgeItemModel[];
        }
        this.userDataChanged.next(this.userData);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  addFridgeItem(name: string, amount: string, expirationDate: Date) {
    this.http.post('http://localhost:8080/api/fridge/add', {
      name,
      amount,
      expirationDate
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getFridgeItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas dodawania, niepoprawne dane potrzebne do utworzenia produktu w lodówce!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  updateFridgeItem(oldName: string, oldAmount: string, oldExpirationDate: Date, name: string, amount: string, expirationDate: Date) {
    this.http.request('put', 'http://localhost:8080/api/fridge/update/' + oldName + '/' + oldAmount + '/' + oldExpirationDate, {
      body: {
        name,
        amount,
        expirationDate
      },
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getFridgeItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edycji, niepoprawne dane potrzebne do edycji przedmiotu!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas edycji, nie ma takiego przedmiotu w lodówce!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  deleteFridgeItem(name: string, amount: string, expirationDate: Date) {
    this.http.request('delete', 'http://localhost:8080/api/fridge/delete', {
      body: {
        name,
        amount,
        expirationDate
      },
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getFridgeItems();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas usuwania, niepoprawne dane potrzebne do usunięcia przedmiotu z lodówki!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  getFavouriteRecipes() {
    this.http.get('http://localhost:8080/api/favourite/all', {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userData.favouriteRecipes = data.body as RecipeModel[];
        } else {
          this.userData.favouriteRecipes = [] as RecipeModel[];
        }
        this.userDataChanged.next(this.userData);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  addFavourite(name: string) {
    this.http.post('http://localhost:8080/api/favourite/add/' + name, {
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getFavouriteRecipes();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas dodawania, użytkownik bądź przepis nie istnieje!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas dodawania, przepis jest już ulubiony!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  deleteFavourite(name: string) {
    this.http.request('delete', 'http://localhost:8080/api/favourite/delete/' + name, {
      body: {
      },
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getFavouriteRecipes();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas usuwania, nie znaleziono przepisu!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  removeExpiredProducts(fridgeItems: FridgeItemModel[]) {
    const newItems: FridgeItemModel[] = fridgeItems;
    for (const item of newItems) {
      if (item.expirationDate < (new Date())) {
        newItems.splice(newItems.indexOf(item), 1);
      }
    }
    return newItems;
  }

  addErrorMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-danger');
    element.innerHTML = message;
  }

  addSuccessMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-success');
    element.innerHTML = message;
  }

  clearClass(element) {
    element.innerHTML = '';
    this.message = {text: '', type: ''};

    if (element.classList.contains('alert-danger')) {
      element.classList.remove('alert-danger');
    } else if (element.classList.contains('alert-success')) {
      element.classList.remove('alert-success');
    }
  }

  cutIntoChunks(initialList) {
    const chunkSize = 5;
    const listChunked = [];

    for (let i = 0, j = 0; i < initialList.length; i += chunkSize, j++) {
      listChunked[j] = initialList.slice(i, i + chunkSize);
    }

    return listChunked;
  }
}
