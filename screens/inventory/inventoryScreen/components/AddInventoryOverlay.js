import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Overlay, Divider, Input } from '@rneui/base';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addInventoryItemThunk } from '../../../../features/inventorySlice';
import { Dropdown } from 'react-native-element-dropdown';

function AddInventoryOverlay({ visible, onClose }) {
  const dispatch = useDispatch();
  const [ingredientName, setIngredientName] = useState('');
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState('');

  const unitOptions = [
    { label: 'g (grams)', value: 'g' },
    { label: 'mL (milliliters)', value: 'mL' },
    { label: 'count', value: 'count' },
  ];

  const handlePlus = () => {
    setAmount(amount + 1);
  };

  const handleMinus = () => {
    if (amount > 0) {
      setAmount(amount - 1);
    }
  };

  const handleSave = () => {
    if (ingredientName.trim() && amount > 0 && unit) {
      const newInventoryItem = {
        ingredient: ingredientName.trim(),
        count: amount,
        unit: unit
      };
      dispatch(addInventoryItemThunk(newInventoryItem));
      // Reset form
      setIngredientName('');
      setAmount(0);
      setUnit('');
      onClose();
    }
  };

  const handleClose = () => {
    setIngredientName('');
    setAmount(0);
    setUnit('');
    onClose();
  };

  return (
    <Overlay 
      isVisible={visible} 
      onBackdropPress={handleClose}
      overlayStyle={styles.overlayContainer}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.overlayTitle}>Add Inventory Item</Text>
      </View>

      <Divider />

      <View>
        {/* Ingredient Name Input */}
        <Text style={styles.labelStyle}>Ingredient Name</Text>
        <Input
          placeholder="e.g. Flour"
          value={ingredientName}
          onChangeText={setIngredientName}
          containerStyle={styles.inputOuterContainer}
          inputContainerStyle={styles.inputContainer}
          errorStyle={{ height: 0, margin: 0 }}
        />

        {/* Unit Dropdown */}
        <Text style={styles.labelStyle}>Unit</Text>
        <Dropdown
          data={unitOptions}
          labelField="label"
          valueField="value"
          placeholder="Select unit..."
          value={unit}
          onChange={item => setUnit(item.value)}
          style={styles.dropdownStyle}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          containerStyle={styles.dropdownContainer}
        />

        {/* Amount Counter */}
        <Text style={[styles.labelStyle, { marginTop: 16 }]}>Amount (in {unit || 'unit'})</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.minusButton, amount === 0 && styles.disabledButton]}
            onPress={handleMinus}
            disabled={amount === 0}
          >
            <MaterialCommunityIcons name="minus" size={24} color={amount === 0 ? "#ccc" : "#E56442"} />
          </TouchableOpacity>

          <Input
            value={String(amount)}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              setAmount(num);
            }}
            keyboardType="numeric"
            containerStyle={styles.amountInputOuterContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            errorStyle={{ height: 0, margin: 0 }}
          />

          <TouchableOpacity style={styles.plusButton} onPress={handlePlus}>
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
        
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 312,
    gap: 20
  },
  contentContainer: {
    gap: 8,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  labelStyle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },

  inputOuterContainer: {
    paddingHorizontal: 0,
    marginBottom: 8,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 0,
    justifyContent: 'center',
  },

  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 8,
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

  minusButton: {
    backgroundColor: '#FDEFEC',
    padding: 10,
    borderRadius: 100,
    aspectRatio: 1,
    width: 48, 
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },

  plusButton: {
    backgroundColor: '#E56442',
    padding: 10,
    borderRadius: 100,
    aspectRatio: 1,
    width: 48, 
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  amountInputOuterContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 0,
  },

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  inputText: {
    textAlign: 'center',
    fontSize: 37,
    fontWeight: 'bold',
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'stretch',
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: '#FDEFEC',
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
    flex: 1,
  },

  cancelButtonText: {
    color: '#E56442',
    fontSize: 16,
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#E56442',
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
    flex: 1,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddInventoryOverlay;

