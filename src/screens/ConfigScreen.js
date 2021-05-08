import React from 'react';
import {useState, useEffect} from 'react';
import { View, Text, ActivityIndicator, Switch } from 'react-native';
import Styles from '../styles/style'
import {AsyncStorage} from 'react-native';
import init from 'react_native_mqtt';
import Slider from '@react-native-community/slider';

export default ConfigScreen = ()=>{

    const [floorHum, setFloorHum] = useState(50);
    const [manualMode, setManualMode] = useState(false);
    const [light, setLight] = useState(false);
    const [irrigation, setIrrigation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        getData();
    },[])

    const getData = () => { //Obtiene datos de sensores y estados de switches

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
            client.subscribe('/maximilianocalderon87@gmail.com/getFloorHumidityTarget');
            client.subscribe('/maximilianocalderon87@gmail.com/getManualMode');
            client.subscribe('/maximilianocalderon87@gmail.com/getIrrigationManualState');
            client.subscribe('/maximilianocalderon87@gmail.com/getLightManualState');
            client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","floorHumidityTarget");
            client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","manualMode");
            client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","manualLightState");
            client.publish("/maximilianocalderon87@gmail.com/requestSensorValue","manualIrrigationState");
        }
        
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }
        
        function onMessageArrived(message) {
            var topic = message.topic;
            var msg = message.payloadString;

            if (topic=="/maximilianocalderon87@gmail.com/getFloorHumidityTarget"){
                setFloorHum(Number(msg));
                setIsLoading(false);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getManualMode"){
                if (msg=="false") setManualMode(false);
                else setManualMode(true);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getIrrigationManualState"){
                if (msg=="off") setIrrigation(false);
                else setIrrigation(true);
            }
            if (topic=="/maximilianocalderon87@gmail.com/getlightManualState"){
                if (msg=="off") setLight(false);
                else setLight(true);
            }
        }
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
    
        client.onMessageArrived = onMessageArrived;
        client.connect({ onSuccess:onConnect, useSSL: false });
        client.onConnectionLost = onConnectionLost;
    }

    function slideIsCompleted (value){ //Envia el valor cuando finaliza el evento slide
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
        client.connect({ onSuccess:onConnect, useSSL: false });
        client.onConnectionLost = onConnectionLost;

        function onConnect() {
            console.log("onConnect");
            client.publish("/maximilianocalderon87@gmail.com/setHumidityTarget",String(floorHum));
        }
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }
    }    

    const toggleLight = () =>{ //On-Off luz
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
        client.connect({ onSuccess:onConnect, useSSL: false });
        function onConnect() {
            console.log("onConnect");
            let val;
            if (light) val = "off";
            else val = "on";
            setLight(!light);
            client.publish("/maximilianocalderon87@gmail.com/setLightManual",val);
        }
    }

    const toggleIrrigation = () =>{ //On-Off irrigación
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
        client.connect({ onSuccess:onConnect, useSSL: false });
        function onConnect() {
            console.log("onConnect");
            let val;
            if (irrigation) val = "off";
            else val = "on";
            setIrrigation(!irrigation);
            client.publish("/maximilianocalderon87@gmail.com/setIrrigationManual",val);
        }
    }

    const toggleManualMode = () => {    //Activa modo manual. Todos los switches se apagan al entrar en este modo
        let uname = Math.random().toString(36).substring(7);
        const client = new Paho.MQTT.Client('test.mosquitto.org', 8080, uname);
        client.connect({ onSuccess:onConnect, useSSL: false });
        function onConnect() {
            console.log("onConnect");
            let val;
            if (manualMode) val = "false";
            else val = "true";
            setManualMode(!manualMode);
            client.publish("/maximilianocalderon87@gmail.com/setManualMode",val);
        }
    }

    return (
        (isLoading)?
        <View style={Styles.mainContainer}>
            <ActivityIndicator size="large" color="#7700AD"/>
        </View>
        :
        <View style={Styles.mainContainer}>
            <Text>Humedad del sustrato</Text>
            <Slider
                style={{width: 200, height: 40}}
                minimumValue={5}
                maximumValue={95}
                step={1}
                minimumTrackTintColor="#7700AD"
                maximumTrackTintColor="#09BA8E"
                thumbTintColor="#09BA8E"
                onSlidingComplete={(value)=>{slideIsCompleted(value)}}
                onValueChange={value=>{setFloorHum(value)}}
                value = {floorHum}
            />
            <Text>{floorHum}%</Text>
            <View style={Styles.inlineContainer}>
                <Text>Modo manual: </Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    onValueChange={()=>toggleManualMode()}
                    value={manualMode}
                />
            </View>
            <View style={Styles.inlineContainer}>
                <Text>Iluminación: </Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    onValueChange={()=>toggleLight()}
                    value={light&&manualMode}
                    disabled={!manualMode}
                />
            </View>
            <View style={Styles.inlineContainer}>
                <Text>Irrigación: </Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    onValueChange={()=>toggleIrrigation()}
                    value={irrigation&&manualMode}
                    disabled={!manualMode}
                />
            </View>
        </View>
    )
}