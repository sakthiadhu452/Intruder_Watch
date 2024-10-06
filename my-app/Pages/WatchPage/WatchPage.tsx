import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, ScrollView } from 'react-native';
import * as Papa from 'papaparse';  // To parse CSV

const WatchPage = () => {
  const [intruderDetails, setIntruderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntruderData = async () => {
      try {
        // Fetch the CSV file from your backend
        const response = await fetch('http://127.0.0.1:8000/uploads/intruderList.csv');
        const csvText = await response.text();
  
        // Parse CSV using PapaParse
        Papa.parse(csvText, {
          header: true, // Assuming the CSV has headers
          complete: (result) => {
            // Filter out empty rows (e.g., rows without a valid Tracker ID)
            const filteredData = result.data.filter(
              intruder => intruder['Tracker ID'] && intruder['Tracker ID'].trim() !== ''
            );
            
            setIntruderDetails(filteredData); // Store filtered intruder data
          },
        });
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setLoading(false);
      }
    };
  
    fetchIntruderData();
  }, []);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : intruderDetails.length > 0 ? (
        intruderDetails.map((intruder, index) => (
          <View key={index} style={styles.intruderContainer}>
            <Image source={{ uri: intruder['Image Path'] }} style={styles.image} alt={`Intruder ${intruder['Tracker ID']}`} />
            <Text style={styles.details}>Tracker ID: {intruder['Tracker ID']}</Text>
            <Text style={styles.details}>Detection Time: {intruder['Time']}</Text>
            <Text style={styles.details}>Frame: {intruder['Frame']}</Text>
          </View>
        ))
      ) : (
        <Text>No Intruder Data Available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  intruderContainer: {
    marginBottom: 30,  // Add spacing between intruder entries
    alignItems: 'center',
    display:"flex",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default WatchPage;
