import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { Input, Button, Divider } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getOrdersThunk, deleteOrderThunk } from '../../features/ordersSlice';
import { getShoppingItemsThunk, updateShoppingItemThunk, deleteShoppingItemThunk } from '../../features/shoppingSlice';
import { globalStyles } from '../../styles/globalStyles';

function OrderItem({ orderItem, recipes }) {
  const recipe = recipes.find(r => r.key === orderItem.recipeKey);
  
  return (
    <View style={styles.orderItemContainer}>
      <Text style={{alignSelf: 'stretch', textAlign: 'left', fontSize: 14}}>{recipe?.recipeName || 'Unknown Recipe'}</Text>
      <Text style={{alignSelf: 'stretch', textAlign: 'right', fontSize: 14}}>${recipe?.sellingPrice ? (Number(recipe.sellingPrice) * orderItem.quantity).toFixed(2) : '0.00'} x{orderItem.quantity}</Text>
    </View>
  );
}

function OrderDetailsScreen({navigation, route}) {
  const { item } = route.params;
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.value);
  const recipes = useSelector((state) => state.recipes.value);
  const shoppingList = useSelector((state) => state.shopping.value);
  

  const currentOrder = orders.find(order => order.key === item.key) || item;

  useEffect(() => {
    dispatch(getShoppingItemsThunk());
  }, []);

  const handleDeleteOrder = () => {
    const aggregatedIngredients = [];
    
    currentOrder.orderItems.forEach(orderItem => {
      const recipe = recipes.find(recipe => recipe.key === orderItem.recipeKey);
      
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const amountToRemove = Number(ingredient.amount) * Number(orderItem.quantity);
          
          const existingIngredient = aggregatedIngredients.find(
            item => item.ingredient.toLowerCase() === ingredient.name.toLowerCase() && item.unit === ingredient.unit
          );
          
          if (existingIngredient) {
            existingIngredient.needed += amountToRemove;
          } else {
            aggregatedIngredients.push({
              ingredient: ingredient.name,
              needed: amountToRemove,
              unit: ingredient.unit
            });
          }
        });
      }
    });
    
    // remove aggregated ingredients from shopping list
    aggregatedIngredients.forEach(aggregatedItem => {
      const shoppingItem = shoppingList.find(
        item => item.ingredient.toLowerCase() === aggregatedItem.ingredient.toLowerCase() && item.unit === aggregatedItem.unit
      );
      
      if (shoppingItem) {
        const newAmount = Number(shoppingItem.needed) - aggregatedItem.needed;
        
        if (newAmount <= 0) {
          dispatch(deleteShoppingItemThunk(shoppingItem));
        } else {
          const updatedItem = {
            ...shoppingItem,
            needed: newAmount
          };
          dispatch(updateShoppingItemThunk(updatedItem));
        }
      }
    });
    
    dispatch(deleteOrderThunk(currentOrder));
    navigation.goBack();
  };

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View style={styles.detailsCard}>

        <View style={{gap: 14}}>
          <Text style={styles.orderTitle}>{currentOrder.userName ? `${currentOrder.userName}'s Order` : 'Order'}</Text>
        </View>

        <Divider />

         <View style={{gap: 14, marginBottom: 14}}>
          <Text style={styles.subTitle}>Order Items</Text>
          <View style={{gap: 14}}>
            {currentOrder.orderItems && currentOrder.orderItems.map((orderItem, index) => (
              <OrderItem 
                key={index} 
                orderItem={orderItem}
                recipes={recipes}
              />
            ))}
          </View>
        </View>

        <Divider />

        <View style={{gap: 14, marginBottom: 14}}>
          <Text style={styles.subTitle}>Total Price</Text>
          <Text style={{fontSize: 14}}>${currentOrder.totalPrice}</Text>
        </View>

        <Divider />

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('Add Order', { item: currentOrder })}
        >
          <Text style={styles.editButtonText}>Edit Order</Text>
        </TouchableOpacity>
    
      </View>

      {/* Delete Order Button */}
      <TouchableOpacity onPress={handleDeleteOrder}>
        <Text style={styles.deleteButtonText}>Delete Order</Text>
      </TouchableOpacity>
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

  orderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
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
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default OrderDetailsScreen;

