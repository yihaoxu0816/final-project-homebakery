import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from '@rneui/base';

function RecipeCard(props) {
	const { item, navigation } = props;

	return (
		<TouchableOpacity onPress={() => navigation.navigate('Recipe Details', { item })}>
			<View style={styles.outerContainer}>
				<Image 
					source={{uri: item.imageRef || 'https://via.placeholder.com/150'}} 
					style={styles.image} 
				/>
				<View style={styles.innerContainer}>
					<Text style={styles.recipeName}>{item.recipeName}</Text>
					<Text style={styles.recipeDescription}>Selling Price: $ {item.sellingPrice}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
  outerContainer: {
      flexDirection: 'row',
      backgroundColor: 'white',
      minHeight: 120,
      borderRadius: 8,
      padding: 12,
      marginBottom: 14,
      gap: 12,
  },
  
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: 'lightgray',
  },

  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  recipeDescription: {
    fontSize: 14,
    width: '100%',
    textAlign: 'right',
  },
});

export default RecipeCard;