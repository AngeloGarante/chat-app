import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

const backgroundColors = {
    black: { backgroundColor: "#090C08" },
    purple: { backgroundColor: "#474056" },
    grey: { backgroundColor: "#d8d1d8" },
    green: { backgroundColor: "#94ae89" },
};
export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "", color: "" }
    }
    render() {
        const { black, purple, grey, green } = backgroundColors;
        return (
            <View style={styles.container}>
                <ImageBackground source={require("../assets/Background-Image.png")} style={[styles.container, styles.backgroundImage]}>
                    <Text style={styles.title}>Chat App</Text>



                    <View style={styles.boxWrapper}>
                        <TextInput
                            style={styles.nameBox}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Enter your Name:' />

                        <Text style={{ fontSize: 16, fontWeight: "300", color: "#757083", opacity: 100, }}>Choose background color:</Text>
                        <View style={styles.panelSelector}>
                            <TouchableOpacity
                                style={[styles.color, black,
                                this.state.color === black.backgroundColor ? styles.colorSelected : {}]}
                                onPress={() => this.setState({ color: black.backgroundColor })}
                            />
                            <TouchableOpacity
                                style={[styles.color, purple,
                                this.state.color === purple.backgroundColor ? styles.colorSelected : {}]}
                                onPress={() => this.setState({ color: purple.backgroundColor })}
                            />
                            <TouchableOpacity
                                style={[styles.color, grey,
                                this.state.color === grey.backgroundColor ? styles.colorSelected : {}]}
                                onPress={() => this.setState({ color: grey.backgroundColor })}
                            />
                            <TouchableOpacity
                                style={[styles.color, green,
                                this.state.color === green.backgroundColor ? styles.colorSelected : {}]}
                                onPress={() => this.setState({ color: green.backgroundColor })}
                            />


                        </View>
                        <TouchableOpacity

                            style={styles.startButton}
                            onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name, color: this.state.color })} >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF", }}> Start to Chat</Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
            </View >
        )
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        title: {
            fontSize: 45,
            fontWeight: "600",
            color: "#FFFFFF",
            marginTop: 60,
            position: "absolute",
            left: 100,
            top: 100
        },
        nameBox: {
            height: 50,
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 2,
            color: '#757083',
            opacity: 50,
            fontSize: 16,
            fontWeight: '300',
            paddingLeft: 10,
            width: "88%",
        },
        startButton: {
            fontSize: 16,
            fontWeight: "300",
            opacity: 1,
            width: "88%",
            height: "15%",
            backgroundColor: "#757083",
            flexDirection: "row",
            justifyContent: 'space-evenly',
            alignItems: "center"


        },
        backgroundImage: {
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center'
        },
        panelSelector: {
            backgroundColor: "white",
            width: 300,
            height: 120,
            justifyContent: 'space-evenly',
            flexDirection: "row",
            alignItems: "center",
        },
        boxWrapper: {
            backgroundColor: "white",
            textAlign: "center",
            alignItems: "center",
            width: "88%",
            height: "44%",
            justifyContent: "space-evenly",
            position: 'absolute',
            left: 18,
            top: 350,

        },
        color: {
            borderRadius: 25,
            width: 50,
            height: 50,

        },
        colorSelected: {
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "#5f5f5f",
        }

    }
)