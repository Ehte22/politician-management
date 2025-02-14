import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, Snackbar, Avatar, Card, Appbar } from 'react-native-paper';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useSignOutMutation } from '../redux/apis/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { navigate, goBack } = useNavigation();
    const [signOut, { isSuccess, isLoading, isError, error }] = useSignOutMutation();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [user, setUser] = useState(null);
    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            firstName: yup.string().required("First Name is required"),
            lastName: yup.string().required("Last Name is required"),
            email: yup.string().email("Invalid email").required("Email is required"),
            phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone is required"),
        }),
        onSubmit: (values) => {
            console.log("Updated Profile:", values)
            setIsEditing(false);
        },
    });

    const removeAsyncData = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setSnackbarMessage("Logged out successfully!");
            setSnackbarVisible(true);
            setTimeout(() => navigate("Login"), 2000);
        } catch (error) {
            console.error("Error removing AsyncStorage data:", error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await AsyncStorage.getItem("user");
                if (data) setUser(JSON.parse(data));
            } catch (error) {
                console.error("No User Found", error);
            }
        };
        fetchUser();
    }, [])

    useEffect(() => {
        if (isSuccess) removeAsyncData();
        if (isError) {
            setSnackbarMessage(error?.data?.message || "An error occurred");
            setSnackbarVisible(true);
        }
    }, [isSuccess, isError, error]);

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={goBack} />
                <Appbar.Content title="Profile" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Avatar.Image size={100} source={{ uri: user?.profile || "https://via.placeholder.com/100" }} style={styles.avatar} />
                        {!isEditing ? (
                            <View style={styles.infoContainer}>
                                <Text variant="titleLarge" style={styles.name}>
                                    {user?.firstName || ""} {user?.lastName || ""}
                                </Text>
                                <Text variant="bodyMedium">Role: {user?.role || "N/A"}</Text>
                                <Text variant="bodyMedium">Email: {user?.email || "N/A"}</Text>
                                <Text variant="bodyMedium">Phone: {user?.phone || "N/A"}</Text>
                                <Text variant="bodyMedium" style={styles.status}>Status: {user?.status || "N/A"}</Text>
                            </View>
                        ) : (
                            <View style={styles.editContainer}>
                                <TextInput
                                    label="First Name"
                                    mode="outlined"
                                    style={styles.input}
                                    onChangeText={formik.handleChange("firstName")}
                                    onBlur={formik.handleBlur("firstName")}
                                    value={formik.values.firstName}
                                    error={formik.touched.firstName && !!formik.errors.firstName}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <Text style={styles.errorText}>{formik.errors.firstName}</Text>
                                )}
                                <TextInput
                                    label="Last Name"
                                    mode="outlined"
                                    style={styles.input}
                                    onChangeText={formik.handleChange("lastName")}
                                    onBlur={formik.handleBlur("lastName")}
                                    value={formik.values.lastName}
                                    error={formik.touched.lastName && !!formik.errors.lastName}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <Text style={styles.errorText}>{formik.errors.lastName}</Text>
                                )}
                                <TextInput
                                    label="Email"
                                    mode="outlined"
                                    keyboardType="email-address"
                                    style={styles.input}
                                    onChangeText={formik.handleChange("email")}
                                    onBlur={formik.handleBlur("email")}
                                    value={formik.values.email}
                                    error={formik.touched.email && !!formik.errors.email}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <Text style={styles.errorText}>{formik.errors.email}</Text>
                                )}
                                <TextInput
                                    label="Phone"
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    onChangeText={formik.handleChange("phone")}
                                    onBlur={formik.handleBlur("phone")}
                                    value={formik.values.phone}
                                    error={formik.touched.phone && !!formik.errors.phone}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <Text style={styles.errorText}>{formik.errors.phone}</Text>
                                )}
                            </View>
                        )}
                    </Card.Content>

                    <Card.Actions>
                        {isEditing ? (
                            <>
                                <Button mode="contained" onPress={formik.handleSubmit}>Save</Button>
                                <Button mode="text" onPress={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (
                            <Button mode="contained" onPress={() => setIsEditing(true)}>Edit</Button>
                        )}
                    </Card.Actions>
                </Card>
                <Button
                    mode="contained"
                    onPress={signOut}
                    style={styles.logoutButton}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </Button>
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', padding: 20, alignItems: 'center' },
    avatar: { alignSelf: 'center', marginBottom: 10 },
    infoContainer: { alignItems: 'center', marginBottom: 10 },
    name: { fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
    status: { marginTop: 5, fontStyle: 'italic' },
    editContainer: { width: '100%' },
    input: { marginVertical: 10 },
    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
    logoutButton: { marginTop: 20, width: '80%', backgroundColor: 'red' },
});

export default Profile;
