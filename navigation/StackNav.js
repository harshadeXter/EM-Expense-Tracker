import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

const StackNav = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        </Stack.Navigator>
    );
}

export { StackNav };