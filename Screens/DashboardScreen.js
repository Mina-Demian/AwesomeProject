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

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import api from '../api/api';//

const DashboardScreen = () => {
  const [data, setData] = useState([]);
  const refreshTimer = useRef(null);

  useEffect(() => {
    //fetchData();
    
    const fetchData = async () => {
      try {
        /*
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('apiGetURL', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': 'Secret',
          },
        });
        */

        //const api = setupInterceptor();//
        const response = await api.get('/GasAPI'); //
        //console.log(response.data);
        setData(response.data);
        
      } catch (error) {
        console.error(error);
      }
    };
    

    const startRefreshTimer = () => {
      refreshTimer.current = setInterval(fetchData, 600000);//
    };

    const clearRefreshTimer = () => {
      clearInterval(refreshTimer.current);
    };

    fetchData();
    startRefreshTimer();

    return () => {
      clearRefreshTimer();
    };

  }, []);

  /*
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('apiGetURL', {
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
  */
    const handleRefresh = () => {
        clearInterval(refreshTimer.current);

        fetchData();

        refreshTimer.current = setInterval(fetchData, 600000);//
    };
    

    const fetchData = async () => {
      try {
        /*
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('apiGetURL', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': 'Secret',
          },
        });
        */
        //const api = setupInterceptor();//
        const response = await api.get('/GasAPI'); //
        //console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };


  return (
    /*
    <View style = {styles.container}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
    */
      <View style = {styles.container}>
        <TouchableHighlight 
        style={styles.refreshButton}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={handleRefresh}
        >

            <Text style={styles.buttonText}>Refresh</Text>

        </TouchableHighlight>

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
