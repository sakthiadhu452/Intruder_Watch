import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import {CheckBox} from '@react-native-community/checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';



const CameraIp = () => {
  const [agree, setAgree] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Your RSTP Url here.."
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
          value={agree}
          onValueChange={setAgree}
          tintColors={{ true: '#000', false: '#aaa' }}
        /> */}
        <Text style={styles.checkboxLabel}>
          By clicking, you are agreeing to our <Text style={styles.link}>terms & conditions</Text>
        </Text>
      </View>
     <LinearGradient colors={['#23ADCB','#3378B0','#7033CF']} locations={[0, 0.5, 1]} style={styles.button}>
        <View style={styles.buttonFlex}>
            <Text style={styles.buttonText}>Continue</Text>
            <Icon name="arrow-right" size={30} color="#000" style={styles.icon} />
        </View>
     </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
    borderRadius:9,
    marginTop:80,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '80%',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#aaa',
  },
  link: {
    textDecorationLine: 'underline',
  },
  button: {
    marginLeft:130,
    backgroundColor: '#3a7bd5',
    paddingHorizontal: 22,
    paddingVertical: 5,
    cursor:'pointer',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
  },
  buttonFlex:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon:{
    paddingHorizontal:10,
    transform:[{scaleY:0.4}]
  }
});

export default CameraIp;
