// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Avatar, Text, Card, Button } from 'react-native-paper';

// const Profile = () => {
//     const user = {
//         firstName: "John",
//         lastName: "Doe",
//         email: "johndoe@example.com",
//         phone: 9876543210,
//         profile: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         role: "Booth Manager",
//         status: "active",
//     };

//     return (
//         <View style={styles.container}>
//             <Card style={styles.card}>
//                 <Card.Content>
//                     <Avatar.Image size={100} source={{ uri: user.profile }} style={styles.avatar} />
//                     <Text variant="titleLarge" style={styles.name}>{user.firstName} {user.lastName}</Text>
//                     <Text variant="bodyMedium">Role: {user.role}</Text>
//                     <Text variant="bodyMedium">Email: {user.email}</Text>
//                     <Text variant="bodyMedium">Phone: {user.phone}</Text>
//                     <Text variant="bodyMedium" style={styles.status}>Status: {user.status}</Text>
//                 </Card.Content>
//                 <Card.Actions>
//                     <Button mode="contained" onPress={() => console.log('Edit Profile')}>Edit</Button>
//                 </Card.Actions>
//             </Card>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     card: {
//         width: '100%',
//         padding: 20,
//         alignItems: 'center',
//     },
//     avatar: {
//         alignSelf: 'center',
//         marginBottom: 10,
//     },
//     name: {
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 5,
//     },
//     status: {
//         marginTop: 5,
//         fontStyle: 'italic',
//     },
// });

// export default Profile;



















import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import { Button, TextInput, Text, MD2Colors, Avatar, Card } from 'react-native-paper';
import { useFormik } from 'formik';
import * as yup from 'yup';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    let user = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "9876543210",
        profile: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        role: "Booth Manager",
        status: "active",
    };

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        },
        validationSchema: yup.object({
            firstName: yup.string().required("First Name is required"),
            lastName: yup.string().required("Last Name is required"),
            email: yup.string().email("Invalid email").required("Email is required"),
            phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone is required"),
        }),
        onSubmit: (values) => {
            console.log("Updated Profile:", values);
            setIsEditing(false);
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Avatar.Image size={100} source={{ uri: user.profile }} style={styles.avatar} />
                    {!isEditing ? (
                        <View style={styles.infoContainer}>
                            <Text variant="titleLarge" style={styles.name}>{user.firstName} {user.lastName}</Text>
                            <Text variant="bodyMedium">Role: {user.role}</Text>
                            <Text variant="bodyMedium">Email: {user.email}</Text>
                            <Text variant="bodyMedium">Phone: {user.phone}</Text>
                            <Text variant="bodyMedium" style={styles.status}>Status: {user.status}</Text>
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
                                error={formik.touched.firstName && formik.errors.firstName}
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
                                error={formik.touched.lastName && formik.errors.lastName}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <Text style={styles.errorText}>{formik.errors.lastName}</Text>
                            )}
                            <TextInput
                                label="Email"
                                mode="outlined"
                                keyboardType='email-address'
                                style={styles.input}
                                onChangeText={formik.handleChange("email")}
                                onBlur={formik.handleBlur("email")}
                                value={formik.values.email}
                                error={formik.touched.email && formik.errors.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <Text style={styles.errorText}>{formik.errors.email}</Text>
                            )}
                            <TextInput
                                label="Phone"
                                mode="outlined"
                                keyboardType='phone-pad'
                                style={styles.input}
                                onChangeText={formik.handleChange("phone")}
                                onBlur={formik.handleBlur("phone")}
                                value={formik.values.phone}
                                error={formik.touched.phone && formik.errors.phone}
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    status: {
        marginTop: 5,
        fontStyle: 'italic',
    },
    editContainer: {
        width: '100%',
    },
    input: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default Profile;