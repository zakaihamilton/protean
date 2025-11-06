import React from 'react';
import { useClasses } from "src/Core/Util/Styles";
import styles from './ThemeToggleButton.module.scss';
import Button from "src/UI/Widgets/Button";
import Container from "src/UI/Util/Container";
import Resources from "src/Core/UI/Resources";
import Tooltip from "src/UI/Widgets/Tooltip";
import resources from './ThemeToggleButton.res';
import { MoonIcon, SunIcon } from './ThemeToggleButton.icons';

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
                        className={`${classes("sunIcon")} ${isDarkMode ? classes("iconHiddenOutgoing") : classes("iconVisible")
                            }`}
                    />
                    <MoonIcon
                        className={`${classes("moonIcon")} ${isDarkMode ? classes("iconVisible") : classes("iconHiddenIncoming")
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