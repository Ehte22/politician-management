import { z } from 'zod';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customValidator } from '../../utils/validator';
import useDynamicForm from '../../components/useDynamicForm';
import { useCreateVisitorMutation, useGetVisitorByIdQuery, useUpdateVisitorMutation } from '../../redux/apis/visitor.api';
import { ImagePreviewContext } from '../../App';





const defaultValues = {
    name: "",
    contact: "",
    email: "",
    checkIn: "",
    checkOut: "",
    referredBy: "",
    visitorCategory: "Citizen",
    problemType: "Personal",
    problemDescription: "",
    problemSeverity: "Low",
    problemDocuments: "",
    problemLocation: "",
    followUpRequired: "",
    followUpDate: "",
    followUpNotes: "",
    constituency: "",
    mlaAssigned: "",
    politicalAffiliation: "",
    visitorFeedback: "",
    priority: "Low",
    labels: "",
    visitOutcome: "Satisfied",
    visitRating: "",
    isFirstVisit: "",
    status: "Pending",
    purpose: "",
    address: "",
    gender: "",
    age: "",
    occupation: "",
    patientType: "",
    timeSlot: {
        from: "",
        to: "",
    },
    payment: {
        method: "cash",
        amount: "",
        status: "unpaid",
        patientType: "new",
    },
    button: ""
}


