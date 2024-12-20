import React from 'react';

function Register() {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <label>Username: <input type="text" /></label><br />
                <label>Email: <input type="email" /></label><br />
                <label>Password: <input type="password" /></label><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
