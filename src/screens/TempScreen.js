import React from 'react';
import {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';
import Styles from '../styles/style'
import {AsyncStorage} from 'react-native';
import init from 'react_native_mqtt';


export default TempScreen = ()=>{

    const [temp, setTemp] = useState("Obteniendo datos");
    const [hum, setHum] = useState("Obteniendo datos");
    const [floorHum, setFloorHum] = useState("Obteniendo datos");
    const [irrigation, setIrrigation] = useState("Apagada");
    const [light, setLight] = useState("Apagada");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(()=>{
        getData();
    },[])

    const getData = () => {  //Obtiene datos de sensores

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
        
        client.subscribe('/maximilianocalderon87@gmail.com/getAmbientHumidity');
        client.subscribe('/maximilianocalderon87@gmail.com/getAmbientTemp');
        client.subscribe('/maximilianocalderon87@gmail.com/getFloorHumidity');
        client.subscribe('/maximilianocalderon87@gmail.com/getIrrigationState');
        client.subscribe('/maximilianocalderon87@gmail.com/getLightState');

        client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","ambientTemp");
        client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","ambientHumidity");
        client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","floorHumidity");
        client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","irrigationState");
        client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","lightState");
        }
        
        function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
        }
        
        function onMessageArrived(message) {
            var topic = message.topic;
            var msg = message.payloadString;
            if (topic=="/maximilianocalderon87@gmail.com/getAmbientTemp"){
                setTemp(msg);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getAmbientHumidity"){
                setHum(msg);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getFloorHumidity"){
                setFloorHum(msg);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getIrrigationState"){
                if(msg=="on") setIrrigation("Encendida");
                else setIrrigation("Apagada");
            }
            if (topic=="/maximilianocalderon87@gmail.com/getLightState"){
                setIsLoading(false);
                if(msg=="on") setLight("Encendida");
                else setLight("Apagada");
            }
        }
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
    
        client.onMessageArrived = onMessageArrived;
        client.connect({ onSuccess:onConnect, useSSL: false });
        client.onConnectionLost = onConnectionLost;
    }
    
    return (
        (isLoading)?
        <View style={Styles.mainContainer}>
            <ActivityIndicator size="large" color="#7700AD"/>
        </View>
        :
        <View style={Styles.mainContainer}>
            <Text>Temperatura ambiente: {temp}</Text>
            <Text>Humedad ambiente: {hum}%</Text>
            <Text>Humedad suelo: {floorHum}%</Text>
            <Text>Irrigación: {irrigation}</Text>
            <Text>Iluminación: {light}</Text>
            
            <StatusBar style="auto" />
        </View>
    )

    
}
