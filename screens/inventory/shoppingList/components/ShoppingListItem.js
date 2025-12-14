import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function ShoppingListItem({ item, neededMore, isSufficient, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.listItemContainer, isSufficient && styles.sufficientContainer]}>
        <View style={styles.itemInfo}>
          <Text style={styles.ingredientName}>{item.ingredient}</Text>
          <Text style={styles.quantityText}>
            {isSufficient ? 'Sufficient' : `${neededMore} ${item.unit}`}
          </Text>
        </View>

        <View style={styles.addButtonContainer}>
          <Text style={styles.addButtonText}>Add</Text>
          <MaterialCommunityIcons name="plus" size={24} color="#E56442" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  sufficientContainer: {
    opacity: 0.5,
  },

  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  quantityText: {
    fontSize: 14,
    color: 'gray',
  },

  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  addButtonText: {
    fontSize: 16,
    color: '#E56442'
  }
});

export default ShoppingListItem;

