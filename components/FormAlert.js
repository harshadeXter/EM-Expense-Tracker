import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FormAlert = ({ displayMode, displayContent, visibility, dismissAlert }) => {
    return (
        <View>
            <Modal
                visible={visibility}
                animationType={'fade'}
                transparent={true}
                animationType="slide">
                <View style={styles.container}>
                    <View style={styles.inner}>
                        <View style={{ alignItems: 'center', margin: 10 }}>
                            {displayMode == 'success' ? (
                                <>
                                    <Ionicons
                                        name="checkmark-done-circle"
                                        color={'green'}
                                        size={80}
                                    />
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="cancel" color={'red'} size={80} />
                                </>
                            )}
                            <Text style={{ fontSize: 18, marginTop: 5 }}>{displayContent}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.alertButton}
                            activeOpacity={0.8}
                            onPress={() => dismissAlert(false)}>
                            <Text style={{ color: 'white', margin: 15 }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: {
        alignItems: 'center',
        backgroundColor: 'white',
        height: 200,
        width: '90%',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 7,
        elevation: 10,
    },
    alertButton: {
        width: '95%',
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'blue',
        borderColor: '#ddd',
        borderBottomWidth: 0,
        borderRadius: 5,
        bottom: 0,
        marginBottom: 10,
    }
});

export default FormAlert;
