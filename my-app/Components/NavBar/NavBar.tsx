import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.NavContainer}>
      <View style={styles.NavLeft}>
        <Image
          source={require('../../Assets/outline.png')} // Ensure this path is correct
          style={styles.image}
        />
        <Image 
        source={require('../../Assets/intruder_watch-removebg-preview.png')}
          style={styles.intruderWatchLogo}
        />
        <Text style={styles.LogoAbsolute}>
          Intruder Watch
        </Text>
      </View>

      <View style={styles.NavRight}>
        <TouchableOpacity style={styles.NavList} onPress={() => navigation.navigate('HOME')}>
          <Text style={styles.text}>HOME</Text>
          <View style={styles.NavLine} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.NavList} onPress={() => navigation.navigate('ABOUT')}>
          <Text style={styles.text}>ABOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.NavList} onPress={() => navigation.navigate('CONTACT US')}>
          <Text style={styles.text}>CONTACT US</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  NavContainer: {
    width:'100%',
    minHeight: 50,
    backgroundColor: '#080829',
    maxHeight: 50,
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Space out the left and right sections
    alignItems: 'center',
    flex:1,
    
  },
  NavLeft: {
    // flex: 1,
    // justifyContent: 'center', 
    // alignItems: 'center',
    // alignSelf:'flex-start',
    // marginLeft:-490 // Center content horizontally
    flexDirection: 'row',
    alignItems: 'center',
    // width: '%', 
  },
  NavRight: {
    width: '40%', // Adjust width as needed
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Space buttons evenly
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 20,
    fontSize: 15,
    color: 'white',
    fontFamily: 'Space Grotesk', // Ensure this font is loaded correctly
  },
  NavList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  NavLine: {
    marginTop: 5,
    width: '100%', // Full width of its parent
    height: 2,
    backgroundColor: '#ffffff',
  },
  
  intruderWatchLogo:{
    position:'absolute',
    width:60,
    height:60,
    marginRight:300
    
  },
  LogoAbsolute:{
    position:'absolute',
    fontWeight:900,
    color:'white',
    fontSize:25,
    left:'14%'
  },
  
});

export default NavBar;
