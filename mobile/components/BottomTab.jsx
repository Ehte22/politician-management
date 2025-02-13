import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import Home from '../screens/Home';
import { BottomNavigation } from 'react-native-paper';
import Profile from './Profile';

const BottomTab = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Visitor', title: 'Visitor', focusedIcon: 'account-supervisor', unfocusedIcon: 'account-supervisor-outline' },
        { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
        // { key: 'recents', title: 'Recents', focusedIcon: 'history' },
        // { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        Visitor: Home,
        profile: Profile,
        // recents: RecentsRoute,
        // notifications: NotificationsRoute,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}

export default BottomTab

const styles = StyleSheet.create({})