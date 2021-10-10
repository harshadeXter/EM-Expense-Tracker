import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, FlatList } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BottomSheet } from 'react-native-btr';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { CustomListView } from '../components/CustomListView';


function AddBudget() {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [budgetInfo, setBudgetInfo] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    const [visible, setVisible] = useState(false);
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

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getUserSpecificBudgetInfo = async () => {
        const budgetArr = [];
        const budgetList = await firestore()
            .collection('budgets')
            .where("userEmail", "==", user.email)
            .get().then(querySnapshot => {
                //console.log('all budget Info: ', querySnapshot, " ", querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    budgetArr.push(documentSnapshot.data())
                });
            });
        setBudgetInfo(budgetArr);
    };

    useEffect(() => {
        getUserSpecificBudgetInfo();
    }, []);

    const createBudget = async () => {
        firestore()
            .collection('budgets')
            .add({
                bName: budgetInfo.bName,
                allocatedAmount: budgetInfo.budgetAmount,
                userEmail: user.email,
                createdAt: firestore.Timestamp.fromDate(new Date()),
            }).then(() => {
                Alert.alert('Add Budget Details successfully.')
            })
    };

    const closeCreateBudgetBottomSheet = () => {
        createBudget();
        toggleBottomNavigationView();
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                style={styles.backgroundImage}>
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }, styles.userBtnWrapper}>
                    <TouchableOpacity style={styles.userBtn}
                        onPress={toggleBottomNavigationView}
                    >
                        <KeyboardAvoidingView behavior="height">
                            <BottomSheet
                                visible={visible}
                                onBackButtonPress={toggleBottomNavigationView}
                                onBackdropPress={toggleBottomNavigationView}
                            >
                                <View style={styles.panel}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.panelTitle}>Add New Budget</Text>
                                        <Text style={styles.panelSubtitle}>Please fill below fields</Text>
                                    </View>

                                    <View style={styles.action}>
                                        <FontAwesome name="user-md" size={20} />
                                        <TextInput
                                            placeholder='Budget Name'
                                            placeholderTextColor='#666666'
                                            style={styles.textInput}
                                            value={budgetInfo ? budgetInfo.bName : ''}
                                            onChangeText={(txt) => setBudgetInfo({ ...budgetInfo, bName: txt })}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <FontAwesome name="money" size={20} />
                                        <TextInput
                                            placeholder='Amount'
                                            placeholderTextColor='#666666'
                                            style={styles.textInput}
                                            keyboardType="number-pad"
                                            value={budgetInfo ? budgetInfo.budgetAmount : ''}
                                            onChangeText={(txt) => setBudgetInfo({ ...budgetInfo, budgetAmount: txt })}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <TouchableOpacity
                                            title="Open" onPress={() => setOpen(true)}
                                        >
                                            <FontAwesome name="calendar-o" size={20} />
                                            <DatePicker
                                                modal
                                                open={open}
                                                date={date}
                                                mode={"date"}
                                                minimumDate={new Date()}
                                                onConfirm={(date) => {
                                                    setOpen(false)
                                                    setDate(moment(date).format('YYYY-MM-DD'))
                                                    setBudgetInfo({ ...budgetInfo, budgetStartDate: txt })
                                                    console.log(date);
                                                    console.log('start date', budgetInfo.budgetStartDate ? budgetInfo.budgetStartDate : 'nothing')
                                                }}
                                                onCancel={() => {
                                                    setOpen(false)
                                                }}
                                            />
                                            <Text style={
                                                {
                                                    marginTop: -15,
                                                    paddingLeft: 30,
                                                    color: '#05375a',
                                                }
                                            }>{date ? moment(date).format('YYYY-MM-DD') : ''}</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <TouchableOpacity
                                        style={styles.panelButton}
                                        onPress={closeCreateBudgetBottomSheet}
                                    >
                                        <Text style={styles.panelButtonTitle}>Create a New Budget</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.panelCancelButton}
                                        onPress={toggleBottomNavigationView}
                                    >
                                        <Text style={styles.panelButtonTitle}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </BottomSheet>
                        </KeyboardAvoidingView>
                        <Text style={styles.userBtnTxt}>Create Your Budget</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pageContainer}>
                    <View style={styles.container}>
                        <CustomListView
                            itemList={budgetInfo} />
                    </View>
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
        fontSize: 20,
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
    pageText: {
        fontSize: 20,
        color: '#333333',
    },
});

export default AddBudget;