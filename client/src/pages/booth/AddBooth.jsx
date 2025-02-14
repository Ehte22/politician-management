import { useEffect } from "react"
import useDynamicForm from "../../components/useDynamicForm"
import { customValidator } from "../../utils/validator"
import { toast } from "../../utils/toast"
import { useNavigate, useParams } from "react-router-dom"
import { useAddBoothMutation, useGetBoothByIdQuery, useUpdateBoothMutation } from "../../redux/apis/booth.api"

const fields = [
    {
        name: "name",
        label: "Booth Name",
        placeholder: "Enter Booth Name",
        type: "text",
        rules: { required: false, min: 2, max: 100 }
    },
    {
        name: "boothNumber",
        label: "Booth Number",
        placeholder: "Enter Booth Number",
        type: "text",
        rules: { required: true }
    },
    {
        name: "constituency",
        label: "Constituency",
        type: "select",
        options: [
            { label: "Select Constituency", value: "", disable: true },
            { label: "Aurangabad (Central)", value: "Aurangabad (Central)" },
            { label: "Aurangabad (East)", value: "Aurangabad (East)" },
            { label: "Aurangabad (West)", value: "Aurangabad (West)" },
            { label: "Sillod", value: "Sillod" },
            { label: "Kannad", value: "Kannad" },
            { label: "Pholambari", value: "Pholambari" },
            { label: "Paithan", value: "Paithan" },
            { label: "Gangapur", value: "Gangapur" },
            { label: "Vaijapur", value: "Vaijapur" },
        ],
        rules: { required: false }
    },
    {
        name: "capacity",
        label: "Capacity",
        placeholder: "Enter Capacity",
        type: "text",
        rules: { required: true }
    },
    {
        name: "location",
        label: "Location",
        placeholder: "Enter Location",
        type: "textarea",
        rules: { required: true, min: 2, max: 500 }
    },
]

const defaultValues = {
    name: "",
    boothNumber: "",
    constituency: "",
    capacity: "",
    location: ""
}

const AddBooth = () => {

    // Hooks
    const navigate = useNavigate()
    const { id } = useParams()

    // Queries and Mutations
    const [addBooth, { data: createData, error: errorData, isSuccess: createSuccess, isError: createError }] = useAddBoothMutation()
    const { data: boothData, error: getBoothErrorMessage, isError: getBoothError } = useGetBoothByIdQuery(id || "", {
        skip: !id
    })
    const [updateBooth, { data: updateMessage, error: updateErrorMessage, isSuccess: updateSuccess, isError: updateError }] = useUpdateBoothMutation()

    // Custom Validator
    const schema = customValidator(fields)

    // Submit Function
    const onSubmit = (data) => {

        if (id && boothData) {
            updateBooth({ id, boothData: data })
        } else {
            addBooth(data)
        }
    }

    // Dynamic Form
    const { renderSingleInput, handleSubmit, setValue, reset }
        = useDynamicForm({ schema, fields, onSubmit, defaultValues })

    useEffect(() => {
        if (id && boothData) {
            setValue("name", boothData.name)
            setValue("boothNumber", boothData.boothNumber.toString() || "")
            setValue("constituency", boothData.constituency)
            setValue("capacity", boothData.capacity.toString() || "")
            setValue("location", boothData.location)
        }
    }, [id, boothData])

    useEffect(() => {
        if (createSuccess) {
            toast.showSuccess(createData.message)
            reset()
            navigate("/booths")
        }
        if (updateSuccess) {
            toast.showSuccess(updateMessage)
        }

        if (createError) {
            toast.showError(errorData)
        }

        if (getBoothError) {
            toast.showError(getBoothErrorMessage)
        }

        if (updateError) {
            toast.showError(updateErrorMessage)
        }
    }, [createData, createSuccess, errorData, createError, getBoothError, getBoothErrorMessage, updateError, updateSuccess, updateMessage, updateErrorMessage])

    return <>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold text-gray-900">{id ? "Update Booth" : "Add Booth"}</h2>
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigate("/booths")}
                >
                    Back
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        {/* Clinic Name */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("name")}
                        </div>

                        {/* Booth Number */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("boothNumber")}
                        </div>

                        {/* Constituency */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("constituency")}
                        </div>

                        {/* Capacity */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("capacity")}
                        </div>

                        {/* Location */}
                        <div className="sm:col-span-3 xl:col-span-2">
                            {renderSingleInput("location")}
                        </div>


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
    </>
}

export default AddBooth

