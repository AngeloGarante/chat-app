import React, { Component } from 'react';

import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { firebaseConfig } from '../firebase.config';
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
            user: "",
        }

    }
    componentDidMount() {
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onChatUpdate);
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        this.setState({
            messages: [
                {
                    _id: 2,
                    text: ` ${name} joined the chat`,
                    createdAt: new Date(),
                    system: true,

                }]
        })
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                messages: [],
                user: this.props.route.params.name,

            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onChatUpdate);
        });
    }
    componentWillUnmount() {
        if (this.referenceChatMessages) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }

    onChatUpdate = (querySnapshot) => {
        const messages = []
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: this.props.route.params.name
            })
        })
        this.setState({ messages })
    }
    addMessages() {
        const message = this.state.messages[0]
        this.referenceChatMessages.add({
            createdAt: message.createdAt,
            text: message.text || "",
            user: this.props.route.params.name,
            _id: message._id
        })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages(messages);
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
    render() {
        let color = this.props.route.params.color;
        return (
            <View style={[{ flex: 1 }, { backgroundColor: color }]}>

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        name: this.state.user.name
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )
    }

}
