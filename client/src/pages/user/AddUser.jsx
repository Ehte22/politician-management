import useDynamicForm from "../../components/useDynamicForm"
import { customValidator } from "../../utils/validator"
import { useSendOTPMutation, useVerifyOTPMutation } from "../../redux/apis/auth.api"
import { useContext, useEffect, useState } from "react"
import { toast } from "../../utils/toast"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
// import { useGetClinicsQuery } from "../../redux/apis/clinic.api"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "../../redux/apis/user.api"
import { ImagePreviewContext } from "../../App"
import Loader from "../../components/Loader"
import { useGetBoothsQuery } from "../../redux/apis/booth.api"
import { useSelector } from "react-redux"

const fields = [
    {
        name: "firstName",
        label: "First Name",
        placeholder: "Enter First Name",
        type: "text",
        rules: { required: true, min: 2, max: 16 }
    },
    {
        name: "lastName",
        label: "Last Name",
        placeholder: "Enter Last Name",
        type: "text",
        rules: { required: true, min: 2, max: 16 }
    },
    {
        name: "email",
        label: "Email Address",
        placeholder: "Enter Email Address",
        type: "text",
        rules: { required: true, email: true }
    },
    {
        name: "phone",
        label: "Phone Number",
        placeholder: "Enter Phone Number",
        type: "text",
        rules: { required: true, pattern: /^[6-9]\d{9}$/ }
    },
    {
        name: "profile",
        label: "Profile",
        type: "file",
        rules: { required: false, file: true }
    },

    // {
    //     name: "role",
    //     label: "Role",
    //     type: "select",
    //     options: [
    //         { label: "Select Role", value: "", disabled: true },
    //         { label: "Booth Manager", value: "Booth Manager" },
    //         { label: "Booth Worker", value: "Booth Worker" }
    //     ],
    //     rules: { required: true }
    // },


]

const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    profile: "",
    boothId: ""
}

