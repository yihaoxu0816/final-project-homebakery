import { View, Text, StyleSheet } from 'react-native';
import SignInBox from './components/SignInBox';
import SignUpBox from './components/SignUpBox';
import { useState } from 'react';
import { globalStyles } from '../../styles/globalStyles';

function LoginScreen({navigation}) {

  const [loginMode, setLoginMode] = useState(true);

  return (
    <View style={[globalStyles.screenContainer, styles.container]}>
      <View style={styles.bodyContainer}>
        
        {loginMode?
          <SignInBox navigation={navigation}/>
        :
          <SignUpBox navigation={navigation}/>
        }
      </View>

      <View style={styles.modeSwitchContainer}>
        { loginMode ? 
          <Text style={styles.switchText}>New user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={styles.linkText}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text style={styles.switchText}>Returning user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={styles.linkText}> Sign in </Text> 
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modeSwitchContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: '#E56442',
    fontWeight: 'bold',
  },
});

export default LoginScreen;