import { useEffect, useState } from "react";
import useDynamicForm from "../components/useDynamicForm";
import { customValidator } from "../utils/validator";
import { toast } from "../utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateWishMutation, useGetWishByIdQuery, useScheduleWishMutation, useUpdateWishMutation } from "../redux/apis/wish.api";

const fields = [
    { name: "name", label: "name", type: "text", placeholder: "Enter Name", rules: { required: true } },
    { name: "date", label: "date", type: "date", placeholder: "Select Date", },
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

    },
    { name: "message", label: "message", type: "text", placeholder: "Enter Message", defaultValue: "Best Wishes!" },
    { name: "personalizedMessage", label: "personalizedMessage", type: "text", placeholder: "Enter Personalized Message" },
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
        defaultValue: "Scheduled",
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
    console.log("fieldss", fields);




    const onSubmit = async (data) => {
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
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-5 text-gray-900">Create a Wish</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("name")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("date")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("contact")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("email")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("type")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("message")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("personalizedMessage")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("status")}</div>
                        <div className="sm:col-span-6 xl:col-span-4">{renderSingleInput("category")}</div>
                    </div>
                </div>
                <div>

                    <div className="flex items-center justify-end gap-x-3 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button onClick={() => reset()} type="button" className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save
                        </button>
                    </div>


                </div>
            </form>
        </div>


    );
};

export default Wish;