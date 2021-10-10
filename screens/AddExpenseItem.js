import React, { useState, useContext, useEffect } from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, Select, Alert } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BottomSheet } from 'react-native-btr';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import ExpenseListView from '../components/ExpenseListView';



function AddExpenseItem() {
    const { user, setUser } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [expense, setExpense] = useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const getCurrentUser = async () => {
        const currentUser = await firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUser(documentSnapshot.data());
                }
            })
    };

    const createExpenseDetails = async () => {
        console.log('expense: ', expense);
        console.log('email', user.email);
        firestore()
            .collection('expenses')
            .add({
                expenseNote: expense.expenseNote,
                expenseAmount: expense.expenseAmount,
                userEmail: user.email,
                createdAt: firestore.Timestamp.fromDate(new Date())
            }).then(() => {
                Alert.alert('Expense Saved Successfully')
            })
    };

    const getUserSpecificExpenses = async() => {
        const expenseArr = [];
        const expenseList = await firestore()
            .collection('expenses')
            .where("userEmail", "==", user.email)
            .get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    expenseArr.push(documentSnapshot.data())
                });
            });
        setExpense(expenseArr);
    };

    useEffect(() => {
        getUserSpecificExpenses();
    }, []);

    const closeAddExpenseBottomSheet = () => {
        createExpenseDetails();
        toggleBottomNavigationView();
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
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

                            {/* <View style={styles.action}>
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
                                </View> */}
                            <View style={styles.action}>
                                <FontAwesome name="money" size={20} />
                                <TextInput
                                    placeholder='Amount'
                                    placeholderTextColor='#666666'
                                    style={styles.textInput}
                                    value={expense ? expense.expenseAmount : ''}
                                    onChangeText={(txt) => setExpense({...expense, expenseAmount: txt})}
                                />
                            </View>
                            <View style={styles.action}>
                                <FontAwesome name="gg" size={20} />
                                <TextInput
                                    placeholder='Notes'
                                    placeholderTextColor='#666666'
                                    style={styles.textInput}
                                    value={expense ? expense.expenseNote : 'Daily Expense'}
                                    onChangeText={(txt) => setExpense({...expense, expenseNote: txt})}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.panelButton}
                                onPress={closeAddExpenseBottomSheet}
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
            <View style={styles.pageContainer}>
                    <View style={styles.container}>
                        <ExpenseListView
                            itemList={expense} />
                    </View>
                </View>
        </View>
    );
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
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
        backgroundColor: '#FCFCFC',
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
    pageContainer: {
        backgroundColor: '#FCFCFC',
        flex: 1,
        padding: 20,
    },
});

export default AddExpenseItem;