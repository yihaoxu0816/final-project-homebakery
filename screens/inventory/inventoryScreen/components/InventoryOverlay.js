import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Overlay, Divider, Input } from '@rneui/base';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateInventoryItemThunk, deleteInventoryItemThunk } from '../../../../features/inventorySlice';

function InventoryOverlay({ visible, onClose, item }) {
  const dispatch = useDispatch();
  const [currentAmount, setCurrentAmount] = useState(0);

  // Initialize with item's current count when item changes
  useEffect(() => {
    if (item) {
      setCurrentAmount(item.count || 0);
    }
  }, [item]);

  const handlePlus = () => {
    setCurrentAmount(currentAmount + 1);
  };

  const handleMinus = () => {
    if (currentAmount > 0) {
      setCurrentAmount(currentAmount - 1);
    }
  };

  const handleSave = () => {
    if (currentAmount >= 0) {
      const updatedItem = {
        ...item,
        count: currentAmount
      };
      dispatch(updateInventoryItemThunk(updatedItem));
      onClose();
    }
  };

  const handleDelete = () => {
    dispatch(deleteInventoryItemThunk(item));
    onClose();
  };

  return (
    <Overlay 
      isVisible={visible} 
      onBackdropPress={onClose}
      overlayStyle={styles.overlayContainer}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.overlayTitle}>{item?.ingredient}</Text>
          {item?.count <= 0 && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
        <Text style={styles.overlayDescription}>Current: {item?.count} {item?.unit}</Text>
      </View>

      <Divider />

      <View>
        <Text style={styles.h2Heading}>Update amount &#40;in {item?.unit}&#41; </Text>

        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.minusButton, currentAmount === 0 && styles.disabledButton]}
            onPress={handleMinus}
            disabled={currentAmount === 0}
          >
            <MaterialCommunityIcons name="minus" size={24} color={currentAmount === 0 ? "#ccc" : "#E56442"} />
          </TouchableOpacity>

          <Input
            value={String(currentAmount)}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              setCurrentAmount(num);
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

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete from inventory</Text>
        </TouchableOpacity>
        
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overlayDescription: {
    fontSize: 17,
  },
  outOfStockBadge: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
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

  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 8,
  },

  deleteButtonText: {
    color: '#E56442',
    fontSize: 14,
  },
});

export default InventoryOverlay;

