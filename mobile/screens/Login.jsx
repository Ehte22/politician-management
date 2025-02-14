import { ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { Button, TextInput, Text, MD2Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignInMutation } from '../redux/apis/authApi';

const Login = () => {
    const { navigate } = useNavigation();
    const [signIn, { data, error, isLoading }] = useSignInMutation()
    useEffect(() => {
        if (data?.result?.token) {
            AsyncStorage.setItem('token', data.result.token)
            navigate('Home');
        }
        if (error) {
            console.log("Login Error:", error);
        }
    }, [data, error]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is Required"),
            password: yup.string().min(6, "Password must be at least 6 characters").required("Password is Required"),
        }),
        onSubmit: async (values) => {
            try {
                navigate('Home')
                // await signIn(values).unwrap();
            } catch (err) {
                console.error("Login Failed:", err);
            }
        },
    });

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
                        error={formik.touched.email && formik.errors.email}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text style={{ color: "red", marginTop: 10 }}>{formik.errors.email}</Text>
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
                        <Text style={{ color: "red", marginTop: 10 }}>{formik.errors.password}</Text>
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
                    <Button mode='contained' onPress={e => navigate('BottomTab')}>Home</Button>
                    <Button onPress={() => navigate("Register")} mode="contained-tonal" style={styles.createAccountButton}>
                        Create New Account
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
});

export default Login;
