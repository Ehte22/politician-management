import { ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, TextInput, Text, Snackbar, MD2Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignInMutation } from '../redux/apis/authApi';
import { setUser } from '../redux/slices/auth.slice';

const Login = () => {
    const { navigate } = useNavigation();
    const [signIn, { data, error, isError, isLoading, isSuccess }] = useSignInMutation();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is Required"),
            password: yup.string().required("Password is Required"),
        }),
        onSubmit: async (values) => {
            try {
                await signIn(values).unwrap();
            } catch (err) {
                console.error("Login Failed:", err);
            }
        },
    });
    useEffect(() => {
        AsyncStorage.getItem("user")
            .then((data) => { data ? navigate("BottomTab") : "" })
            .catch(() => console.log("No User Found")
            )
    }, [data, error])
    useEffect(() => {
        if (isSuccess) {
            if (data?.result) {
                AsyncStorage.setItem("user", JSON.stringify(data.result))
                    .then((user) => dispatch(setUser(JSON.parse(user))))
            }
            setSnackbarMessage(`Welcome, ${data.result.firstName} ${data.result.lastName} (${data.result.role})!`)
            setSnackbarVisible(true);
            setTimeout(() => navigate("BottomTab"), 2000)
        }
        if (isError) {
            setSnackbarMessage(error?.data?.message || "Login Failed!")
            setSnackbarVisible(true)
        }
    }, [isSuccess, isError])
    return (
        <View style={styles.backgroundContainer}>
            <Image
                style={styles.backgroundImage}
                source={{ uri: "https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg" }}
                resizeMode="cover"
            />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: MD2Colors.blue400, fontSize: 25, fontWeight: "bold" }}>Sign In</Text>
                    </View>
                    <TextInput
                        label="Email"
                        mode="outlined"
                        keyboardType='email-address'
                        style={styles.input}
                        onChangeText={formik.handleChange("email")}
                        onBlur={formik.handleBlur("email")}
                        error={formik.touched.email && !!formik.errors.email}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text style={styles.errorText}>{formik.errors.email}</Text>
                    )}
                    <TextInput
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={formik.handleChange("password")}
                        onBlur={formik.handleBlur("password")}
                        error={formik.touched.password && !!formik.errors.password}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <Text style={styles.errorText}>{formik.errors.password}</Text>
                    )}

                    <Button mode="text" onPress={() => navigate('ForgotPassword')} style={styles.forgotPassword}>
                        Forgot Password?
                    </Button>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={formik.handleSubmit}
                        mode="contained"
                        style={styles.loginButton}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </Button>
                    <Button onPress={() => navigate("Register")} mode="contained-tonal" style={styles.createAccountButton}>
                        Create New Account
                    </Button>
                </View>
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        marginVertical: 10,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginVertical: 5,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    loginButton: {
        marginBottom: 10,
    },
    createAccountButton: {
        borderColor: '#0D47A1',
    },
    errorText: {
        color: "red",
        marginTop: 5,
    },
});

export default Login;
