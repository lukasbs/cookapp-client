import {IngredientModel} from './IngredientModel';
import {RecipeModel} from './RecipeModel';
import {FridgeItemModel} from './FridgeItemModel';

export class UserDataModel {
  constructor(
    public token: string,
    public favouriteRecipes: RecipeModel[],
    public fridgeItems: FridgeItemModel[],
    public shoppingListItems: IngredientModel[]
  ) {}
}
