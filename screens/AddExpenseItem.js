import React, { useState } from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, Select } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BottomSheet } from 'react-native-btr';
import DropDownPicker from 'react-native-dropdown-picker';


function AddExpenseItem() {
    const [visible, setVisible] = useState(false);
    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    return (
        <ImageBackground
            source={require('../assets/backImage.jpg')}
            style={styles.backgroundImage}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                style={styles.backgroundImage}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }, styles.userBtnWrapper}>
                    <TouchableOpacity style={styles.userBtn}
                        onPress={toggleBottomNavigationView}>
                        <BottomSheet
                            visible={visible}
                            onBackButtonPress={toggleBottomNavigationView}
                            onBackdropPress={toggleBottomNavigationView}
                        >
                            <View style={styles.panel}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.panelTitle}>Add a Transaction</Text>
                                </View>

                                <View style={styles.action}>
                                    <DropDownPicker
                                        placeholder="Transaction Category"
                                        containerStyle={{ height: 40, marginTop: 10 }}
                                        itemStyle={{
                                            justifyContent: 'flex-start',
                                        }}
                                        zIndex={1000}
                                        open={open}
                                        value={value}
                                        items={items}
                                        setOpen={setOpen}
                                        setValue={setValue}
                                        setItems={setItems}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <FontAwesome name="money" size={20} />
                                    <TextInput
                                        placeholder='Amount'
                                        placeholderTextColor='#666666'
                                        style={styles.textInput}
                                    //value={userData ? userData.lname : ''}
                                    //onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
                                    //autoCorrect={false}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <FontAwesome name="gg" size={20} />
                                    <TextInput
                                        placeholder='Currency'
                                        placeholderTextColor='#666666'
                                        style={styles.textInput}
                                    //value={userData ? userData.lname : ''}
                                    //onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
                                    //autoCorrect={false}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.panelButton}
                                    onPress={toggleBottomNavigationView}
                                >
                                    <Text style={styles.panelButtonTitle}>Save Expense</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.panelCancelButton}
                                    onPress={toggleBottomNavigationView}
                                >
                                    <Text style={styles.panelButtonTitle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </BottomSheet>
                        <Text style={styles.userBtnTxt}>Add an Expense Manually</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        opacity: 0.7,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        marginTop: 10,
    },
    userBtnTxt: {
        color: '#2e64e5',
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    panelCancelButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FF474A',
        alignItems: 'center',
        marginVertical: 5,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});

export default AddExpenseItem;