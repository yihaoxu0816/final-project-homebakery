import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signUp } from '../../../auth/AuthManager';

function SignUpBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Sign Up</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput 
          style={styles.input}
          placeholder='Enter your name' 
          autoCapitalize='words'
          spellCheck={false}
          onChangeText={text=>setDisplayName(text)}
          value={displayName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input}
          placeholder='Enter email address' 
          autoCapitalize='none'
          spellCheck={false}
          onChangeText={text=>setEmail(text)}
          value={email}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input}
          placeholder='Enter password' 
          autoCapitalize='none'
          spellCheck={false}
          secureTextEntry={true}
          onChangeText={text=>setPassword(text)}
          value={password}
        />
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={async () => {
          try {
            await signUp(displayName, email, password);
            navigation.navigate("Main");
          } catch(error) {
            Alert.alert("Sign Up Error", error.message, [{ text: "OK" }])
          }
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '85%',
    gap: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#E56442',
    padding: 14,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpBox;