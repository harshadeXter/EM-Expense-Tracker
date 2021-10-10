import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';
import FormButton from './components/FormButton';
import auth from '@react-native-firebase/auth';
import { AuthContext, AuthProvider } from './navigation/AuthProvider';
import AuthStack from './navigation/AuthStack';
import AddBudget from './screens/AddBudget';
import AddExpenseItem from './screens/AddExpenseItem';
import { NetworkProvider, NetworkConsumer } from 'react-native-offline';
import FormAlert from './components/FormAlert';

function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen welcome</Text>
      <FormButton buttonTitle='Logout'
        onPress={() => logout()} />
    </View>
  );
}

function test() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'EditProfileScreen') {
            iconName = focused ? 'settings-outline' : 'hammer-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle-outline' : 'person-outline';
          } else if (route.name === 'Budgets') {
            iconName = focused ? 'logo-usd' : 'logo-bitcoin';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'pricetags-outline' : 'pricetags';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true
      })}
    >
      {/* <Tab.Screen name="Login" component={LoginScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Expenses" component={AddExpenseItem} options={{ tabBarBadge: 3 }} />
      <Tab.Screen name="Budgets" component={AddBudget} />
      <Tab.Screen name="Update Profile" component={EditProfileScreen} />
    </Tab.Navigator>
  );
}

const Routes = () => {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? TabNavigation() : <AuthStack />}
    </NavigationContainer>
  );
};

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

function App() {
  //const [showCustomSuccessAlertBox, setShowCustomSuccessAlertBox] = useState(false);
  //setShowCustomSuccessAlertBox(true);
  return (
    <NetworkProvider shouldPing={true} pingInterval={100}>
      <NetworkConsumer>
        {({ isConnected }) =>
          isConnected ? (
            <Providers />
          ) : (
            <FormAlert
              displayMode={'failed'}
              displayContent={'Check your Internet Connectivity!!'}
              visibility={true}
              dismissAlert={true}
            />
          )
        }
      </NetworkConsumer>
    </NetworkProvider>
  );
}

export default App;