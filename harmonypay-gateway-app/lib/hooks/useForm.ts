import React, { useState } from "react";

// useForm functional component
export const useForm = (callback: any, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    // onChange
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: 
    event.target.value });
    };

    // onSubmit
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await callback(event); // triggering the callback
        //event.target.reset();
    };

    // return values
    return {
        onChange,
        onSubmit,
        values,
    };

}