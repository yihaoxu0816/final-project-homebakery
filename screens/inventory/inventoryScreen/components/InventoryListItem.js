import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function InventoryListItem({ item, onPress }) {
  const isOutOfStock = item.count <= 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.ingredientName}>{item.ingredient}</Text>
          <Text style={styles.quantityText}>{item.count} {item.unit}</Text>
        </View>
        {isOutOfStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
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

  outOfStockBadge: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
  },
});

export default InventoryListItem;

