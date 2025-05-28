// components/Button/Button.js
import React from 'react';
// Make sure this path is correct for your project structure
import { useClasses } from "src/Core/Util/Styles";
import styles from './Button.module.scss';

const Button = ({
    children,
    onClick,
    isDarkMode,
    type = 'button', // Default button type
    disabled = false,
    variant = 'primary',
    size = 'medium', // e.g., 'small', 'medium', 'large'
    className = '', // Allow custom classes to be passed
    ...props // Spread any other native button props
}) => {
    const classes = useClasses(styles);

    return <button
        className={classes("root", variant, size, { dark: isDarkMode, disabled }, className)}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>;
};

export default Button;