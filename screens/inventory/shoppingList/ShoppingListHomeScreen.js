import { View, Text, FlatList, StyleSheet } from 'react-native';
import { globalStyles } from '../../../styles/globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersThunk } from '../../../features/ordersSlice';
import { getRecipesThunk } from '../../../features/recipeSlice';
import { useEffect, useState } from 'react';
import ShoppingListItem from './components/ShoppingListItem';
import ShoppingOverlay from './components/ShoppingOverlay';
import { getShoppingItemsThunk } from '../../../features/shoppingSlice';
import { getInventoryItemsThunk } from '../../../features/inventorySlice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function ShoppingListHomeScreen(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    const shoppingList = useSelector((state) => state.shopping.value);
    const inventoryList = useSelector((state) => state.inventory.value);

    useEffect(() => {
        dispatch(getShoppingItemsThunk());
        dispatch(getInventoryItemsThunk());
    }, []);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemPress = (item) => {
        const { neededMore } = calculateNeededMore(item);
        setSelectedItem({ ...item, neededMore });
        setOverlayVisible(true);
    };

    // Calculate how much more is needed after checking inventory
    const calculateNeededMore = (shoppingItem) => {
        const matchingInventoryItems = inventoryList.filter(
            invItem => invItem.ingredient.toLowerCase() === shoppingItem.ingredient.toLowerCase() 
                    && invItem.unit === shoppingItem.unit);

        const totalInInventory = matchingInventoryItems.reduce((sum, invItem) => sum + Number(invItem.count), 0);
        const neededMore = Number(shoppingItem.needed) - totalInInventory;

        return {
            neededMore: neededMore,
            isSufficient: neededMore <= 0
        };
    };

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={shoppingList}
                renderItem={({ item }) => {
                    const { neededMore, isSufficient } = calculateNeededMore(item);
                    return (
                        <ShoppingListItem 
                            item={item} 
                            neededMore={neededMore}
                            isSufficient={isSufficient}
                            onPress={() => handleItemPress(item)}
                        />
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="cart-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>Shopping list is empty</Text>
                        <Text style={styles.emptyDescription}>
                            Create orders to see ingredients you need to buy!
                        </Text>
                    </View>
                }
                contentContainerStyle={shoppingList.length === 0 ? styles.emptyListContent : styles.flatListContent}
                keyExtractor={(item) => item.key}
            />

            <ShoppingOverlay 
                visible={overlayVisible} 
                onClose={() => setOverlayVisible(false)}
                item={selectedItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flatListContent: {
        paddingBottom: 20,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default ShoppingListHomeScreen;