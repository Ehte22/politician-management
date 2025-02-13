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

const App = () => {
  const Stack = createStackNavigator()
  return <>
    <Provider store={reduxStore}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='Login' component={Login} />
            <Stack.Screen options={{ headerShown: false }} name='Register' component={Register} />
            <Stack.Screen options={{ headerShown: false }} name="VisitorDetails" component={VisitorDetails} />
            <Stack.Screen options={{ headerShown: true }} name='Home' component={Home} />
            <Stack.Screen options={{ headerShown: true }} name='Profile' component={Profile} />
            <Stack.Screen options={{ headerShown: true, title: false, }} name='BottomTab' component={BottomTab} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  </>
}

export default App

const styles = StyleSheet.create({})