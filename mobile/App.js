import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { PaperProvider } from 'react-native-paper'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import { Provider } from 'react-redux'
import reduxStore from './redux/store'
import VisitorDetails from './screens/VisitorDetails'
import BottomTab from './components/BottomTab'
import Profile from './components/Profile'
import UpdateVisitor from './components/UpdateVisitor'

const App = () => {
  const Stack = createStackNavigator()
  return <>
    <Provider store={reduxStore}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name="VisitorDetails" component={VisitorDetails} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='BottomTab' component={BottomTab} />
            <Stack.Screen name='UpdateVisitor' component={UpdateVisitor} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  </>
}

export default App

const styles = StyleSheet.create({})