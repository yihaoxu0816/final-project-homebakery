import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from '../Secrets';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where,
  getDocs, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getOrdersThunk = createAsyncThunk('orders/getOrders', async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    return [];
  }
  
  const initList = [];
  const collRef = collection(db, 'final-project-orders');
  const q = query(collRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnapshot) => {
    const order = docSnapshot.data();
    order.key = docSnapshot.id;
    initList.push(order);
  });
  return initList; 
});

export const addOrderThunk = createAsyncThunk('orders/addOrder', async (order) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  const orderWithUser = {
    ...order,
    userId: userId,
    status: 'ongoing',
  };
  
  const orderCollRef = collection(db, 'final-project-orders');
  const orderSnap = await addDoc(orderCollRef, orderWithUser);
  return {order: orderWithUser, key: orderSnap.id};
});

export const deleteOrderThunk = createAsyncThunk('orders/deleteOrder', async (order) => {
  const docToDelete = doc(db, 'final-project-orders', order.key);
  await deleteDoc(docToDelete);
  return order;
});

export const updateOrderThunk = createAsyncThunk('orders/updateOrder', async (order) => {
  const docToUpdate = doc(db, 'final-project-orders', order.key);
  await updateDoc(docToUpdate, order);
  return {order: order, key: order.key};
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    value: [], 
  }, 

  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(addOrderThunk.fulfilled, (state, action) => {
      const newOrder = {
        ...action.payload.order,
        key: action.payload.key,
      };
      state.value.push(newOrder);
    });

    builder.addCase(deleteOrderThunk.fulfilled, (state, action) => {
      const orderId = action.payload.key;
      state.value = state.value.filter((order) => order.key !== orderId);
    });

    builder.addCase(updateOrderThunk.fulfilled, (state, action) => {
      const updatedOrder = {...action.payload.order, key: action.payload.key};
      state.value = state.value.map(
        (order) => order.key === action.payload.key ? updatedOrder : order);
    });
  },
});

export default ordersSlice.reducer;
