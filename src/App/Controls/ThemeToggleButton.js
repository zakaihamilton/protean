import React from 'react';
import { useClasses } from "src/Core/Util/Styles";
import styles from './ThemeToggleButton.module.scss';
import Button from "src/UI/Widgets/Button";
import Container from "src/UI/Util/Container";
import Resources from "src/Core/UI/Resources";
import Tooltip from "src/UI/Widgets/Tooltip";

const resources = {
    TOGGLE_THEME: {
        eng: "Toggle Theme",
        heb: "החלף ערכת נושא"
    },
    DARK_THEME: {
        eng: "Dark Theme",
        heb: "ערכת נושא כהה"
    },
    LIGHT_THEME: {
        eng: "Light Theme",
        heb: "ערכת נושא בהירה"
    },
    SWITCH_TO_DARK: {
        eng: "Switch to dark mode",
        heb: "החלף לערכת נושא כהה"
    },
    SWITCH_TO_LIGHT: {
        eng: "Switch to light mode",
        heb: "החלף לערכת נושא בהירה"
    }
};

const SunIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const ThemeToggleButton = ({ isDarkMode, onClick }) => {
    const classes = useClasses(styles);
    const lookup = Resources.useLookup();

    return <Resources resources={resources} lookup={lookup}>
        <Container>
            <Button
                variant="themeToggle"
                size="medium"
                isDarkMode={isDarkMode}
                onClick={onClick}
                type="button"
            >
                <div className={classes("iconWrapper")}>
                    <SunIcon
                        className={`${classes("sunIcon")} ${isDarkMode ? classes("iconVisible") : classes("iconHiddenOutgoing")
                            }`}
                    />
                    <MoonIcon
                        className={`${classes("moonIcon")} ${isDarkMode ? classes("iconHiddenIncoming") : classes("iconVisible")
                            }`}
                    />
                </div>
                <span className={classes("text")}>
                    {isDarkMode ? lookup?.DARK_THEME : lookup?.LIGHT_THEME}
                </span>
            </Button>
            <Tooltip title={isDarkMode ? lookup?.SWITCH_TO_LIGHT : lookup?.SWITCH_TO_DARK} />
        </Container>
    </Resources>;
};

export default ThemeToggleButton;