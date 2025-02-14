import { ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { Button, TextInput, Text, MD2Colors, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as yup from 'yup'

const Register = () => {
    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);
    const { navigate } = useNavigation()
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            phone: "",
            role: "",
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            firstName: yup.string().required("FirstName or Name is Required"),
            lastName: yup.string().required("LastName or Name is Required"),
            phone: yup.string().required("Phone or Name is Required"),
            role: yup.string().required("role or Mobile is Required"),
            email: yup.string().required("Email or Email is Required"),
            password: yup.string().required("Password is Required"),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values, "User Login Values");
            navigate('Home')
            resetForm();
        },
    });
    return (
        <View style={styles.backgroundContainer}>
            <Image
                style={styles.backgroundImage}
                source={{ uri: "https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg" }}
                resizeMode="cover" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center", }}>
                        <Text style={{ color: MD2Colors.blue400, fontSize: 25, fontWeight: "bold" }}>Sign Up</Text>
                    </View>
                    <TextInput
                        label="First Name"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={formik.handleChange("firstName")}
                        onBlur={formik.handleBlur("firstName")}
                        error={formik.touched.firstName && formik.errors.firstName}
                        value={formik.values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {formik.errors.firstName}
                        </Text>
                    )}
                    <TextInput
                        label="Last Name"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={formik.handleChange("lastName")}
                        onBlur={formik.handleBlur("lastName")}
                        error={formik.touched.lastName && formik.errors.lastName}
                        value={formik.values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {formik.errors.lastName}
                        </Text>
                    )}
                    <TextInput
                        label="Mobile Number"
                        mode="outlined"
                        keyboardType="phone-pad"
                        style={styles.input}
                        onChangeText={formik.handleChange("phone")}
                        onBlur={formik.handleBlur("phone")}
                        error={formik.touched.phone && formik.errors.phone}
                        value={formik.values.phone}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {formik.errors.phone}
                        </Text>
                    )}
                    <TextInput
                        label="Email"
                        mode="outlined"
                        keyboardType="email-address"
                        style={styles.input}
                        onChangeText={formik.handleChange("email")}
                        onBlur={formik.handleBlur("email")}
                        error={formik.touched.email && formik.errors.email}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {formik.errors.email}
                        </Text>
                    )}
                    <TextInput
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={formik.handleChange("password")}
                        onBlur={formik.handleBlur("password")}
                        error={formik.touched.password && formik.errors.password}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {formik.errors.password}
                        </Text>
                    )}
                    <List.Section title=" Choose Role">
                        <List.Accordion
                            title="Role"
                            left={props => <List.Icon {...props} icon="account" />}>
                            <List.Item onPress={() => formik.setFieldValue("role", "Booth Manager")} title="Booth Manager" />
                            <List.Item onPress={() => formik.setFieldValue("role", "Booth Worker")} title="Booth Worker" />
                            <List.Item onPress={() => formik.setFieldValue("role", "Office Admin")} title="Office Admin" />
                        </List.Accordion>
                    </List.Section>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={(e) => {
                            formik.setFieldTouched("firstName", true);
                            formik.setFieldTouched("lastName", true);
                            formik.setFieldTouched("phone", true);
                            formik.setFieldTouched("role", true);
                            formik.setFieldTouched("email", true);
                            formik.setFieldTouched("password", true);
                            if (
                                formik.touched.role &&
                                !formik.errors.role &&
                                formik.touched.phone &&
                                !formik.errors.phone &&
                                formik.touched.firstName &&
                                !formik.errors.firstName &&
                                formik.touched.lastName &&
                                !formik.errors.lastName &&
                                formik.touched.email &&
                                !formik.errors.email &&
                                formik.touched.password &&
                                !formik.errors.password
                            ) {
                                formik.handleSubmit();
                            }
                        }}
                        mode="contained" style={styles.registerButton}>
                        Register
                    </Button>
                    <Button onPress={e => navigate("Login")} mode="contained-tonal" style={styles.createAccountButton}>
                        Already Have an Account
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: '100%',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        marginVertical: 10,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
        width: '100%',
    },
    registerButton: {
        // backgroundColor: '#0D47A1',
    },
});

export default Register;


