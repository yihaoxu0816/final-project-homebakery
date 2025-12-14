import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from '../Secrets';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where,
  getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getInventoryItemsThunk = createAsyncThunk('inventory/getInventoryItems', async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    return [];
  }
  
  const initList = [];
  const collRef = collection(db, 'final-project-inventory');
  const q = query(collRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnapshot) => {
    const inventoryItem = docSnapshot.data();
    inventoryItem.key = docSnapshot.id;
    initList.push(inventoryItem);
  });
  return initList; 
});

export const addInventoryItemThunk = createAsyncThunk('inventory/addInventoryItem', async (inventoryItem) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  const inventoryItemWithUser = {
    ...inventoryItem,
    userId: userId,
  };
  
  const inventoryCollRef = collection(db, 'final-project-inventory');
  const inventorySnap = await addDoc(inventoryCollRef, inventoryItemWithUser);
  return {inventoryItem: inventoryItemWithUser, key: inventorySnap.id};
});

export const deleteInventoryItemThunk = createAsyncThunk('inventory/deleteInventoryItem', async (inventoryItem) => {
  const docToDelete = doc(db, 'final-project-inventory', inventoryItem.key);
  await deleteDoc(docToDelete);
  return inventoryItem;
});

export const updateInventoryItemThunk = createAsyncThunk('inventory/updateInventoryItem', async (inventoryItem) => {
  const docToUpdate = doc(db, 'final-project-inventory', inventoryItem.key);
  await updateDoc(docToUpdate, inventoryItem);
  return {inventoryItem: inventoryItem, key: inventoryItem.key};
});

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    value: [], 
  }, 

  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(getInventoryItemsThunk.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(addInventoryItemThunk.fulfilled, (state, action) => {
      const newInventoryItem = {
        ...action.payload.inventoryItem,
        key: action.payload.key,
      };
      state.value.push(newInventoryItem);
    });

    builder.addCase(deleteInventoryItemThunk.fulfilled, (state, action) => {
      const inventoryItemId = action.payload.key;
      state.value = state.value.filter((inventoryItem) => inventoryItem.key !== inventoryItemId);
    });

    builder.addCase(updateInventoryItemThunk.fulfilled, (state, action) => {
      const updatedInventoryItem = {...action.payload.inventoryItem, key: action.payload.key};
      state.value = state.value.map(
        (inventoryItem) => inventoryItem.key === action.payload.key ? updatedInventoryItem : inventoryItem);
    });
  },
});

export default inventorySlice.reducer;

