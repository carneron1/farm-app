import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Button, TouchableOpacity, Alert } from 'react-native';
import Styles from '../styles/style'
import init from 'react_native_mqtt';
import {AsyncStorage} from 'react-native';
import { useState, useEffect } from 'react';

export default MainScreen = ({navigation})=>{

    const [isConnected, setIsConnected] = useState(false);

    useEffect(()=>{
        verifyConnection(); //Espera 8 segundos respuesta desde el dispositivo de sensores
        setTimeout(()=>{
            if (!isConnected){
                Alert.alert(
                    "Sin conexión",
                    "No se recibió respuesta desde el dispositivo"
                )
            }
        }, 8000)
    },[])

    const verifyConnection = ()=>{   // Solicita un mensaje de respuesta para verificar conexion con Arduino
        init({
            size: 10000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
            reconnect: true,
            sync : {}
          });
          
        function onConnect() {
            console.log("onConnect");
            client.subscribe('/maximilianocalderon87@gmail.com/handShake');
            client.publish("/maximilianocalderon87@gmail.com/isConnected","isConnected");
        }
        
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }
        
        function onMessageArrived(message) {
            var topic = message.topic;
            var msg = message.payloadString;

            if (topic=="/maximilianocalderon87@gmail.com/handShake"){
                setIsConnected(true);
            }
        }
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
        client.onMessageArrived = onMessageArrived;
        client.connect({ onSuccess:onConnect, useSSL: false });
        client.onConnectionLost = onConnectionLost;
    }

    return (
        <View style={Styles.mainContainer}>
            <TouchableOpacity style={Styles.menuButton}>
                <Button
                    style={Styles.menuButton}
                    title="Ver estado"
                    onPress = {()=>navigation.navigate('Temp')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={Styles.menuButton}>
                <Button
                    style={Styles.menuButton}
                    title="Configuración"
                    onPress = {()=>navigation.navigate('Config')}
                />
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    )

}

