/*
import React from 'react';
import { View, Text } from 'react-native';

const DashboardScreen = () => {
    return (
      <View>
        <Text>Hello World!</Text>
      </View>
    );
  };
  
  export default DashboardScreen;
  */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DashboardScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://192.168.2.17:5292/api/GasAPI', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': 'Secret',
          },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleRefresh = () => {
        fetchData();
    };
    

  return (
    <View style = {styles.container}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>


      {data.map((item) => (
        <View style = {styles.item} key = {item.id}>
          <Text style = {styles.text}>Name: {item.name}</Text>
          <Text style = {styles.text}>Address: {item.address}</Text>
          <Text style = {styles.text}>Number of Pumps: {item.number_of_Pumps}</Text>
          <Text style = {styles.text}>Price: {item.price}</Text>
          <Text style = {styles.text}>Purity: {item.purity}</Text>
          {/* Render other properties as needed */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
      paddingHorizontal: 20,
    },
    refreshButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
      backgroundColor: 'lightgray',
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    item: {
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      marginBottom: 5,
    },
  });

export default DashboardScreen;
