import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from '../Secrets';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where,
  getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getShoppingItemsThunk = createAsyncThunk('shopping/getShoppingItems', async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    return [];
  }
  
  const initList = [];
  const collRef = collection(db, 'final-project-shopping');
  const q = query(collRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnapshot) => {
    const shoppingItem = docSnapshot.data();
    shoppingItem.key = docSnapshot.id;
    initList.push(shoppingItem);
  });
  return initList; 
});

export const addShoppingItemThunk = createAsyncThunk('shopping/addShoppingItem', async (shoppingItem) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  const shoppingItemWithUser = {
    ...shoppingItem,
    userId: userId,
  };
  
  const shoppingCollRef = collection(db, 'final-project-shopping');
  const shoppingSnap = await addDoc(shoppingCollRef, shoppingItemWithUser);
  return {shoppingItem: shoppingItemWithUser, key: shoppingSnap.id};
});

export const deleteShoppingItemThunk = createAsyncThunk('shopping/deleteShoppingItem', async (shoppingItem) => {
  const docToDelete = doc(db, 'final-project-shopping', shoppingItem.key);
  await deleteDoc(docToDelete);
  return shoppingItem;
});

export const updateShoppingItemThunk = createAsyncThunk('shopping/updateShoppingItem', async (shoppingItem) => {
  const docToUpdate = doc(db, 'final-project-shopping', shoppingItem.key);
  await updateDoc(docToUpdate, shoppingItem);
  return {shoppingItem: shoppingItem, key: shoppingItem.key};
});

export const shoppingSlice = createSlice({
  name: 'shopping',
  initialState: {
    value: [], 
  }, 

  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(getShoppingItemsThunk.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(addShoppingItemThunk.fulfilled, (state, action) => {
      const newShoppingItem = {
        ...action.payload.shoppingItem,
        key: action.payload.key,
      };
      state.value.push(newShoppingItem);
    });

    builder.addCase(deleteShoppingItemThunk.fulfilled, (state, action) => {
      const shoppingItemId = action.payload.key;
      state.value = state.value.filter((shoppingItem) => shoppingItem.key !== shoppingItemId);
    });

    builder.addCase(updateShoppingItemThunk.fulfilled, (state, action) => {
      const updatedShoppingItem = {...action.payload.shoppingItem, key: action.payload.key};
      state.value = state.value.map(
        (shoppingItem) => shoppingItem.key === action.payload.key ? updatedShoppingItem : shoppingItem);
    });
  },
});

export default shoppingSlice.reducer;

