import React from 'react';
import { Text, View, StyleSheet, FlatList, Image } from "react-native";


const CustomRow = ({ title, description }) => (
    <View style={styles.listRowView}>
        <Image source={require('../assets/dollarBag.jpg')} 
        style={styles.photo} />
        <View style={styles.container_text}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.description}>
                LKR {description}
            </Text>
        </View>
    </View>
);

export const CustomListView = ({ itemList }) => (
    itemList ?
        <View style={styles.container}>
            <FlatList
                data={itemList}
                renderItem={({ item }) =>
                    <CustomRow title={item.bName} description={item.allocatedAmount}/>
                }
            />
        </View>
        : <View style={styles.container}>
            <Text style={styles.container_text}>No Allocated Budgets to display</Text>
        </View>

);

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listRowView: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    title: {
        fontSize: 16,
        color: '#000',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    photo: {
        height: 50,
        width: 50,
    },
});

export default CustomListView;