import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@rneui/base';
import { getRecipesThunk } from '../../features/recipeSlice';
import { addOrderThunk, updateOrderThunk, getOrdersThunk } from '../../features/ordersSlice';
import { getShoppingItemsThunk, addShoppingItemThunk, updateShoppingItemThunk } from '../../features/shoppingSlice';
import { globalStyles } from '../../styles/globalStyles';
import RecipeItem from './components/RecipeItem';


function AddOrderScreen({ navigation, route }) {
  const item = route.params?.item; // Get order for editing
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.value);
  const recipes = useSelector((state) => state.recipes.value);
  const shoppingList = useSelector((state) => state.shopping.value);

  const [selectedRecipes, setSelectedRecipes] = useState(item?.orderItems || []);
  const [userName, setUserName] = useState(item?.userName || '');
  const [totalPrice, setTotalPrice] = useState(item?.totalPrice || 0);

  useEffect(() => {
    dispatch(getRecipesThunk());
    dispatch(getOrdersThunk());
    dispatch(getShoppingItemsThunk());
  }, []);

  // Auto-calculate total price when order changes
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedRecipes, recipes]);



  //  INCREMENT QUANTITY FOR A RECIPE
  const handleAdd = (recipe) => {
    const existingIndex = selectedRecipes.findIndex(item => item.recipeKey === recipe.key);
    
    if (existingIndex >= 0) {
      const updatedItems = [...selectedRecipes];
      // Create a new object instead of mutating (fixes read-only error)
      updatedItems[existingIndex] = { 
        ...updatedItems[existingIndex], 
        quantity: updatedItems[existingIndex].quantity + 1 
      };
      setSelectedRecipes(updatedItems);
    } else {
      setSelectedRecipes([...selectedRecipes, { recipeKey: recipe.key, quantity: 1 }]);
    }
  };



  //  DECREMENT QUANTITY FOR A RECIPE
  const handleMinus = (recipe) => {
    const existingIndex = selectedRecipes.findIndex(item => item.recipeKey === recipe.key);
    
    if (existingIndex >= 0) {
      const currentQuantity = selectedRecipes[existingIndex].quantity;
      if (currentQuantity === 1) {
        // Remove item if quantity becomes 0
        setSelectedRecipes(selectedRecipes.filter(item => item.recipeKey !== recipe.key));
      } else {
        const updatedItems = [...selectedRecipes];
        // Create a new object instead of mutating (fixes read-only error)
        updatedItems[existingIndex] = { 
          ...updatedItems[existingIndex], 
          quantity: updatedItems[existingIndex].quantity - 1 
        };
        setSelectedRecipes(updatedItems); 
      }
    }
  };


  //  GET EXISTING QUANTITY FOR A RECIPE
  const getQuantity = (recipe) => {
    const selectedRecipe = selectedRecipes.find(item => item.recipeKey === recipe.key); 
    return selectedRecipe ? selectedRecipe.quantity : 0;
  };

  //  CALCULATE TOTAL PRICE FOR THE ORDER
  const calculateTotalPrice = () => {
    let total = 0;
    selectedRecipes.forEach(item => {
      // Find recipe from Redux store (not dispatch)
      const recipe = recipes.find(r => r.key === item.recipeKey);
      if (recipe) {
        total += Number(recipe.sellingPrice) * Number(item.quantity);
      }
    });
    setTotalPrice(total.toFixed(2));
  };


  //  SAVE ORDER BUTTON CALLS THIS FUNCTION
  const saveOrder = () => {
    const orderData = {
      orderItems: selectedRecipes,
      userName: userName,
      totalPrice: totalPrice,
    };
    
    if (item && item.key) {
      // Update existing order
      dispatch(updateOrderThunk({ ...orderData, key: item.key }));
    } else {
      // Add new order
      dispatch(addOrderThunk(orderData));
    }
    
    // Add ingredients to shopping list
    addIngredients(selectedRecipes);
    
    navigation.goBack();
  }

  const addIngredients = (orderItems) => {
    // First, aggregate all ingredients from the order
    const combinedIngredients = [];
    
    orderItems.forEach(orderItem => {
      // Find the recipe from the recipes list
      const recipe = recipes.find(r => r.key === orderItem.recipeKey);
      
      if (recipe && recipe.ingredients) {
        const multiplier = Number(orderItem.quantity);
        
        // Process each ingredient in the recipe
        recipe.ingredients.forEach(ingredient => {
          const neededQuantity = Number(ingredient.amount) * multiplier;
          
          // Check if this ingredient is already in our combined list (case-insensitive)
          const existingIngredient = combinedIngredients.find(
            item => item.ingredient?.toLowerCase() === ingredient.name?.toLowerCase() 
                && item.unit?.toLowerCase() === ingredient.unit?.toLowerCase()
          );
          
          if (existingIngredient) {
            // Add to existing amount
            existingIngredient.needed += neededQuantity;
          } else {
            // Add new ingredient to the list
            combinedIngredients.push({
              ingredient: ingredient.name,
              needed: neededQuantity,
              unit: ingredient.unit
            });
          }
        });
      }
    });
    
    // Now process the combined ingredients and update Firebase
    combinedIngredients.forEach(combinedItem => {
      // Check if ingredient already exists in shopping list by matching NAME and UNIT (case-insensitive)
      const existingItem = shoppingList.find(
        item => item.ingredient?.toLowerCase() === combinedItem.ingredient?.toLowerCase() 
            && item.unit?.toLowerCase() === combinedItem.unit?.toLowerCase()
      );
      
      if (existingItem) {
        // Update existing item - add to the needed quantity
        const updatedItem = {
          ...existingItem,
          needed: Number(existingItem.needed) + combinedItem.needed
        };
        dispatch(updateShoppingItemThunk(updatedItem));
      } else {
        // Add new item to shopping list
        dispatch(addShoppingItemThunk(combinedItem));
      }
    });
  };

  return (
    <View style={globalStyles.screenContainer}>
      {/* Customer Name Input */}
      <View style={styles.nameInputContainer}>
        <Input
          placeholder="Enter customer name"
          label="Customer Name"
          labelStyle={styles.labelStyle}
          containerStyle={styles.inputOuterContainer}
          inputContainerStyle={styles.inputContainer}
          errorStyle={{ height: 0 }}
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
      </View>

      <FlatList
        data={recipes}
        renderItem={({ item }) => {
          return (
            <RecipeItem 
              recipe={item} 
              quantity={getQuantity(item)} 
              onAdd={() => handleAdd(item)} 
              onMinus={() => handleMinus(item)} 
              key={item.key}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />

      {/* Save Order Button */}
      <View style={styles.saveButtonContainer}>
        <Text style={styles.totalPriceText}>Total: $ {totalPrice}</Text>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            selectedRecipes.length === 0 && styles.saveButtonDisabled
          ]}
          onPress={saveOrder}
          disabled={selectedRecipes.length === 0}
        >
          <Text style={styles.saveButtonText}>Save Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  nameInputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 13,
    marginBottom: 14,
  },

  labelStyle: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'regular',
    marginBottom: 4,
  },

  inputOuterContainer: {
    paddingHorizontal: 0,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 0,
  },

  saveButton: {
    backgroundColor: '#E56442',
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  saveButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
  },

  totalPriceText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
  },
});

export default AddOrderScreen;
