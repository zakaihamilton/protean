'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import styles from './Login.module.scss';
import Screen from "src/UI/Screen";
import { FaUserLock } from "react-icons/fa";
import { ManagerUser } from "src/Manager/User";
import { createState } from "src/Core/Base/State";
import { useClasses } from "src/Core/Util/Styles";
import Resources from "src/Core/UI/Resources";

const resources = {
    TITLE: {
        eng: "Login",
        heb: "התחברות"
    },
    USER_NOT_FOUND: {
        eng: "User not found",
        heb: "משתמש לא נמצא"
    },
    INCORRECT_PASSWORD: {
        eng: "Incorrect password",
        heb: "סיסמה שגויה"
    },
    PASSWORD_TOO_SHORT: {
        eng: "Password too short",
        heb: "הסיסמה קצרה מדי"
    },
    USER_ID: {
        eng: "User ID",
        heb: "מזהה משתמש"
    },
    PASSWORD: {
        eng: "Password",
        heb: "סיסמה"
    },
    LOGIN: {
        eng: "Login",
        heb: "התחבר"
    },
    LOGOUT: {
        eng: "Logout",
        heb: "התנתק"
    },
    CHANGE_PASSWORD: {
        eng: "Change Password",
        heb: "שנה סיסמה"
    },
    ENTER_USER_ID: {
        eng: "Enter User ID",
        heb: "הזן מזהה משתמש"
    },
    ENTER_PASSWORD: {
        eng: "Enter Password",
        heb: "הזן סיסמה"
    },
    ENTER_NEW_PASSWORD: {
        eng: "Enter New Password",
        heb: "הזן סיסמה חדשה"
    },
    LOGGING_IN: {
        eng: "Logging in...",
        heb: "מתחבר..."
    },
    LOGIN_TITLE: {
        eng: "Login",
        heb: "התחברות"
    },
    LOGIN_SUCCESS: {
        eng: "Login successful",
        heb: "התחברות בוצעה בהצלחה"
    },
    ENTER_USER_ID_AND_PASSWORD: {
        eng: "Please enter your User ID and Password",
        heb: "אנא הזן מזהה משתמש וסיסמה"
    },
    UNKNOWN_ERROR: {
        eng: "An unknown error occurred",
        heb: "אירעה שגיאה לא ידועה"
    }
};

export default function Login() {
    const lookup = Resources.useLookup();
    const classes = useClasses(styles);
    const login = Login.State.useState();
    const managerUser = ManagerUser.State.useState();

    useEffect(() => {
        if (managerUser.userId) {
            login.userId = managerUser.userId;
        }
    }, [login, managerUser.userId]);

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (managerUser.loggedIn) {
            managerUser.logout();
            return;
        }
        login.loading = true;
        login.message = { type: '', text: '' };

        if (!login.userId || !login.password) {
            login.message = { type: 'error', text: lookup.ENTER_USER_ID_AND_PASSWORD };
            login.loading = false;
            return;
        }

        try {
            await managerUser.login(login.userId, login.password);

            login.message = { type: 'success', text: lookup.LOGIN_SUCCESS };
            login.password = '';

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : lookup.UNKNOWN_ERROR;
            login.message = { type: 'error', text: `${errorMessage}` };
        } finally {
            login.loading = false;
        }
    }, [managerUser, login]);

    const icon = useMemo(() => <FaUserLock />, []);

    const submitText = login.loading ? lookup.LOGGING_IN : (managerUser.loggedIn ? lookup.LOGOUT : lookup.LOGIN);
    const min = useMemo(() => ({ width: 300, height: 300 }), []);

    return (
        <Resources resources={resources} lookup={lookup}>
            <Screen.Rect left={100} top={100} width={500} height={500} />
            <Screen.State icon={icon} id="login" label={lookup.TITLE} maximize assetColor="darkblue" min={min} />
            <Screen>
                <ManagerUser.Ready>
                    <div className={classes("root")}>
                        <h2 className={classes("title")}>{lookup.LOGIN_TITLE}</h2>
                        <form onSubmit={onSubmit} className={classes("loginForm")}>
                            {login.message?.text && (
                                <div className={classes("message", login.message.type)}>
                                    {lookup?.[login.message.text]}
                                </div>
                            )}

                            <div className={classes("inputGroup")}>
                                <label htmlFor="loginUserId" className={classes("label")}>
                                    {lookup.USER_ID}
                                </label>
                                <input
                                    id="loginUserId"
                                    type="text"
                                    value={login.userId || ''}
                                    onChange={(e) => login.userId = e.target.value}
                                    placeholder={lookup.ENTER_USER_ID}
                                    required
                                    className={classes("input")}
                                    disabled={login.loading || managerUser.loggedIn}
                                />
                            </div>

                            {!managerUser.loggedIn && <div className={classes("inputGroup")}>
                                <label htmlFor="loginPassword" className={classes("label")}>
                                    Password
                                </label>
                                <input
                                    id="loginPassword"
                                    type="password"
                                    value={login.password || ''}
                                    onChange={(e) => login.password = e.target.value}
                                    placeholder={lookup.ENTER_PASSWORD}
                                    required={true}
                                    className={classes("input")}
                                    disabled={login.loading}
                                />
                            </div>}

                            <button
                                type="submit"
                                disabled={login.loading}
                                className={classes("submitButton")}
                            >
                                {submitText}
                            </button>
                        </form>
                    </div>
                </ManagerUser.Ready>
            </Screen >
        </Resources>
    );
}

Login.State = createState("Login.State");