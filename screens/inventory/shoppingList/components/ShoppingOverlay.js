import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Overlay, Divider, Input } from '@rneui/base';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addInventoryItemThunk } from '../../../../features/inventorySlice';

function ShoppingOverlay({ visible, onClose, item }) {
  const dispatch = useDispatch();
  const [amountBought, setAmountBought] = useState(0);

  const handlePlus = () => {
    setAmountBought(amountBought + 1);
  };

  const handleMinus = () => {
    if (amountBought > 0) {
      setAmountBought(amountBought - 1);
    }
  };

  const handleSave = () => {
    if (amountBought > 0) {
      const inventoryItem = {
        ingredient: item.ingredient,
        count: amountBought,
        unit: item.unit
      };
      dispatch(addInventoryItemThunk(inventoryItem));
      setAmountBought(0);
      onClose();
    }
  };

  return (
    <Overlay 
      isVisible={visible} 
      onBackdropPress={onClose}
      overlayStyle={styles.overlayContainer}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.overlayTitle}>{item?.ingredient}</Text>
        <Text style={styles.overlayDescription}>
          {item?.neededMore > 0 ? `${item?.neededMore} ${item?.unit} remaining needed` : 'Sufficient in inventory'}
        </Text>
      </View>

      <Divider />

      <View>
        <Text style={styles.h2Heading}>Total amount bought &#40;in {item?.unit}&#41; </Text>

        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.minusButton, amountBought === 0 && styles.disabledButton]}
            onPress={handleMinus}
            disabled={amountBought === 0}
          >
            <MaterialCommunityIcons name="minus" size={24} color={amountBought === 0 ? "#ccc" : "#E56442"} />
          </TouchableOpacity>

          <Input
            value={String(amountBought)}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              setAmountBought(num);
            }}
            keyboardType="numeric"
            containerStyle={styles.inputOuterContainer}
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
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
  overlayDescription: {
    fontSize: 17,
  },

  h2Heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
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

  inputOuterContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 0,
    
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
    marginTop: 30,
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

export default ShoppingOverlay;