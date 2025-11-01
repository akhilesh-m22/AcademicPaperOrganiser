import { useState } from "react";
import { Link } from "react-router-dom";

function RegistrationScreen() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        institutionName: "",
        role: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    const [submitError, setSubmitError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePassword = (password) => {
        const minLength = 8;

        if (password.length === 0) {
            return "Password is empty, please set a password having minimum 8 characters";
        }

        if (password.length < minLength) {
            return "Password too small, must be minimum 8 characters";
        }

        return "";
    };

    const validateForm = () => {
        const newErrors = {};

        const passwordError = validatePassword(formData.password);

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match!";
        }

        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        setSubmitError("");

        try {
            const response = await fetch("url");

            if (!response.ok) {
                throw new Error("Registration failed: " + response.status);
            }

            const data = await response.json();

            console.log("Registration successful!", data);
        } catch (error) {
            console.error("Registration failed!", error);
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
        >
            <h2>User Registration</h2>

            {submitError && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="userName">User Name:</label>

                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.username}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="password">password:</label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />

                    {errors.password && (
                        <div style={{ color: "red" }}>{errors.password}</div>
                    )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="password">Confirm password:</label>

                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />

                    {errors.confirmPassword && (
                        <div style={{ color: "red" }}>
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: isSubmitting ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "15px", textAlign: "center" }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default RegistrationScreen;
