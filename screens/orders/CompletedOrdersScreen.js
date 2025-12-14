import { View, Text, StyleSheet, FlatList } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { useSelector } from 'react-redux';
import OrderCard from './components/OrderCard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getOrdersThunk } from '../../features/ordersSlice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function CompletedOrdersScreen(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    const orders = useSelector((state) => state.orders.value);

    const completedOrders = orders.filter(order => order.status === 'completed');

    useEffect(() => {
        dispatch(getOrdersThunk());
    }, []);

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={completedOrders}
                renderItem={({item}) => {
                    return <OrderCard 
                        item={item} 
                        navigation={navigation}
                        hideCompleteButton={true}
                    />;
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-check" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>No completed orders</Text>
                        <Text style={styles.emptyDescription}>
                            Completed orders will appear here
                        </Text>
                    </View>
                }
                contentContainerStyle={completedOrders.length === 0 ? styles.emptyListContent : styles.flatListContent}
            />
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
});

export default CompletedOrdersScreen;

