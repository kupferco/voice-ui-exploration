import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';

const ChatScreen2 = () => {
    // Sample data for the scrollable list
    const data = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                {data.map((item, index) => (
                    <View key={index} style={styles.item}>
                        <Text>{item}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 10,
    },
    item: {
        backgroundColor: '#ddd',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default ChatScreen2;
