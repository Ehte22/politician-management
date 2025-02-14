import { StyleSheet, Text, View, FlatList, RefreshControl, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Appbar, Button, MD2Colors, Searchbar, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useLazyGetAllVisitorsQuery } from '../redux/apis/visitorApi';

const Home = () => {
    const { navigate, goBack } = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [GetAllVisitors, { data: visitors, isSuccess, isLoading, isError, error }] = useLazyGetAllVisitorsQuery();

    useEffect(() => {
        GetAllVisitors();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            setSnackbarMessage('Visitors loaded successfully');
            setSnackbarVisible(true);
        }
        if (isError) {
            setSnackbarMessage(error?.message || 'Failed to load visitors');
            setSnackbarVisible(true);
        }
    }, [isSuccess, isError]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => goBack()} />
                <Appbar.Content title="Visitor's" />
                <Appbar.Action icon="magnify" onPress={() => setShowSearch(!showSearch)} />
            </Appbar.Header>

            {showSearch && (
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            )}

            <Text style={styles.header}>Visitor's List</Text>

            <FlatList
                data={visitors}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.info}>📞 {item.contact}</Text>
                        <Text style={styles.info}>📧 {item.email}</Text>
                        <Button mode='contained-tonal' onPress={() => navigate("VisitorDetails", { visitor: item })}>
                            View Details
                        </Button>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={GetAllVisitors} />}
                onEndReachedThreshold={0.1}
                onEndReached={GetAllVisitors}
                ListEmptyComponent={<Text style={styles.noVisitorsText}>No visitors available</Text>}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={9000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD2Colors.white,
        padding: 20,
        width: Dimensions.get('screen').width, // ✅ Adjusted width
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: MD2Colors.black,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    card: {
        backgroundColor: MD2Colors.grey600,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000", // ✅ Fixed shadow color
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 2,
    },
    searchBar: {
        marginBottom: 10,
    },
    noVisitorsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: MD2Colors.grey500,
        textAlign: 'center',
        marginTop: 20,
    }
});
