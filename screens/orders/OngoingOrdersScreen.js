import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../../styles/globalStyles';
import { useSelector } from 'react-redux';
import OrderCard from './components/OrderCard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getOrdersThunk, updateOrderThunk } from '../../features/ordersSlice';
import { getRecipesThunk } from '../../features/recipeSlice';
import { getInventoryItemsThunk, updateInventoryItemThunk, deleteInventoryItemThunk } from '../../features/inventorySlice';
import { getShoppingItemsThunk, updateShoppingItemThunk, deleteShoppingItemThunk } from '../../features/shoppingSlice';

function OngoingOrdersScreen(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    const orders = useSelector((state) => state.orders.value);
    const recipes = useSelector((state) => state.recipes.value);
    const inventoryList = useSelector((state) => state.inventory.value);
    const shoppingList = useSelector((state) => state.shopping.value);

    const ongoingOrders = orders.filter(order => order.status === 'ongoing');

    useEffect(() => {
        dispatch(getOrdersThunk());
        dispatch(getRecipesThunk());
        dispatch(getInventoryItemsThunk());
        dispatch(getShoppingItemsThunk());
    }, []);

    const handleCompleteOrder = (order) => {
        const aggregatedIngredients = [];
        
        order.orderItems.forEach(orderItem => {
            const recipe = recipes.find(r => r.key === orderItem.recipeKey);
            
            if (recipe && recipe.ingredients) {
                recipe.ingredients.forEach(ingredient => {
                    const amount = Number(ingredient.amount) * Number(orderItem.quantity);
                    
                    const existingIngredient = aggregatedIngredients.find(
                        item => item.ingredient?.toLowerCase() === ingredient.name?.toLowerCase() && item.unit === ingredient.unit
                    );
                    
                    if (existingIngredient) {
                        existingIngredient.amount += amount;
                    } else {
                        aggregatedIngredients.push({
                            ingredient: ingredient.name,
                            amount: amount,
                            unit: ingredient.unit
                        });
                    }
                });
            }
        });

        // Check inventory for all ingredients
        const insufficientIngredients = [];
        
        aggregatedIngredients.forEach(aggItem => {
            const inventoryItem = inventoryList.find(
                item => item.ingredient?.toLowerCase() === aggItem.ingredient?.toLowerCase() 
                    && item.unit?.toLowerCase() === aggItem.unit?.toLowerCase()
            );
            
            const availableAmount = inventoryItem ? Number(inventoryItem.count) : 0;
            const neededAmount = aggItem.amount;
            
            if (availableAmount < neededAmount) {
                insufficientIngredients.push({
                    ingredient: aggItem.ingredient,
                    needed: neededAmount,
                    available: availableAmount,
                    unit: aggItem.unit
                });
            }
        });
        if (insufficientIngredients.length > 0) {
            const message = insufficientIngredients.map(item => 
                `${item.ingredient}: Need ${item.needed}${item.unit}, only have ${item.available}${item.unit}`
            ).join('\n');
            
            Alert.alert(
                'Insufficient Inventory',
                `Cannot complete order. Missing ingredients:\n\n${message}`,
                [{ text: 'OK' }]
            );
            return;
        }

        // Deduct from inventory
        aggregatedIngredients.forEach(aggregatedItem => {
            const inventoryItem = inventoryList.find(
                item => item.ingredient?.toLowerCase() === aggregatedItem.ingredient?.toLowerCase() && item.unit === aggregatedItem.unit
            );
            
            if (inventoryItem) {
                const newAmount = Number(inventoryItem.count) - aggregatedItem.amount;
                
                if (newAmount <= 0) {
                    dispatch(deleteInventoryItemThunk(inventoryItem));
                } else {
                    const updatedItem = {
                        ...inventoryItem,
                        count: newAmount
                    };
                    dispatch(updateInventoryItemThunk(updatedItem));
                }
            }
        });

        // Deduct from shopping list
        aggregatedIngredients.forEach(aggregatedItem => {
            const shoppingItem = shoppingList.find(
                item => item.ingredient?.toLowerCase() === aggregatedItem.ingredient?.toLowerCase() 
                    && item.unit?.toLowerCase() === aggregatedItem.unit?.toLowerCase()
            );
            
            if (shoppingItem) {
                const newAmount = Number(shoppingItem.needed) - aggregatedItem.amount;
                
                console.log(`Deducting ${aggregatedItem.ingredient}: ${shoppingItem.needed} - ${aggregatedItem.amount} = ${newAmount}`);
                
                if (newAmount <= 0) {
                    console.log(`Deleting ${aggregatedItem.ingredient} from shopping list`);
                    dispatch(deleteShoppingItemThunk(shoppingItem));
                } else {
                    console.log(`Updating ${aggregatedItem.ingredient} to ${newAmount}`);
                    const updatedItem = {
                        ...shoppingItem,
                        needed: newAmount
                    };
                    dispatch(updateShoppingItemThunk(updatedItem));
                }
            } else {
                console.log(`Shopping item not found: ${aggregatedItem.ingredient} (${aggregatedItem.unit})`);
            }
        });

        // Update order status
        const updatedOrder = {
            ...order,
            status: 'completed'
        };
        dispatch(updateOrderThunk(updatedOrder));
    };

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={ongoingOrders}
                renderItem={({item}) => {
                    return <OrderCard 
                        item={item} 
                        navigation={navigation} 
                        onCompleteOrder={handleCompleteOrder}
                    />;
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>No ongoing orders</Text>
                        <Text style={styles.emptyDescription}>
                            Get started by creating your first order!
                        </Text>
                    </View>
                }
                contentContainerStyle={ongoingOrders.length === 0 ? styles.emptyListContent : styles.flatListContent}
            />
            <TouchableOpacity 
                style={styles.addOrderButton}
                onPress={() => navigation.navigate('Add Order')}
            >
                <MaterialCommunityIcons name="plus" size={48} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    addOrderButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#E56442',
        borderRadius: 100,
        padding: 12,
    },
    flatListContent: {
        paddingBottom: 100,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});

export default OngoingOrdersScreen;

