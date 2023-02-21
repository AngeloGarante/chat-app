import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class Chat extends Component {
    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }
    render() {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>here will be the chat</Text>
            </View>
        )
    }
}

