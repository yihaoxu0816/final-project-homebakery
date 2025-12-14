import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity, Image, ActionSheetIOS, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Badge } from '@rneui/base';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../../styles/globalStyles';
import { useDispatch } from 'react-redux';
import { addRecipeThunk, updateRecipeThunk } from '../../features/recipeSlice';
import { saveImage } from './CameraScreen';
import * as ImagePicker from 'expo-image-picker';

function IngredientInput({ index, ingredient, onDelete, onUpdate }) {
  const unitOptions = [
    { label: 'g (grams)', value: 'g' },
    { label: 'mL (milliliters)', value: 'mL' },
    { label: 'count', value: 'count' },
  ];

  return (
    <View style={{flexDirection: 'row', gap: 8, marginBottom: 12}}>

      <Badge 
        value={index + 1} 
        badgeStyle={{ backgroundColor: '#ccc', height: 22, width: 22 }}
        textStyle={{ color: 'white', fontWeight: 'bold' }}
      />

      {/* Ingredient Name */}
      <View style={{ flex: 1 }}>
        <Input
          placeholder="e.g. Milk"
          label={"Ingredient"}
          labelStyle={styles.labelStyle}
          containerStyle={styles.inputOuterContainer}
          inputContainerStyle={styles.inputContainer}
          errorStyle={{ height: 0 }}
          value={ingredient.name}
          onChangeText={(text) => onUpdate('name', text)}
        />

        {/* Amount and Unit */}
        <View style={{ flexDirection: 'row', gap: 8 }}>

          {/* Amount */}
          <Input 
            placeholder="200"
            label="Amount"
            labelStyle={styles.labelStyle}
            containerStyle={{width: '30%', paddingHorizontal: 0}}
            inputContainerStyle={styles.inputContainer}
            errorStyle={{ height: 0 }}
            value={ingredient.amount}
            onChangeText={(text) => onUpdate('amount', text)}
            keyboardType="numeric"
          />

          {/* Unit */}
          <View style={{width: '50%'}}>
            <Text style={styles.labelStyle}>Unit</Text>
            <Dropdown
              data={unitOptions}
              labelField="label"
              valueField="value"
              placeholder="Select unit..."
              value={ingredient.unit}
              onChange={item => {
                onUpdate('unit', item.value);
              }}
              style={styles.dropdownStyle}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              containerStyle={styles.dropdownContainer}
            />
          </View>
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity 
        onPress={onDelete}
        style={styles.deleteButton}>
        <MaterialCommunityIcons name="close" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

function AddRecipeScreen({ navigation, route }) {
  const item = route.params?.item;
  const dispatch = useDispatch();

  // Keep track of the original imageRef for replacement
  const originalImageRef = item?.imageRef || null;

  // useState variables
  const [ingredients, setIngredients] = useState(item?.ingredients || [
    { name: '', amount: '', unit: '' }
  ]);
  const [recipeName, setRecipeName] = useState(item?.recipeName || '');
  const [sellingPrice, setSellingPrice] = useState(item?.sellingPrice || '');
  const [imageUri, setImageUri] = useState(item?.imageRef || null);

  useEffect(() => {
    console.log('Ingredients:', ingredients);
  }, [ingredients]);

  const handleImageCaptured = (uri) => {
    setImageUri(uri);
  };

  const handleTakePhoto = () => {
    navigation.navigate('Camera', { 
      onImageCaptured: handleImageCaptured 
    });
  };

  const handleChooseFromGallery = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to select photos!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handleChooseFromGallery();
          }
        }
      );
    } else {
      // For Android, you could use a similar native solution or the custom modal
      Alert.alert(
        'Upload Image',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: handleTakePhoto },
          { text: 'Choose from Gallery', onPress: handleChooseFromGallery },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const saveRecipe = async () => {
    let imageRef = null;
    
    if (imageUri) {
      // Check if it's a local file (new photo) or existing Firebase URL
      if (imageUri.startsWith('file://')) {
        // Upload new image to Firebase
        // If replacing existing image, pass originalImageRef to overwrite it
        imageRef = await saveImage(imageUri, originalImageRef);
      } else {
        // Keep existing Firebase URL
        imageRef = imageUri;
      }
    }

    const newRecipe = {
      recipeName: recipeName,
      sellingPrice: sellingPrice,
      ingredients: ingredients,
      imageRef: imageRef,
    };
    console.log(newRecipe);
    if (item && item.key) {
      // Include the key in the recipe object for updating
      dispatch(updateRecipeThunk({ ...newRecipe, key: item.key }));
    } else {
      dispatch(addRecipeThunk(newRecipe));
    }

    navigation.goBack();
  }

  

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const deleteIngredient = (index) => {
    setIngredients(ingredients.filter((ingredient, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    setIngredients(ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    ));
  };

    return (
      <ScrollView style={globalStyles.screenContainer}>

        {/* Image Upload */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Image</Text>
          <TouchableOpacity 
            style={styles.imageUploadContainer}
            onPress={showImagePickerOptions}
          >
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview}
              />
            ) : (
              <>
                <MaterialCommunityIcons name="camera" size={48} color="#E56442" />
                <Text style={styles.uploadImageText}>Upload Image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Product Name */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Product Name</Text>
          <Input
            placeholder="e.g. Chocolate Chip Cookies" 
            containerStyle={styles.inputOuterContainer}
            inputContainerStyle={styles.inputContainer}
            value={recipeName}
            onChangeText={(text) => setRecipeName(text)}
            />
        </View>

        {/* Ingredients */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Ingredients</Text>
          
          {ingredients.map((ingredient, index) => (
            <IngredientInput 
              key={index} 
              index={index}
              ingredient={ingredient}
              onDelete={() => deleteIngredient(index)}
              onUpdate={(field, value) => updateIngredient(index, field, value)}
            />
          ))}

          {/* Add Another Ingredient */}
          <TouchableOpacity 
            style={styles.addIngredientButton}
            onPress={addIngredient}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#E56442" />
            <Text style={styles.addIngredientText}>Add Another Ingredient</Text>
          </TouchableOpacity>

        </View>

        {/* Product Price */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Selling Price</Text>
          <Input
            placeholder="12.99"
            leftIcon={<MaterialCommunityIcons name="currency-usd" size={24} color="black" />}
            keyboardType="numeric"
            decimalPlaces={2}
            containerStyle={styles.inputOuterContainer}
            inputContainerStyle={styles.inputContainer}
            value={sellingPrice}
            onChangeText={(text) => setSellingPrice(text)}
            />
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 13,
    marginBottom: 14,
    gap: 4,
  },

  formCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  inputOuterContainer: {
    paddingHorizontal: 0,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 0
  },

  labelStyle: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'regular',
    marginBottom: 4,
  },

  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: 'white',
  },

  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9EA0A4',
  },

  dropdownSelectedText: {
    fontSize: 16,
    color: 'black',
  },

  dropdownContainer: {
    borderRadius: 4,
  },

  ingredientInput: {
    marginBottom: 12,
  },

  deleteButton: {
    paddingTop: 32,
    paddingLeft: 4,
  },

  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 100,
    backgroundColor: '#FDEFEC',
  },

  addIngredientText: {
    color: '#E56442',
    fontSize: 14,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#E56442',
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 14,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  imageUploadContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  uploadImageText: {
    color: '#E56442',
    fontSize: 16,
    fontWeight: '600',
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
});

export default AddRecipeScreen;