const AddVisitor = () => {
    const [addvisitor, { isSuccess: addsuccess, isError: addIsError, error: adderror }] = useCreateVisitorMutation()
    const { id } = useParams()
    console.log(id);

    const { data: vistor } = useGetVisitorByIdQuery(id)

    const [updateVisitor, { isSuccess: updateSuccess, isError: updateIserror, error: Updateerror }] = useUpdateVisitorMutation()
    const navigate = useNavigate()
    const { setPreviewImages } = useContext(ImagePreviewContext)

    const onSubmit = (values) => {
        const fd = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === "new") {
                console.log([key], "KEY");
                console.log(values.problemDocuments, "VVV");
                const files = Array.isArray(values.problemDocuments)
                    ? values.problemDocuments
                    : values.problemDocuments ? Array.from(values.problemDocuments) : [];
                files.forEach((item) => {
                    fd.append(key, item);
                });
            }
            else if (key === "DR") {
                values[key].forEach((item, index) => {
                    Object.keys(item).forEach((subKey) => {
                        fd.append(`${key}[${index}][${subKey}], item[subKey]`);
                    })
                })
            } else if (key === "problemDocuments") {
                Object.keys(values.problemDocuments).forEach((item) => {
                    fd.append(key, values.problemDocuments[item])
                })
            } else {
                fd.append(key, values[key]);
            }
        })
        if (id && vistor) {
            updateVisitor({ visitorData: fd, id })
        } else {
            addvisitor(fd)
        }

    };



    useEffect(() => {
        if (addsuccess) {
            navigate("/visitor")
        }
    }, [addsuccess]);

    useEffect(() => {
        if (updateSuccess) {
            navigate("/visitor")
        }
    }, [updateSuccess]);


    const fields = [

        {
            name: "name",
            label: "name",
            type: "text",
            placeholder: "Enter your name",
            rules: { required: false, min: 2, max: 16 }
        },
        {
            name: "contact",
            label: "contact",
            type: "text",
            placeholder: "Enter your contact",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "occupation",
            label: "occupation",
            type: "text",
            placeholder: "Enter your occupation",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "address",
            label: "address",
            type: "text",
            placeholder: "Enter your address",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "gender",
            label: "gender",
            type: "select",
            options: [
                { name: "gender", label: "gender", disabled: true },
                { label: "Male", name: "Male", value: "Male" },
                { label: "Female", name: "Female", value: "Female" },
                { label: "Other", name: "Other", value: "Other" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "age",
            label: "age",
            type: "text",
            placeholder: "Enter your age",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "email",
            label: "email",
            type: "text",
            placeholder: "Enter your email",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "purpose",
            label: "purpose",
            type: "text",
            placeholder: "Enter your purpose",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "problemLocation",
            label: "problemLocation",
            type: "text",
            placeholder: "Enter your problemLocation",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "referredBy",
            label: "referredBy",
            type: "text",
            placeholder: "Enter your referredBy",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "visitorFeedback",
            label: "visitorFeedback",
            type: "text",
            placeholder: "Enter your visitorFeedback",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "problemDescription",
            label: "problemDescription",
            type: "text",
            placeholder: "Enter your problemDescription",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "constituency",
            label: "constituency",
            type: "text",
            placeholder: "Enter your constituency",
            className: "form-control",
            rules: { required: false, }
        },
        {
            name: "politicalAffiliation",
            label: "politicalAffiliation",
            type: "text",
            placeholder: "Enter your politicalAffiliation",
            className: "form-control",
            rules: { required: false, }
        },
        // {
        //     name: "idProof",
        //     label: "idProof",
        //     type: "file",
        //     placeholder: "Enter your idProof",
        //     className: "form-control",
        //     rules: { required: false, file: true, maxSize: 10 }
        // },
        {
            name: "problemDocuments",
            label: "problemDocuments",
            type: "file",
            placeholder: "Enter your problemDocuments",
            className: "form-control",
            rules: { required: false, file: true, maxSize: 10 }
        },
        {
            name: "visitorCategory",
            label: "visitorCategory",
            type: "select",
            options: [
                { name: "visitorCategory", label: "visitorCategory", disabled: true },
                { label: "Citizen", name: "Citizen", value: "Citizen" },
                { label: "Party Worker", name: "Party Worker", value: "Party Worker" },
                { label: "Government Official", name: "Government Official", value: "Government Official" },
                { label: "Media", name: "Media", value: "Media" },
                { label: "NGO", name: "NGO", value: "NGO" },
                { label: "Other", name: "Other", value: "Other" }
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "problemSeverity",
            label: "problemSeverity",
            type: "select",
            options: [
                { name: "problemSeverity", label: "problemSeverity", disabled: true },
                { label: "Low", name: "Low", value: "Low" },
                { label: "Medium", name: "Medium", value: "Medium" },
                { label: "High", name: "High", value: "High" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "priority",
            label: "priority",
            type: "select",
            options: [
                { name: "priority", label: "priority", disabled: true },
                { label: "Low", name: "Low", value: "Low" },
                { label: "Medium", name: "Medium", value: "Medium" },
                { label: "High", name: "High", value: "High" },
                { label: "Urgent", name: "Urgent", value: "Urgent" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "visitOutcome",
            label: "visitOutcome",
            type: "select",
            options: [
                { name: "visitOutcome", label: "visitOutcome", disabled: true },
                { label: "Satisfied", name: "Satisfied", value: "Satisfied" },
                { label: "Partially Satisfied", name: "Partially Satisfied", value: "Partially Satisfied" },
                { label: "Not Satisfied", name: "Not Satisfied", value: "Not Satisfied" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "visitRating",
            label: "visitRating",
            type: "select",
            options: [
                { name: "visitRating", label: "visitRating", disabled: true },
                { label: "1", name: "1", value: "1" },
                { label: "2", name: "2", value: "2" },
                { label: "3", name: "3", value: "3" },
                { label: "4", name: "4", value: "4" },
                { label: "5", name: "5", value: "4" },

            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "status",
            label: "status",
            type: "select",
            options: [
                { name: "status", label: "status", disabled: true },
                { label: "Pending", name: "Pending", value: "Pending" },
                { label: "Under Review", name: "Under Review", value: "Under Review" },
                { label: "In Progress", name: "In Progress", value: "In Progress" },
                { label: "Solved", name: "Solved", value: "Solved" },
                { label: "Rejected", name: "Rejected", value: "Rejected" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },
        {
            name: "problemType",
            label: "problemType",
            type: "select",
            options: [
                { name: "problemType", label: "problemType", disabled: true },
                { label: "Personal", name: "Personal", value: "Personal" },
                { label: "Community", name: "Community", value: "Community" },
                { label: "Legal", name: "Legal", value: "Legal" },
                { label: "Health", name: "Health", value: "Health" },
                { label: "Other", name: "Other", value: "Other" },
            ],
            className: "sm:col-span-3 xl:col-span-2 mt-8 sm:mt-0",
            rules: { required: false }
        },


    ];


    const schema = customValidator(fields)




    const { renderSingleInput, handleSubmit, setValue, errors, reset } = useDynamicForm({ schema, fields, onSubmit, defaultValues })


    useEffect(() => {
        if (id && vistor) {
            setValue("address", vistor.address)
            setValue("age", vistor.age)
            setValue("contact", vistor.contact)
            setValue("email", vistor.email)
            setValue("name", vistor.name)
            setValue("gender", vistor.gender)
            setValue("problemType", vistor.problemType)
            setValue("purpose", vistor.purpose)
            setValue("referredBy", vistor.referredBy)
            setValue("status", vistor.status)
            setValue("visitOutcome", vistor.visitOutcome)
            // setValue("visitRating", vistor.visitRating)
            setValue("visitorCategory", vistor.visitorCategory)
            setValue("visitorFeedback", vistor.visitorFeedback)
            setValue("problemSeverity", vistor.problemSeverity)
            setValue("priority", vistor.priority)
            setValue("occupation", vistor.occupation)
            setValue("labels", vistor.labels)
            setValue("isFirstVisit", vistor.isFirstVisit)
            setValue("followUpRequired", vistor.followUpRequired)
            setValue("checkOut", vistor.checkOut)
            setValue("checkIn", vistor.checkIn)
            setValue("politicalAffiliation", vistor.politicalAffiliation)
            setValue("constituency", vistor.constituency)
            setValue("problemDescription", vistor.problemDescription)
            setValue("problemLocation", vistor.problemLocation)

            // setValue("idProof", vistor.idProof)

            if (vistor.problemDocuments) {
                setValue("problemDocuments", vistor.problemDocuments)
                setPreviewImages([vistor.problemDocuments])
            }
        }


    }, [vistor])

    return <>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold text-gray-900">{id ? "Update Visitor" : "Add Visitor"}</h2>
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigate("/visitor")}
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('name')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('contact')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('gender')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('age')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('address')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('problemLocation')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('problemDescription')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('email')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('occupation')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('visitorCategory')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('status')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('problemType')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('problemSeverity')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('purpose')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('visitOutcome')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('visitorFeedback')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('priority')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('constituency')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('politicalAffiliation')}
                        </div>
                        {/* <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('idProof')}
                        </div> */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('problemDocuments')}
                        </div>
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput('referredBy')}
                        </div>
                    </div>
                </div>

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
            </form>
        </div>
    </>
}

export default AddVisitor