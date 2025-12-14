import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../../styles/globalStyles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryItemsThunk } from '../../../features/inventorySlice';
import InventoryListItem from './components/InventoryListItem';
import InventoryOverlay from './components/InventoryOverlay';
import AddInventoryOverlay from './components/AddInventoryOverlay';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


function InventoryHomeScreen() {
    const dispatch = useDispatch();
    const inventoryList = useSelector((state) => state.inventory.value);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [addOverlayVisible, setAddOverlayVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        dispatch(getInventoryItemsThunk());
    }, []);

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setOverlayVisible(true);
    };

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={inventoryList}
                renderItem={({ item }) => (
                    <InventoryListItem 
                        item={item} 
                        onPress={() => handleItemPress(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="fridge-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>Inventory is empty</Text>
                        <Text style={styles.emptyDescription}>
                            Purchase ingredients from your shopping list to add to inventory!
                        </Text>
                    </View>
                }
                contentContainerStyle={inventoryList.length === 0 ? styles.emptyListContent : styles.flatListContent}
                keyExtractor={(item) => item.key}
            />

            <InventoryOverlay 
                visible={overlayVisible} 
                onClose={() => setOverlayVisible(false)}
                item={selectedItem}
            />

            <AddInventoryOverlay 
                visible={addOverlayVisible} 
                onClose={() => setAddOverlayVisible(false)}
            />

            <TouchableOpacity 
                style={styles.addInventoryButton}
                onPress={() => setAddOverlayVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={48} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    addInventoryButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#E56442',
        borderRadius: 100,
        padding: 12,
    },
});

export default InventoryHomeScreen;