import React, { Component } from 'react';

import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { View, Platform, KeyboardAvoidingView, InputToolbar } from 'react-native';
import { firebaseConfig } from '../firebase.config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
const firebase = require('firebase');
require('firebase/firestore')
if (!firebase.apps.lenght) {
    firebase.initializeApp(firebaseConfig)
}
export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            user: {
                name: "",
            },
            isConnected: false,
        }

    }
    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        this.referenceChatMessages = firebase.firestore().collection("messages");
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        messages: [],
                        user: {
                            name,
                        },
                        isConnected: true
                    });
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy("createdAt", "desc")
                        .onSnapshot(this.onChatUpdate);
                });
            } else {
                this.setState(
                    {
                        _id: 2,
                        text: ` ${name} is currently offline`,
                        createdAt: new Date(),
                        system: true,
                    }
                )
                this.getMessages();
                this.setState({ isConnected: false })
            }
        });


    }
    componentWillUnmount() {
        if (this.referenceChatMessages) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }
    async getMessages() {
        let messages = "";
        try {
            messages = await AsyncStorage.getItem('messages ' || []);
            this.setState({
                messages: JSON.parse(messages)
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    onChatUpdate = (querySnapshot) => {
        if (!this.state.isConnected) return;
        const messages = []
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: this.props.route.params.name,
                _id: data._id,
                user: {
                    name: data.user.name,
                },
            })
        })
        this.setState({ messages })
    }
    addMessages() {
        const message = this.state.messages[0]
        this.referenceChatMessages.add({
            createdAt: message.createdAt,
            text: message.text || "",
            user: {
                name: this.props.route.params.name,
            }
            ,
            _id: message._id
        })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages(messages);
                this.saveMessages();
            }
        );
    }


    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000"
                    }
                }}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
    render() {
        let color = this.props.route.params.color;
        return (
            <View style={[{ flex: 1 }, { backgroundColor: color }]}>

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    key={this.state.messages._id}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )
    }

}
