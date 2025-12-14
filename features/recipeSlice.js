import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from '../Secrets';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where,
  getDocs,addDoc, deleteDoc, updateDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const getRecipesThunk = createAsyncThunk('recipes/getRecipes', async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    return [];
  }
  
  const initList = [];
  const collRef = collection(db, 'final-project-recipes');
  const q = query(collRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnapshot) => {
    const recipe = docSnapshot.data();
    recipe.key = docSnapshot.id;
    initList.push(recipe);
  });
  return initList; 
});

export const getRecipeThunk = createAsyncThunk('recipes/getRecipe', async (recipeKey) => {
  const docRef = doc(db, 'final-project-recipes', recipeKey);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
});

export const addRecipeThunk = createAsyncThunk('recipes/addRecipe', async (recipe) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  const recipeWithUser = {
    ...recipe,
    userId: userId,
  };
  
  const recipeCollRef = collection(db, 'final-project-recipes');
  const recipeSnap = await addDoc(recipeCollRef, recipeWithUser);
  return {recipe: recipeWithUser, key: recipeSnap.id};
});

export const deleteRecipeThunk = createAsyncThunk('recipes/deleteRecipe', async (recipe) => {
  // Delete the image from Firebase Storage if it exists
  if (recipe.imageRef) {
    try {
      // Miserable AI
      const urlParts = recipe.imageRef.split('/o/')[1];
      const pathWithToken = urlParts ? urlParts.split('?')[0] : null;
      if (pathWithToken) {
        const imagePath = decodeURIComponent(pathWithToken);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.log('Error deleting image:', error);
      // End Miserable AI
    }
  }
  
  // Delete the recipe document from Firestore
  const docToDelete = doc(db, 'final-project-recipes', recipe.key);
  await deleteDoc(docToDelete);
  return recipe;
});

export const updateRecipeThunk = createAsyncThunk('recipes/updateRecipe', async (recipe) => {
  const docToUpdate = doc(db, 'final-project-recipes', recipe.key);
  await updateDoc(docToUpdate, recipe);
  return {recipe: recipe, key: recipe.key};
});

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    value: [
      {
        name: 'Brown Butter Sea Salt Cookies',
        sellingPrice: 10.99,
        ingredients: [
          {
            name: 'Brown Butter',
            amount: 100,
            unit: 'g',
          },
        ],
      }, 

      {
        name: 'Chocolate Chip Cookies',
        sellingPrice: 12.99,
        ingredients: [
          {
            name: 'Chocolate Chips',
            amount: 200,
            unit: 'g',
          },
        ],
      }
    ], 
  }, 

  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(getRecipesThunk.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(addRecipeThunk.fulfilled, (state, action) => {
      const newRecipe = {
        ...action.payload.recipe,
        key: action.payload.key,
      };
      state.value.push(newRecipe);
    });

    builder.addCase(deleteRecipeThunk.fulfilled, (state, action) => {
      const recipeId = action.payload.key;
      state.value = state.value.filter((recipe) => recipe.key !== recipeId);
    });

    builder.addCase(updateRecipeThunk.fulfilled, (state, action) => {
      const updatedRecipe = {...action.payload.recipe, key: action.payload.key};
      state.value = state.value.map(
        (recipe) => recipe.key === action.payload.key ? updatedRecipe : recipe);
    });
  },
});

export default recipeSlice.reducer;