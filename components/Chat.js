import React from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { firebaseConfig } from '../firebase.config'

const firebase = require('firebase');
require('firebase/firestore');



if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                avatar: '',
                name: '',
            },
            loggedInText: 'Please standby...',
            image: null,
            location: null,
            isConnected: false,
        };
    }


    async getMessages() {
        let messages = "";
        try {
            messages = (await AsyncStorage.getItem("messages")) || [];
            console.log("async get messages", messages);
            this.setState({
                messages: JSON.parse(messages),
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');
                this.setState({
                    isConnected: true,
                });
            } else {
                console.log('offline');
                this.setState({
                    isConnected: false,
                });
            }
        });
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(
            user => {
                if (!user) {
                    firebase.auth().signInAnonymously();
                }
                this.setState({
                    uid: user.uid,
                    messages: [],
                    isConnected: true,
                    user: {
                        _id: user.uid,
                    },
                    loggedInText: '',
                });

                this.unsubscribe = this.referenceChatMessages
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(this.onCollectionUpdate);
            }
        );
        this.getMessages();
    }

    componentWillUnmount() {
        if (this.referenceChatMessages) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }


    addMessage = () => {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        });
    };

    onSend(messages = []) {

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {

                this.addMessage(messages);


            }
        );
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];

        querySnapshot.forEach((doc) => {

            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar || '',
                },
                image: data.image || null,
                location: data.location || null,
            });
        });

        this.setState({ messages });
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    };


    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    };

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#12436f'
                    }
                }}
            />
        )
    }

    render() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name })
        let color = this.props.route.params.color;
        return (
            <ActionSheetProvider>
                <View style={[styles.container, { backgroundColor: color }]}>
                    <GiftedChat
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                        renderActions={this.renderCustomActions.bind(this)}
                        renderCustomView={this.renderCustomView.bind(this)}
                        onSend={(messages) => this.onSend(messages)}
                        user={{
                            _id: this.state.user._id,
                            avatar: '',
                            name: name
                        }}
                        accessible={true}
                        accessibilityLabel="Text message input field."
                        accessibilityHint="You can type your message here.  You can send your message by pressing the button on the right."
                    />
                    {/* fixes the keyboard entering the input box */}
                    {Platform.OS === 'android' ? (
                        <KeyboardAvoidingView behavior="height" />
                    ) : null
                    }
                </View>
            </ActionSheetProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})