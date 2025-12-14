import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { Input, Button, Divider } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getRecipesThunk, deleteRecipeThunk } from '../../features/recipeSlice';
import { globalStyles } from '../../styles/globalStyles';

function IngredientItem({ ingredient, index }) {
  return (
    <View style={styles.ingredientContainer}>
      <Text style={{alignSelf: 'stretch', textAlign: 'left', fontSize: 14}}>{ingredient.name}</Text>
      <Text style={{alignSelf: 'stretch', textAlign: 'right', fontSize: 14}}>{ingredient.amount} {ingredient.unit}</Text>
    </View>
  );
}

function RecipeDetailsScreen({navigation, route}) {
  const { item } = route.params;
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes.value);
  
  // Get the latest recipe data from Redux store by key
  const currentRecipe = recipes.find(recipe => recipe.key === item.key) || item;

  const handleDeleteRecipe = () => {
    dispatch(deleteRecipeThunk(currentRecipe));
    navigation.goBack();
  };

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View style={styles.detailsCard}>

        <View style={{gap: 14}}>
          <Image 
            source={{uri: currentRecipe.imageRef || 'https://via.placeholder.com/150'}} 
            style={styles.image} 
          />
          <Text style={styles.recipeTitle}>{currentRecipe.recipeName}</Text>
        </View>

        <Divider />

         <View style={{gap: 14, marginBottom: 14}}>
          <Text style={styles.subTitle}>Ingredients</Text>
          <View style={{gap: 14}}>
            {currentRecipe.ingredients.map((ingredient, index) => (
              <IngredientItem 
                key={index} 
                ingredient={ingredient} 
              />
            ))}
          </View>
        </View>

        <Divider />

        <View style={{gap: 14, marginBottom: 14}}>
          <Text style={styles.subTitle}>Selling Price</Text>
          <Text style={{fontSize: 14}}>${currentRecipe.sellingPrice}</Text>
        </View>

        <Divider />

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('Add Recipe', { item: currentRecipe })}
        >
          <Text style={styles.editButtonText}>Edit Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteRecipe}
        >
          <Text style={styles.deleteButtonText}>Delete Recipe</Text>
        </TouchableOpacity>
    
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    gap: 12,
  },

  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  image: {
    width: '100%',
    height: 'auto',
    aspectRatio: '16 / 9',
    borderRadius: 4,
    backgroundColor: 'lightgray',
    marginBottom: 8,
  },

  ingredientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '60%',
    alignSelf: 'stretch',
  },

  editButton: {
    backgroundColor: '#E56442',
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#E56442',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeDetailsScreen;
