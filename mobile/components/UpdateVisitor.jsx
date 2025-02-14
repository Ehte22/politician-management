import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Appbar, Snackbar, Avatar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUpdateVisitorMutation } from "../redux/apis/visitorApi";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    contact: Yup.string().matches(/^\d{10}$/, "Enter a valid contact number").required("Contact is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    age: Yup.number().min(1, "Invalid age").required("Age is required"),
    occupation: Yup.string().required("Occupation is required"),
    purpose: Yup.string().required("Purpose is required"),
    status: Yup.string().required("Status is required"),
});

const UpdateVisitor = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { visitor } = route.params;

    const [updateVisitor, { isSuccess, isError, error, isLoading }] = useUpdateVisitorMutation();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [image, setImage] = useState(visitor.problemDocuments);

    const pickImage = async (setFieldValue) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setFieldValue("problemDocuments", result.assets[0].uri);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setSnackbarMessage("Visitor updated successfully")
            setSnackbarVisible(true);
            setTimeout(() => navigation.goBack(), 2000);
        }
    }, [isSuccess])
    useEffect(() => {
        if (isError) {
            setSnackbarMessage("Visitor updated successfully" || error?.message)
            setSnackbarVisible(true);
            setTimeout(() => navigation.goBack(), 2000);
        }
    }, [isError])

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Update Visitor" />
            </Appbar.Header>

            <View style={styles.container}>
                <Formik
                    initialValues={{
                        name: visitor.name || "",
                        contact: visitor.contact || "",
                        email: visitor.email || "",
                        age: visitor.age ? visitor.age.toString() : "",
                        occupation: visitor.occupation || "",
                        purpose: visitor.purpose || "",
                        status: visitor.status || "",
                        problemDocuments: visitor.problemDocuments || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        try {
                            const fd = new FormData();
                            for (const key in values) {
                                if (key === "problemDocuments" && values[key]) {
                                    fd.append(key, {
                                        uri: values[key],
                                        type: "image/jpeg",
                                        name: "upload.jpg",
                                    });
                                } else {
                                    fd.append(key, values[key]);
                                }
                            }

                            await updateVisitor({ id: visitor._id, visitorData: fd }).unwrap();
                        } catch (error) {
                            setSnackbarMessage(error.message || "Failed to update visitor");
                            setSnackbarVisible(true);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            <TextInput label="Name" value={values.name} onChangeText={handleChange("name")} onBlur={handleBlur("name")} style={styles.input} error={touched.name && errors.name} />
                            <TextInput label="Contact" value={values.contact} keyboardType="phone-pad" onChangeText={handleChange("contact")} onBlur={handleBlur("contact")} style={styles.input} error={touched.contact && errors.contact} />
                            <TextInput label="Email" value={values.email} keyboardType="email-address" onChangeText={handleChange("email")} onBlur={handleBlur("email")} style={styles.input} error={touched.email && errors.email} />
                            <TextInput label="Age" value={values.age} keyboardType="numeric" onChangeText={handleChange("age")} onBlur={handleBlur("age")} style={styles.input} error={touched.age && errors.age} />
                            <TextInput label="Occupation" value={values.occupation} onChangeText={handleChange("occupation")} onBlur={handleBlur("occupation")} style={styles.input} error={touched.occupation && errors.occupation} />
                            <TextInput label="Purpose" value={values.purpose} onChangeText={handleChange("purpose")} onBlur={handleBlur("purpose")} style={styles.input} error={touched.purpose && errors.purpose} />
                            <TextInput label="Status" value={values.status} onChangeText={handleChange("status")} onBlur={handleBlur("status")} style={styles.input} error={touched.status && errors.status} />

                            <View style={styles.imageContainer}>
                                {image ? (
                                    <Avatar.Image size={100} source={{ uri: image }} />
                                ) : (
                                    <Avatar.Icon size={100} icon="image" />
                                )}
                                <Button mode="contained" onPress={() => pickImage(setFieldValue)} style={styles.uploadButton}>
                                    Select Image
                                </Button>
                            </View>

                            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                                Update Visitor
                            </Button>
                        </View>
                    )}
                </Formik>
            </View>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
                {snackbarMessage}
            </Snackbar>
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
                {snackbarMessage}
            </Snackbar>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 20 },
    uploadButton: { marginTop: 10 },
    imageContainer: { alignItems: "center", marginBottom: 20 },
});

export default UpdateVisitor;
