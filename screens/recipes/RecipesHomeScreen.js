import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert } from 'react-native';
import RecipeCard from './components/RecipeCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../../styles/globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipesThunk } from '../../features/recipeSlice';
import { useEffect } from 'react';
import { signOut } from '../../auth/AuthManager';

function RecipesHomeScreen(props) {
	const dispatch = useDispatch();
	const { navigation } = props;

	const recipes = useSelector((state) => state.recipes.value);

	useEffect(() => {
			dispatch(getRecipesThunk());
	}, []);

	const handleSignOut = async () => {
		try {
			await signOut();
			navigation.reset({
				index: 0,
				routes: [{ name: 'Login' }],
			});
		} catch (error) {
			Alert.alert('Error', 'Failed to sign out. Please try again.');
		}
	};

	return (
		<View style={globalStyles.screenContainer}>
			<FlatList
				data={recipes}
				renderItem={({item}) => {
					return (
						<RecipeCard item={item} navigation={navigation} />
					);
				}}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<MaterialCommunityIcons name="chef-hat" size={64} color="#ccc" />
						<Text style={styles.emptyTitle}>No recipes yet</Text>
						<Text style={styles.emptyDescription}>
							Get started by creating your first recipe!
						</Text>
					</View>
				}
				contentContainerStyle={recipes.length === 0 ? styles.emptyListContent : styles.flatListContent}
			/>
			
			<TouchableOpacity 
				style={styles.addRecipeButton}
				onPress={() => navigation.navigate('Add Recipe')}
			>
				<MaterialCommunityIcons name="plus" size={48} color="white" />
			</TouchableOpacity>

			<TouchableOpacity 
				style={styles.signOutButton}
				onPress={handleSignOut}
			>
				<Text style={styles.signOutButtonText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
  addRecipeButton: {
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
  signOutButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  signOutButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default RecipesHomeScreen;