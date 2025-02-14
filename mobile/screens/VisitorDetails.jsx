import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions } from "react-native";
import { Text, Card, List, Appbar, Searchbar, Snackbar, Button, MD2Colors, TextInput } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDeleteVisitorMutation, useLazyGetVisitorByIdQuery } from "../redux/apis/visitorApi";

const VisitorDetails = () => {
    const route = useRoute();
    const { navigate, goBack } = useNavigation()
    const { visitor } = route.params
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [deleteVisitor, { isSuccess: isSuccessDelete, isLoading: isLoadingDelete, isError: isErrorDelete, error: errorDelete }] = useDeleteVisitorMutation()
    const [getVisitorDetails, { data, isSuccess, isError, isLoading, error }] = useLazyGetVisitorByIdQuery();

    useEffect(() => {
        getVisitorDetails(visitor._id)
    }, [])

    useEffect(() => {
        if (isSuccess) {
            setSnackbarMessage("Visitor details loaded successfully");
            setSnackbarVisible(true);
        }
        if (isError) {
            setSnackbarMessage(error?.message || "Failed to fetch visitor details");
            setSnackbarVisible(true);
        }
        if (isSuccessDelete) {
            setSnackbarMessage("Visitor Deleted successfully");
            setSnackbarVisible(true)
            goBack()
        }
        if (isErrorDelete) {
            setSnackbarMessage(errorDelete?.message || "Failed to Delete visitor details")
            setSnackbarVisible(true)
        }
    }, [isSuccess, isError, isSuccessDelete, isErrorDelete]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={goBack} />
                <Appbar.Content title="Visitor Details" />
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

            <ScrollView style={styles.scrollContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
                ) : data ? (
                    <Card style={styles.card}>
                        <Card.Title
                            title={data.name}
                            subtitle={data.occupation}
                            right={() => (
                                <Image style={styles.image} source={{ uri: data.problemDocuments }} />
                            )}
                        />
                        <Card.Content>
                            <View style={styles.detailsContainer}>
                                <View style={styles.column}>
                                    <List.Item title={data.email || "N/A"} description="Email" left={() => <List.Icon icon="email" />} />
                                    <List.Item title={data.contact || "N/A"} description="Contact" left={() => <List.Icon icon="phone" />} />
                                    <List.Item title={data.address || "N/A"} description="Address" left={() => <List.Icon icon="home" />} />
                                    <List.Item title={data.gender || "N/A"} description="Gender" left={() => <List.Icon icon="gender-male-female" />} />
                                    <List.Item title={data.age ? `${data.age} years` : "N/A"} description="Age" left={() => <List.Icon icon="calendar" />} />
                                </View>
                                <View style={styles.column}>
                                    <List.Item title={data.purpose || "N/A"} description="Purpose" left={() => <List.Icon icon="briefcase" />} />
                                    <List.Item title={data.checkIn || "N/A"} description="Check-in" left={() => <List.Icon icon="clock" />} />
                                    <List.Item title={data.checkOut || "N/A"} description="Check-out" left={() => <List.Icon icon="clock-outline" />} />
                                    <List.Item title={data.visitorCategory || "N/A"} description="Category" left={() => <List.Icon icon="account-group" />} />
                                    <List.Item title={data.status || "N/A"} description="Status" left={() => <List.Icon icon="information" />} />
                                </View>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button buttonColor={MD2Colors.red400} mode="contained" onPress={() => deleteVisitor(data._id)}>
                                {isLoadingDelete ? <ActivityIndicator size="large" color="#6200ee" style={styles.loader} /> : "Delete"}
                            </Button>
                            <Button mode="contained" onPress={() => navigate("UpdateVisitor", { visitor: data })}>
                                Update
                            </Button>
                        </Card.Actions>
                    </Card>
                ) : (
                    <Text style={styles.noDataText}>No visitor data found</Text>
                )}
                {isErrorDelete && <Text>From Delete Error:={JSON.stringify(errorDelete, null, 2)}</Text>}
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}>
                {snackbarMessage}
            </Snackbar>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    scrollContainer: {
        flex: 1,
    },
    searchBar: {
        margin: 10,
    },
    loader: {
        marginTop: 20,
    },
    card: {
        margin: 15,
        borderRadius: 12,
        elevation: 4,
        backgroundColor: "#fff",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        margin: 10,
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    noDataText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        color: "#888",
    },
    snackbar: {
        position: "absolute",
        bottom: 0,
        width: Dimensions.get('screen').width - 20,
    },
});

export default VisitorDetails;
