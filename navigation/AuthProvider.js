import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password);
                    } catch (e) {
                        console.log('login error: ', e);
                    }
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password)
                            .then(() => {
                                firestore().collection('users').doc(auth().currentUser.uid)
                                    .set({
                                        fname: '',
                                        lname: '',
                                        email: email,
                                        createdAt: firestore.Timestamp.fromDate(new Date()),
                                        userImg: null
                                    }).catch(error => {
                                        console.log('error while adding user details to users table in firestore. ', error);
                                    })
                            })
                    } catch (e) {
                        console.log('signing in error: ', e);
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (e) {
                        console.log('logging out errors: ', e);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};