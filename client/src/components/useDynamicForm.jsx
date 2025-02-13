import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Inputs from "./Inputs";
import Selects from "./Selects";
import Radios from "./Radios";
import Checkboxes from "./Checkboxes";
import InputFile from "./InputFile";
import Textarea from "./Textarea";
import SearchSelect from "./SearchSelect";

const getErrorMessage = (
    fieldName,
    index,
    subFieldName,
    errors
) => {
    const fieldErrors = errors[fieldName];
    if (fieldErrors && Array.isArray(fieldErrors)) {
        const error = fieldErrors[index];
        if (error) {
            return error[subFieldName]?.message || null;
        }
    }
    return null;
};

const useDynamicForm = ({
    schema,
    fields,
    onSubmit,
    defaultValues
}) => {

    const [disabledFields, setDisabledFields] = useState([]);

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
        reset,
        getValues
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    const formArray = fields.find((item) => item.type === "formArray")

    const { fields: arrayFields, append, remove } = useFieldArray({
        control,
        name: formArray?.name
    })

    const disableField = (fieldName, isDisabled) => {
        setDisabledFields((prev) => {
            if (isDisabled) {
                return [...prev, fieldName];  // Add to disabled fields
            } else {
                return prev.filter((field) => field !== fieldName);  // Remove from disabled fields
            }
        });
    };

    // Function to render a single input field
    const renderInput = (field) => {

        return <>
            <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm/6 font-medium text-gray-900">
                    {field.label}
                </label>
                <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => {
                        switch (field.type) {
                            case "text":
                            case "password":
                            case "email":
                            case "number":
                            case "color":
                            case "range":
                            case "date":
                            case "time":
                                return <>
                                    <Inputs
                                        controllerField={controllerField}
                                        field={field}
                                        errors={errors[field.name]?.message?.toString()}
                                        disabled={disabledFields.includes(field.name)} />
                                </>

                            case "select":
                                return <>
                                    <Selects controllerField={controllerField} field={field} />
                                </>

                            case "searchSelect":
                                return <>
                                    <SearchSelect controllerField={controllerField} field={field} />
                                </>

                            case "radio":
                                return <>
                                    <Radios controllerField={controllerField} field={field} />
                                </>

                            case "checkbox":
                                return <>
                                    <Checkboxes controllerField={controllerField} field={field} />
                                </>

                            case "file":
                                return <>
                                    <InputFile
                                        controllerField={controllerField}
                                        field={field}
                                        setValue={setValue}
                                    />
                                </>

                            case "textarea":
                                return <>
                                    <Textarea controllerField={controllerField} field={field} />
                                </>

                            case "formGroup":
                                return <>
                                    <div key={field.name}>
                                        <h4 className="mb-2 font-semibold">{field.displayName}</h4>
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            {field.formGroup &&
                                                Object.entries(field.formGroup).map(([_, subField]) => {
                                                    const fieldName = `${field.name}.${subField.name}`;

                                                    return (
                                                        <div key={fieldName} className={`${subField.className}`}>
                                                            <label htmlFor={subField.name} className="block text-sm/6 font-medium text-gray-900">
                                                                {subField.label}
                                                            </label>
                                                            <Controller
                                                                key={fieldName}
                                                                name={fieldName}
                                                                control={control}
                                                                rules={subField.rules}
                                                                render={({ field: controllerField }) => {
                                                                    switch (subField.type) {
                                                                        case "text":
                                                                        case "password":
                                                                        case "email":
                                                                        case "number":
                                                                        case "color":
                                                                        case "range":
                                                                        case "date":
                                                                        case "time":
                                                                            return <>
                                                                                <Inputs
                                                                                    controllerField={controllerField}
                                                                                    field={subField}
                                                                                    errors={
                                                                                        errors[field.name] &&
                                                                                        errors[field.name][subField.name]?.message && (
                                                                                            <span className="my-2 text-sm text-red-600">
                                                                                                {errors[field.name][subField.name]?.message}
                                                                                            </span>
                                                                                        )
                                                                                    } />
                                                                            </>

                                                                        case "select":
                                                                            return <>
                                                                                <Selects controllerField={controllerField} field={subField} />
                                                                            </>

                                                                        case "searchSelect":
                                                                            return <>
                                                                                <SearchSelect controllerField={controllerField} field={subField} />
                                                                            </>

                                                                        case "radio":
                                                                            return <>
                                                                                <Radios controllerField={controllerField} field={subField} />
                                                                            </>

                                                                        case "checkbox":
                                                                            return <>
                                                                                <Checkboxes controllerField={controllerField} field={subField} />
                                                                            </>

                                                                        case "file":
                                                                            return <>
                                                                                <InputFile
                                                                                    controllerField={controllerField}
                                                                                    field={subField}
                                                                                    setValue={setValue}
                                                                                />
                                                                            </>

                                                                        case "textarea":
                                                                            return <>
                                                                                <Textarea controllerField={controllerField} field={subField} />
                                                                            </>
                                                                        default:
                                                                            return <></>;
                                                                    }
                                                                }}
                                                            />
                                                            {errors[field.name] &&
                                                                errors[field.name][subField.name]?.message && (
                                                                    <span className="my-2 text-sm text-red-600">
                                                                        {errors[field.name][subField.name]?.message}
                                                                    </span>
                                                                )}

                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </>

                            case "formArray":
                                return <>
                                    <div key={field.name}>
                                        {arrayFields.map((item, index) => (
                                            <div key={item.id} className={`${field.className}`}>
                                                <div className={`grid grid-cols-1 gap-x-6 sm:grid-cols-12`}>
                                                    {field.formArray?.map((subField) => {

                                                        const fieldName = `${field.name}[${index}].${subField.name}`;

                                                        return (
                                                            <div
                                                                key={`${fieldName}-${subField.name}`}
                                                                className={`my-2 ${subField.className}`}

                                                            >
                                                                <label htmlFor={subField.name} className="block text-sm/6 font-medium text-gray-900">
                                                                    {subField.label}
                                                                </label>
                                                                <Controller
                                                                    key={fieldName}
                                                                    name={fieldName}
                                                                    control={control}
                                                                    rules={subField.rules}
                                                                    render={({ field: controllerField }) => {
                                                                        switch (subField.type) {
                                                                            case "text":
                                                                            case "password":
                                                                            case "email":
                                                                            case "number":
                                                                            case "color":
                                                                            case "range":
                                                                            case "date":
                                                                            case "time":
                                                                                return <>
                                                                                    <Inputs
                                                                                        controllerField={controllerField}
                                                                                        field={subField}
                                                                                        errors={(getErrorMessage(field.name, index, subField.name, errors)) && (
                                                                                            <span className="my-2 text-sm text-red-600">
                                                                                                {getErrorMessage(field.name, index, subField.name, errors)}
                                                                                            </span>
                                                                                        )}
                                                                                    />
                                                                                </>

                                                                            case "select":
                                                                                return <>
                                                                                    <Selects controllerField={controllerField} field={subField} />
                                                                                </>

                                                                            case "searchSelect":
                                                                                return <>
                                                                                    <SearchSelect controllerField={controllerField} field={subField} />
                                                                                </>

                                                                            case "radio":
                                                                                return <>
                                                                                    <Radios controllerField={controllerField} field={subField} />
                                                                                </>

                                                                            case "checkbox":
                                                                                return <>
                                                                                    <Checkboxes controllerField={controllerField} field={subField} />
                                                                                </>

                                                                            case "file":
                                                                                return <>
                                                                                    <InputFile
                                                                                        controllerField={controllerField}
                                                                                        field={subField}
                                                                                        setValue={setValue}
                                                                                    />
                                                                                </>

                                                                            case "textarea":
                                                                                return <>
                                                                                    <Textarea controllerField={controllerField} field={subField} />
                                                                                </>

                                                                            default:
                                                                                return <></>
                                                                        }
                                                                    }}
                                                                />
                                                                {(getErrorMessage(field.name, index, subField.name, errors)) && (
                                                                    <span className="mt-y text-sm text-red-600">
                                                                        {getErrorMessage(field.name, index, subField.name, errors)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    {arrayFields.length > 1 &&
                                                        <button
                                                            onClick={() => remove(index)}
                                                            type='button' className='bg-red-500 rounded-sm w-8 h-8 mt-3 flex items-center justify-center font-bold'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-white">
                                                                <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                                            </svg>

                                                        </button>
                                                    }
                                                    {(arrayFields.length - 1) === index &&
                                                        <button
                                                            onClick={() => {
                                                                const form = arrayFields.map((item) => item);
                                                                append(form[0])

                                                            }}
                                                            type='button' className='bg-teal-600 rounded-sm w-8 h-8 mt-3 flex items-center justify-center font-bold'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-white">
                                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                                            </svg>

                                                        </button>
                                                    }

                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </>

                            case "submit":
                                return (
                                    <button
                                        type="submit"
                                        className={field.className}
                                    >
                                        {field.displayName}
                                    </button>
                                );
                            default:
                                return <></>;
                        }
                    }}
                />
                <div>
                    {errors[field.name]?.message && (
                        <p className="my-2 text-sm text-red-600">
                            {errors[field.name]?.message?.toString()}
                        </p>
                    )}
                </div>
            </div >
        </>
    };

    // Function to render the full form
    const renderFullForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    {fields.map((field) => <div key={field.name}>{renderInput(field)}</div>)}
                </div>
            </form>
        );
    };

    // Function to render a single input
    const renderSingleInput = (fieldName) => {
        const field = fields.find((f) => f.name === fieldName);

        if (!field) return null;
        return renderInput(field);
    };


    return {
        renderFullForm,
        renderSingleInput,
        handleSubmit,
        errors,
        watch,
        reset,
        control,
        append,
        remove,
        getValues,
        setValue,
        disableField
    };
};

export default useDynamicForm;