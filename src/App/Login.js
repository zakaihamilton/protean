'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import styles from './Login.module.scss';
import Screen from "src/UI/Screen";
import { FaUserLock } from "react-icons/fa";
import { ManagerUser } from "src/Manager/User";
import { createState } from "src/Core/Base/State";
import { useClasses } from "src/Core/Util/Styles";
import Lang from "src/Core/UI/Lang";

export default function Login() {
    const classes = useClasses(styles);
    const login = Login.State.useState();
    const managerUser = ManagerUser.State.useState();
    const text = Lang.useText();

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
            login.message = { type: 'error', text: 'Please enter User ID and Password.' };
            login.loading = false;
            return;
        }

        try {
            await managerUser.login(login.userId, login.password);

            login.message = { type: 'success', text: 'Login successful!' };
            login.password = '';

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            login.message = { type: 'error', text: `${errorMessage}` };
        } finally {
            login.loading = false;
        }
    }, [managerUser, login]);

    const icon = useMemo(() => <FaUserLock />, []);

    const submitText = login.loading ? text.LOGGING_IN : (managerUser.loggedIn ? text.LOGOUT : text.LOGIN);

    return (
        <>
            <Screen.Rect left={100} top={100} width={500} height={500} />
            <Screen.State icon={icon} id="login" label="Login" maximize accentBackground="darkblue" />
            <Screen>
                <ManagerUser.Ready>
                    <div className={classes("root")}>
                        <h2 className={classes("title")}>{text.LOGIN_TITLE}</h2>
                        <form onSubmit={onSubmit} className={classes("loginForm")}>
                            {login.message?.text && (
                                <div className={classes("message", login.message.type)}>
                                    {text?.[login.message.text]}
                                </div>
                            )}

                            <div className={classes("inputGroup")}>
                                <label htmlFor="loginUserId" className={classes("label")}>
                                    {text.USER_ID}
                                </label>
                                <input
                                    id="loginUserId"
                                    type="text"
                                    value={login.userId || ''}
                                    onChange={(e) => login.userId = e.target.value}
                                    placeholder={text.ENTER_USER_ID}
                                    required
                                    className={classes("input")}
                                    disabled={login.loading || managerUser.loggedIn}
                                />
                                <p className={classes("hint")}>{text.USER_ID_HINT}</p>
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
                                    placeholder={text.ENTER_PASSWORD}
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
        </>
    );
}

Login.State = createState("Login.State");