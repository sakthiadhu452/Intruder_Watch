import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NavBar from '@/Components/NavBar/NavBar'; // Ensure this path is correct
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import { useNavigation } from '@react-navigation/native';
import NewProject from '../NewProject/NewProject';


const ContentContainer = () => {
  const navigation = useNavigation();


  return (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Your projects:</Text>
      <View style={styles.projects}>
        <TouchableOpacity style={styles.projectTile}>
          <LinearGradient
            colors={['#D9D9D9', '#B7CBFF']}
            style={styles.gradientBackground}
          >
            <Image
              source={require("../../Assets/CameraForProjectlogo.png")} // Replace with your own image path
              style={styles.projectImage}
            />
          </LinearGradient>
          <Text style={styles.projectText}>Camera Gate 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.projectTile} onPress={()=>{navigation.navigate("NewProject")}}>
          <LinearGradient colors={['#50CEED', '#EBC9E4', '#FFB7B8']}
            locations={[0, 0.63, 1]} style={styles.gradientBackground}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>+</Text>
          </LinearGradient>
          <Text style={styles.projectText} >Add new..</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Dashboard = () => {
  return (
    <View style={{ flex: 1 }}>
      <ContentContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  projects: {
    flexDirection: 'row',
    
  },
  projectTile: {
    width: 150,
    marginHorizontal:20,
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  projectImage: {
    width: '70%',
    height: '70%',
    borderRadius: 20,
    resizeMode: 'cover',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  projectText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default Dashboard;
