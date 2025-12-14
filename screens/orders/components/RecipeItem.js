import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function RecipeItem({ recipe, quantity, onAdd, onMinus }) {
  return (
    <View style={styles.recipeItemContainer}>

      {/* Recipe Item Header */}
      <View style={styles.recipeItemHeader}>
        <Image 
          source={{uri: recipe.imageRef || 'https://via.placeholder.com/150'}} 
          style={styles.recipeImage} 
        />
        <View style={styles.recipeItemTextWrapper}>
          <Text style={styles.recipeName}>{recipe.recipeName}</Text>
          <Text style={styles.recipePrice}>$ {recipe.sellingPrice}</Text>
        </View>
      </View>

      {/* Quantity Counter */}
      <View style={styles.counterContainer}>
        {/* Counter Button Minus */}
        <TouchableOpacity 
          style={styles.counterButtonMinus}
          onPress={onMinus}
          disabled={quantity === 0 || quantity === undefined}
        >
          <MaterialCommunityIcons name="minus" size={20} color={'#E56442'} />
        </TouchableOpacity>

        {/* Quantity Text */}
        <Text style={styles.quantityText}>{quantity ? quantity : 0}</Text>

        {/* Counter Button Plus */}
        <TouchableOpacity 
          style={styles.counterButtonPlus}
          onPress={onAdd}
        >
          <MaterialCommunityIcons name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  recipeItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },

  recipeImage: {
    height: 52,
    width: 52,
    borderRadius: 4,
    backgroundColor: 'lightgray',
  },

  recipeItemHeader: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  recipeItemTextWrapper: {
    flex: 1,
    flexDirection: 'column',
  },

  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  recipePrice: {
    fontSize: 14,
    color: 'gray',
  },

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  counterButtonMinus: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#FDEFEC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterButtonPlus: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#E56442',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
});

export default RecipeItem;

