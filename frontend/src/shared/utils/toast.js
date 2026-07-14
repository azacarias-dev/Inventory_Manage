import { toast } from 'react-hot-toast';

const baseStyle = {
    borderRadius: "10px",
    fontWeight: 600,
    fontFamily: 'inherit',
    fontSize: "1rem",
    padding: "16px 24px",
    boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.8)"

};

export const showSuccess = (message) =>
    toast.success(message, {
        style: {
            ...baseStyle,
            background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
            color: "#fff",
            border: "2px solid #22c55e",
        },
        iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
        },
    });

export const showError = (message) =>
    toast.error(message, {
        style: {
            ...baseStyle,
            background: "linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)",
            color: "#fff",
            border: "2px solid #ef4444",
        },
        iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
        },
    });

export const showInfo = (message) =>
    toast(message, {
        style: {
            ...baseStyle,
            background: "linear-gradient(90deg, #0ea5e9 0%, #0369a1 100%)",
            color: "#fff",
            border: "2px solid #0ea5e9",
        },
        iconTheme: {
            primary: "#0ea5e9",
            secondary: "#fff",
        },
    });