const AddUser = () => {

    const { user } = useSelector(state => state.auth)

    // hooks
    const navigate = useNavigate()
    const { id } = useParams()
    const { setPreviewImages } = useContext(ImagePreviewContext)

    // States
    const [OTP, setOTP] = useState("")
    const [updatedFields, setUpdatedFields] = useState([...fields]);

    // Queries and Mutations
    const [createUser, { data: registerData, isLoading: createUserLoading, error: registerErrorMessage, isSuccess: registerSuccess, isError: registerError }] = useCreateUserMutation()
    const [updateUser, { data: updateUserMessage, isLoading: updateUserLoading, error: updateUserErrorMessage, isSuccess: updateUserSuccess, isError: updateUserError }] = useUpdateUserMutation()
    const [sendOtp, { data: otpSendMessage, isLoading: isSendOtpLoading, error: otpSendErrorMessage, isSuccess: otpSendSuccess, isError: otpSendError }] = useSendOTPMutation()
    const [verifyOtp, { data: otpVerifyMessage, isLoading: isVerifyOtpLoading, error: otpVerifyErrorMessage, isSuccess: otpVerifySuccess, isError: otpVerifyError }] = useVerifyOTPMutation()
    const { data: boothData, isSuccess: getAllBoothSuccess } = useGetBoothsQuery({ isFetchAll: true })
    const { data: userData } = useGetUserByIdQuery(id || "", {
        skip: !id
    })


    // Function for send OTP
    const sendOTP = () => {
        const email = getValues("email")
        if (email) {
            sendOtp({ username: email })
        }
    }

    // Function for Verify OTP
    const verifyOTP = () => {
        const email = getValues("email")
        if (email && OTP) {
            verifyOtp({ username: email, otp: OTP })
        }
    }

    // Custom Validator
    const schema = customValidator(updatedFields)

    // Submit Function
    const onSubmit = (data) => {
        const booth = boothData.result.find(item => item.name === data.boothId)
        const updatedData = { ...data, boothId: booth._id }

        const formData = new FormData()

        Object.keys(updatedData).forEach(key => {
            if (key === "profile" && typeof updatedData[key] == "object") {
                Object.keys(updatedData.profile).forEach(item => {
                    formData.append(key, updatedData.profile[item])
                })
            } else {
                formData.append(key, updatedData[key])
            }
        })

        if (id && userData) {
            const email = getValues("email")

            updateUser({ userData: formData, id })
            // if (email === userData.email) {
            // } else {
            //     toast.showError("Please verify your email address")
            // }

        } else {
            createUser(formData)
            // if (otpVerifySuccess) {
            // } else {
            //     toast.showError("Please verify your email address")
            // }
        }
    }

    // Dynamic Form Component
    const { renderSingleInput, handleSubmit, getValues, disableField, setValue, watch, reset } =
        useDynamicForm({ schema, fields: updatedFields, onSubmit, defaultValues })


    useEffect(() => {
        if (getAllBoothSuccess && boothData) {
            const booths = boothData.result.map((item) => ({
                label: item.name,
                value: item.name
            }));

            setUpdatedFields([
                ...fields,
                {
                    name: "role",
                    label: "Role",
                    type: "select",
                    options: user?.role === "Booth Manager"
                        ? [
                            { label: "Select Role", value: "", disabled: true },
                            { label: "Booth Worker", value: "Booth Worker" }
                        ]
                        : [
                            { label: "Select Role", value: "", disabled: true },
                            { label: "Booth Manager", value: "Booth Manager" },
                            { label: "Booth Worker", value: "Booth Worker" }
                        ],
                    rules: { required: true }
                },
                {
                    name: "boothId",
                    label: "Booth",
                    type: "searchSelect",
                    options: [
                        { label: "Select Booth", value: "", disabled: true },
                        ...booths
                    ],
                    rules: { required: true }
                }
            ]);
        } else {
            setUpdatedFields(fields.filter((field) => field.name !== "boothId"));
        }
    }, [boothData, getAllBoothSuccess, fields, user]);


    useEffect(() => {
        if (otpSendSuccess) {
            toast.showSuccess(otpSendMessage)
        }

        if (otpVerifySuccess) {
            toast.showSuccess(otpVerifyMessage)
            disableField('email', true)
        }

        if (registerSuccess) {
            toast.showSuccess(registerData.message)
            reset()
        }

        if (updateUserSuccess) {
            toast.showSuccess(updateUserMessage)
        }

    }, [otpSendMessage, otpSendSuccess, otpVerifyMessage, otpVerifySuccess, registerData, registerSuccess, updateUserMessage, updateUserSuccess])

    useEffect(() => {
        if (otpSendError) {
            toast.showError(otpSendErrorMessage)
        }

        if (otpVerifyError) {
            toast.showError(otpVerifyErrorMessage)
        }

        if (registerError) {
            toast.showError(registerErrorMessage)
        }

        if (updateUserError) {
            toast.showError(updateUserErrorMessage)
        }
    }, [otpSendErrorMessage, otpSendError, otpVerifyErrorMessage, otpVerifyError, registerErrorMessage, registerError, updateUserError, updateUserErrorMessage])

    useEffect(() => {
        if (id && userData) {
            setValue("firstName", userData.firstName || "")
            setValue("lastName", userData.lastName || "")
            setValue("email", userData.email || "")
            setValue("phone", userData.phone?.toString() || "")
            setValue("role", userData.role || "")

            if (userData?.boothId) {
                const booth = boothData?.result.find(item => item._id === userData.boothId)

                if (booth) {
                    setValue("boothId", booth.name || "")
                }
            }


            if (userData.profile) {
                setValue("profile", userData.profile)
                setPreviewImages([userData.profile])
            }
        }
    }, [id, userData, boothData])

    return <>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold text-gray-900">{id ? "Update User" : "Add User"}</h2>
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigate("/users")}
                >
                    Back
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        {/* First Name */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("firstName")}
                        </div>

                        {/* Last Name */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("lastName")}
                        </div>

                        {/* Phone Number */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("phone")}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-6 xl:col-span-4">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-6 md:col-span-3">
                                    {renderSingleInput("email")}
                                </div>

                                {
                                    otpVerifySuccess && !registerSuccess && <CheckCircleIcon
                                        aria-hidden="true"
                                        className="mt-8 size-8 text-teal-400" />
                                }

                                <div className="sm:col-span-6 md:col-span-3">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        {otpSendSuccess && !otpVerifySuccess &&
                                            <div className="sm:col-span-4 md:col-span-3">
                                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                                    OTP
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter OTP"
                                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base  text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                        onChange={(e) => setOTP(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        }

                                        {!otpVerifySuccess &&
                                            <div className={`sm:col-span-2 md:col-span-3 ${otpSendSuccess ? "sm:mt-8" : "md:mt-8"}`}>
                                                {
                                                    isSendOtpLoading || isVerifyOtpLoading
                                                        ? <Loader />
                                                        : <button
                                                            type="button"
                                                            onClick={otpSendSuccess ? verifyOTP : sendOTP}
                                                            className="rounded-md bg-teal-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                                        >
                                                            Verify {otpSendSuccess ? "OTP" : "Email"}
                                                        </button>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("role")}
                        </div>

                        {/* booth */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("boothId")}
                        </div>

                        {/* Profile */}
                        <div className="sm:col-span-6">
                            {renderSingleInput("profile")}
                        </div>
                    </div>
                </div>


                <div className="flex items-center justify-end gap-x-3 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    {
                        createUserLoading || updateUserLoading
                            ? <Loader />
                            : <>
                                <button onClick={() => reset()} type="button" className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </>
                    }
                </div>
            </form >
        </div >
    </>

}


export default AddUser