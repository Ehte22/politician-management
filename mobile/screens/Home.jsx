import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { visitors } from '../utils/dummyData'
import { Button, MD2Colors } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'



const Home = () => {
    const { navigate } = useNavigation()
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Visitor's List</Text>
            <FlatList
                data={visitors}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.info}>📞 {item.contact}</Text>
                        <Text style={styles.info}>📧 {item.email}</Text>
                        <Button onPress={() => navigate("VisitorDetails", { visitor: item })}> View Details</Button>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD2Colors.white,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: MD2Colors.black,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    card: {
        backgroundColor: MD2Colors.grey600,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android Shadow
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // White Text
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        color: '#ddd', // Light Gray Text
        marginBottom: 2,
    },
    idProof: {
        fontSize: 14,
        color: '#ffcc00', // Yellow Highlight for ID Proof
        marginTop: 5,
        fontWeight: 'bold',
    }
});
