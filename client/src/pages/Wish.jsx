import { useEffect, useState } from "react";
import useDynamicForm from "../components/useDynamicForm";
import { customValidator } from "../utils/validator";
import { toast } from "../utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateWishMutation, useGetWishByIdQuery, useScheduleWishMutation, useUpdateWishMutation } from "../redux/apis/wish.api";

const fields = [
    { name: "name", label: "name", type: "text", placeholder: "Enter Name", rules: { required: true } },
    { name: "date", label: "date", type: "date", placeholder: "Select Date", rules: {} },
    { name: "contact", label: "contact", type: "text", placeholder: "Enter Contact", rules: { required: true } },
    { name: "email", label: "email", type: "email", placeholder: "Enter Email", rules: { required: true } },



    {
        name: "type",
        label: "type",
        type: "select",
        className: "sm:col-span-6 md:col-span-4 xl:col-span-3",
        options: [
            { label: "Select Wish", value: "", disabled: true },
            { label: "Birthday", value: "Birthday" },
            { label: "Funeral", value: "Funeral" },
            { label: "Anniversary", value: "Anniversary" },
            { label: "Marriage ", value: "Marriage " },
            { label: "NewHouse", value: "NewHouse" },
            { label: "NewShop", value: "NewShop" },
            { label: "Schoo Admission", value: "SchoolAdmission" },
            { label: "Other", value: "Other" },

        ],
        rules: { required: true }
    },
    { name: "message", label: "message", type: "text", placeholder: "Enter Message", rules: {} },
    { name: "personalizedMessage", label: "personalizedMessage", type: "text", placeholder: "Enter Personalized Message", rules: {} },
    {
        name: "status",
        label: "Status",
        type: "select",
        className: "sm:col-span-6 md:col-span-4 xl:col-span-3",

        options: [
            { label: "Select Status", value: "", disabled: true },
            { label: "Scheduled", value: "Scheduled" },
            { label: "Sent", value: "Sent" },
        ],
        rules: {}
    },


    {
        name: "category",
        label: "category",
        type: "select",
        className: "sm:col-span-6 md:col-span-4 xl:col-span-3",
        options: [
            { label: "Select Category", value: "", disabled: true },
            { label: "Voter", value: "Voter" },
            { label: "PartyMember", value: "PartyMember" },
            { label: "Leader", value: "Leader" },
            { label: "Officer", value: "Officer" },
        ],
        rules: { required: true }
    },
];

const defaultValues = {
    name: "",
    date: "",
    contact: "",
    email: "",
    type: "",
    message: "Best Wishes!",
    personalizedMessage: "",
    status: "Scheduled",
    category: ""
};

const Wish = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [createWish, { data: createData, error: createError, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateWishMutation();
    const [scheduleWish, { data: scheduleData, error: scheduleError, isSuccess: isScheduleSuccess, isError: isScheduleError }] = useScheduleWishMutation();


    const { data: wishData, } = useGetWishByIdQuery(id || "", {

        skip: !id,
    })
    const [updateWish, { isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateWishMutation()

    const schema = customValidator(fields);

    const onSubmit = async (data) => {
        console.log(data);

        if (id && wishData) {
            updateWish({ updateId: id, ...data });
        } else {
            createWish(data)
        }
    };

    const { renderSingleInput, handleSubmit, reset, setValue } = useDynamicForm({ schema, fields, onSubmit, defaultValues });


    useEffect(() => {
        if (id && wishData) {
            setValue("name", wishData.name)
            setValue("date", wishData.date)
            setValue("contact", wishData.contact)
            setValue("email", wishData.email)
            setValue("type", wishData.type)
            setValue("message", wishData.message)
            setValue("personalizedMessage", wishData.personalizedMessage)
            setValue("status", wishData.status)
            setValue("category", wishData.category)

        }
    }, [wishData]);



    useEffect(() => {
        if (isCreateSuccess) {
            toast.showSuccess("Wish Created Successfully!");
        }

    }, [isCreateSuccess,]);
    useEffect(() => {
        if (isUpdateSuccess) {
            toast.showSuccess("Wish Update Successfully!");
        }

    }, [isUpdateSuccess,]);
    useEffect(() => {

        if (isCreateError) {
            toast.showError(createError);
        }
    }, [isCreateError]);
    useEffect(() => {

        if (isUpdateError) {
            toast.showError(UpdateError);
        }
    }, [isUpdateError]);

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold text-gray-900">{id ? "Update Wish" : "Add Wish"}</h2>
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigate("/wish-table")}
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("name")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("date")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("contact")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("email")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("type")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("message")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("personalizedMessage")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("status")}</div>
                        <div className="sm:col-span-3 xl:col-span-2">{renderSingleInput("category")}</div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-3 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button onClick={() => reset()} type="button" className="rounded-md cursor-pointer bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>




    );
};

export default Wish;