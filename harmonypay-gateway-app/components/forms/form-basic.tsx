import { Alert } from "../utils/alert";
import { useForm } from "../../lib/hooks/useForm";

function FormSettings() {
    // defining the initial state for the form
    const initialState = {
        email: "",
        password: "",
    };

    // getting the event handlers from our custom hook
    const { onChange, onSubmit, values } = useForm(
        formSettingsCallback,
        initialState
    );

    // a submit function that will execute upon form submission
    async function formSettingsCallback() {
        // send "values" to database
        console.log(values);
        Alert('success', 'Settings saved...', 'Settings saved with success into .env file..');
    }

    return (
        // don't mind this ugly form :P
        <form onSubmit={onSubmit}>
        <div>
            <input
                name='email'
                id='email'
                type='email'
                placeholder='Email'
                onChange={onChange}
                required
                />

            <input
                name='password'
                id='password'
                type='password'
                placeholder='Password'
                onChange={onChange}
                required
                />
            <button type='submit'>Login</button>
        </div>
        </form>
    );
}

export default FormSettings;