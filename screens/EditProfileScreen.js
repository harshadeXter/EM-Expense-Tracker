import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomSheet } from 'react-native-btr';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

function EditProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userData, setUserData] = useState(null);

    const [visible, setVisible] = useState(false);
    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const getUser = async () => {
        const currentUser = await firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data());
                }
            })
    };

    const uploadImage = async () => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                100,
            );
        });

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            setUploading(false);
            setImage(null);
            return url;

        } catch (e) {
            console.log(e);
            return null;
        }

    };

    const handleUpdate = async () => {
        let imgUrl = await uploadImage();

        if (imgUrl == null && userData.userImg) {
            imgUrl = userData.userImg;
        }
        firestore().collection('users').doc(user.uid).update({
            fname: userData.fname,
            lname: userData.lname,
            phone: userData.phone,
            email: userData.email,
            userImg: imgUrl,
        })
            .then(() => {
                console.log('user updated !!!!!');
                Alert.alert('User Profile Updated!!',
                    'Your profile updated successfully.');
            })
    };

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.6
        }).then(image => {
            console.log(image);
            setImage(image.path);
            toggleBottomNavigationView();
        });
    }

    const chooseFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            console.log(image);
            setImage(image.path);
            toggleBottomNavigationView();
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }, styles.container}>
            <View style={{ margin: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={toggleBottomNavigationView}>
                        <BottomSheet
                            visible={visible}
                            onBackButtonPress={toggleBottomNavigationView}
                            onBackdropPress={toggleBottomNavigationView}
                        >
                            <View style={styles.panel}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.panelTitle}>Upload Photo</Text>
                                    <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.panelButton}
                                    onPress={takePhotoFromCamera}
                                >
                                    <Text style={styles.panelButtonTitle}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.panelButton}
                                    onPress={chooseFromGallery}
                                >
                                    <Text style={styles.panelButtonTitle}>Choose From Library</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.panelButton}
                                    onPress={toggleBottomNavigationView}
                                >
                                    <Text style={styles.panelButtonTitle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </BottomSheet>

                        <View style={{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ImageBackground
                                source={{
                                    uri: image
                                        ? image
                                        : userData
                                            ? userData.userImg ||
                                            'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                                            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                                }}
                                style={{ height: 100, width: 100 }}
                                imageStyle={{ borderRadius: 15 }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Icon name="camera" size={25} color="#000000"
                                        style={{
                                            opacity: 0.6,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 0,
                                            borderColor: "#000000",
                                            borderRadius: 10,
                                        }} />
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" size={20} />
                        <TextInput
                            placeholder='First Name'
                            placeholderTextColor='#666666'
                            style={styles.textInput}
                            value={userData ? userData.fname : ''}
                            onChangeText={(txt) => setUserData({ ...userData, fname: txt })}
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" size={20} />
                        <TextInput
                            placeholder='Last Name'
                            placeholderTextColor='#666666'
                            style={styles.textInput}
                            value={userData ? userData.lname : ''}
                            onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="phone" size={20} />
                        <TextInput
                            placeholder='Mobile'
                            placeholderTextColor='#666666'
                            keyboardType="number-pad"
                            style={styles.textInput}
                            value={userData ? userData.phone : ''}
                            onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="envelope-o" size={20} />
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor='#666666'
                            keyboardType="email-address"
                            style={styles.textInput}
                            value={userData ? userData.email : ''}
                            editable={false}
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.commandButton}
                    onPress={handleUpdate}>
                    <Text style={styles.panelButtonTitle}>Update</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        padding: 13,
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
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});

export default EditProfileScreen;