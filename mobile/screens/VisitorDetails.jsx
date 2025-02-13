
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Avatar, List, Appbar, Searchbar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

const VisitorDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { visitor } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    return (
        <ScrollView>
            <View style={{ position: "relative" }}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Visitor Details" />
                    <Appbar.Action icon="magnify" onPress={() => setShowSearch(!showSearch)} />
                </Appbar.Header>

            </View>
            <View style={styles.container}>
                {showSearch && (
                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                )}
                <Card style={styles.card}>
                    <Card.Title
                        title={visitor.name}
                        subtitle={visitor.occupation}
                        left={(props) => <Avatar.Icon {...props} icon="account" style={styles.avatar} />}
                    />
                    <Card.Content>
                        <List.Section>
                            <List.Item title={visitor.email} description="Email" left={(props) => <List.Icon {...props} icon="email" />} />
                            <List.Item title={visitor.contact} description="Contact" left={(props) => <List.Icon {...props} icon="phone" />} />
                            <List.Item title={visitor.address} description="Address" left={(props) => <List.Icon {...props} icon="home" />} />
                            <List.Item title={visitor.gender} description="Gender" left={(props) => <List.Icon {...props} icon="gender-male-female" />} />
                            <List.Item title={`${visitor.age} years`} description="Age" left={(props) => <List.Icon {...props} icon="calendar" />} />
                            <List.Item title={visitor.idProof} description="ID Proof" left={(props) => <List.Icon {...props} icon="card-account-details" />} />
                        </List.Section>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
    },
    card: {
        borderRadius: 12,
        elevation: 6,
        backgroundColor: "#fff",
        paddingVertical: 10,
    },
    avatar: {
        backgroundColor: "#6200ee",
    },
    searchBar: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
});

export default VisitorDetails;