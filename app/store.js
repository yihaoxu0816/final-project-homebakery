import {configureStore} from "@reduxjs/toolkit";
import recipes from "../features/recipeSlice";
import orders from "../features/ordersSlice";
import inventory from "../features/inventorySlice";
import shopping from "../features/shoppingSlice";

export default configureStore({
  reducer: {
    recipes: recipes,
    orders: orders,
    inventory: inventory,
    shopping: shopping,
  },
});