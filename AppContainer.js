import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

import { Provider } from 'react-redux';
import store from './app/store';

import ShoppingListHomeScreen from './screens/inventory/shoppingList/ShoppingListHomeScreen';
import InventoryHomeScreen from './screens/inventory/inventoryScreen/InventoryHomeScreen';
import OngoingOrdersScreen from './screens/orders/OngoingOrdersScreen';
import CompletedOrdersScreen from './screens/orders/CompletedOrdersScreen';
import RecipesHomeScreen from './screens/recipes/RecipesHomeScreen';
import AddRecipeScreen from './screens/recipes/AddRecipeScreen';
import RecipeDetailsScreen from './screens/recipes/RecipeDetailsScreen';
import CameraScreen from './screens/recipes/CameraScreen';
import AddOrderScreen from './screens/orders/AddOrderScreen';
import OrderDetailsScreen from './screens/orders/OrderDetailsScreen';
import LoginScreen from './screens/login/LoginScreen';

const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const RootStack = createNativeStackNavigator();

function InventoryTopTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#E56442',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: '#E56442',
        },
      }}
    >
      <TopTab.Screen 
        name="Shopping List" 
        component={ShoppingListHomeScreen} 
      />
      <TopTab.Screen 
        name="Inventory" 
        component={InventoryHomeScreen} 
      />
    </TopTab.Navigator>
  );
}

function OrdersTopTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#E56442',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: '#E56442',
        },
      }}
    >
      <TopTab.Screen 
        name="Ongoing" 
        component={OngoingOrdersScreen} 
      />
      <TopTab.Screen 
        name="Completed" 
        component={CompletedOrdersScreen} 
      />
    </TopTab.Navigator>
  );
}

function OrdersTabStack( { navigation } ) {
  const OrdersStack = createNativeStackNavigator();
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="Orders"
        component={OrdersTopTabs}
      />
      <OrdersStack.Screen
        name="Add Order"
        component={AddOrderScreen}
        options={({ route }) => ({
          title: route.params?.item ? 'Edit Order' : 'Add Order'
        })}
      />
      <OrdersStack.Screen
        name="Order Details"
        component={OrderDetailsScreen}
      />
    </OrdersStack.Navigator>
  );
}

function InventoryTabStack( { navigation } ) {
  const InventoryStack = createNativeStackNavigator();
  return (
    <InventoryStack.Navigator>
      <InventoryStack.Screen
        name="Inventory"
        component={InventoryTopTabs}
      />
    </InventoryStack.Navigator>
  );
}

function RecipesTabStack( { navigation } ) {
  const RecipesStack = createNativeStackNavigator();
  return (
    <RecipesStack.Navigator>
      <RecipesStack.Screen
        name="Recipes"
        component={RecipesHomeScreen}
      />
      <RecipesStack.Screen
        name="Add Recipe"
        component={AddRecipeScreen}
        options={({ route }) => ({
          title: route.params?.item ? 'Edit Recipe' : 'Add Recipe'
        })}
      />
      <RecipesStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Take Photo'
        }}
      />
      <RecipesStack.Screen
        name="Recipe Details"
        component={RecipeDetailsScreen}
      />
    </RecipesStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#E56442',
      }}
    >
      <Tab.Screen 
        name="Orders" 
        component={OrdersTabStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen 
        name="Inventory" 
        component={InventoryTabStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fridge-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen 
        name="Recipes" 
        component={RecipesTabStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chef-hat" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContainer() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default AppContainer;