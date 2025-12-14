import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from '@rneui/base';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

function OrderCard(props) {
	const { item, navigation, onCompleteOrder, hideCompleteButton } = props;
  const recipes = useSelector((state) => state.recipes.value);

	return (
		<View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Order Details', { item })}>
				<Text style={styles.userName}>{item.userName}'s Order</Text>
        
        {item.orderItems.map((foodItem, index) => {
          const recipe = recipes.find(recipe => recipe.key === foodItem.recipeKey);
          
          return (
            <View key={index} style={styles.orderItemContainer}>
              <Text style={styles.recipeName}>{recipe?.recipeName}</Text>
              <View style={styles.priceQuantityContainer}>
                <Text>${recipe?.sellingPrice}</Text>
                <Text style={styles.quantityText}>x {foodItem.quantity}</Text>
              </View>
            </View>
          );
        })}

        <Divider />
      </TouchableOpacity>

      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPrice}>Total Price: ${item.totalPrice}</Text>
        {!hideCompleteButton && onCompleteOrder && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={(e) => {
              e.stopPropagation();
              onCompleteOrder(item);
            }}
          >
            <Text style={styles.completeButtonText}>Complete Order</Text>
          </TouchableOpacity>
        )}
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    minHeight: 120,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    gap: 12,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    marginTop: 12,
  },

  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25%',
  },

  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  quantityText: {
    color: '#828282',
  },

  userName: {
    color: '#828282',
  },

  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },

  completeButton: {
    backgroundColor: '#E56442',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignItems: 'center',
  },

  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderCard;