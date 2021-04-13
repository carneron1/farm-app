import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import Styles from '../styles/style'

export default MainScreen = ({navigation})=>{
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

