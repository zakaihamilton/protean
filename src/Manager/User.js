import { useCallback, useEffect } from "react";
import { login } from "server/login";
import { createState } from "src/Core/Base/State";
import { createConsole } from "src/Core/Util/Console";
import Cookies from "js-cookie";

const console = createConsole("ManagerUser");

const STORAGE_KEY_USER_ID = 'userId';
const STORAGE_KEY_AUTH_HASH = 'userHash';

export function ManagerUser() {
    const managerUser = ManagerUser.State.useState();

    const userLogin = useCallback(async (userId, password) => {
        userId = userId.toLowerCase().replace(/[^a-z0-9]/g, '');
        managerUser((draft) => {
            draft.hash = null;
        });
        try {
            const result = await login(userId, password);
            const { hash, error } = result;
            if (hash) {
                managerUser((draft) => {
                    draft.userId = userId;
                    draft.hash = hash;
                    draft.loggedIn = true;
                });
                return;
            }
            if (error) {
                throw new Error(error);
            }
        }
        catch (error) {
            managerUser((draft) => {
                draft.loggedIn = false;
            });
            console.error(error);
            throw error;
        }
    }, [managerUser]);

    const userLogout = useCallback(() => {
        managerUser((draft) => {
            draft.userId = null;
            draft.hash = null;
            draft.loggedIn = false;
        });
    }, [managerUser]);

    useEffect(() => {
        managerUser((draft) => {
            draft.login = userLogin;
            draft.logout = userLogout;
        });
        const userId = Cookies.get(STORAGE_KEY_USER_ID);
        const hash = Cookies.get(STORAGE_KEY_AUTH_HASH);
        if (!userId || !hash) {
            managerUser((draft) => {
                draft.loggedIn = false;
            });
            return;
        }
        managerUser((draft) => {
            draft.userId = userId;
        });
        login(userId, hash).then((result) => {
            const { hash: resultHash } = result;
            if (resultHash !== hash) {
                console.log("auto login failed", result);
                return;
            }
            console.log("auto login successful");
            managerUser((draft) => {
                draft.hash = hash;
                draft.loggedIn = true;
            });
        }).catch(() => {
            console.log("auto login failed");
            managerUser((draft) => {
                draft.hash = null;
                draft.loggedIn = false;
            });
        });
    }, [managerUser, userLogin, userLogout]);

    useEffect(() => {
        const { userId, hash } = managerUser;
        if (typeof userId !== "undefined") {
            if (userId) {
                Cookies.set(STORAGE_KEY_USER_ID, userId);
            }
            else {
                Cookies.remove(STORAGE_KEY_USER_ID, { path: '' });
            }
        }
        if (typeof hash !== "undefined") {
            if (hash) {
                Cookies.set(STORAGE_KEY_AUTH_HASH, hash);
            }
            else {
                Cookies.remove(STORAGE_KEY_AUTH_HASH, { path: '' });
            }
        }
    }, [managerUser, managerUser.userId, managerUser.hash]);

    return null;
}

ManagerUser.Ready = function ManagerUserReady({ children }) {
    const managerUser = ManagerUser.State.useState();
    if (typeof managerUser.loggedIn === "undefined") {
        return null;
    }
    return children;
}

ManagerUser.State = createState("ManagerUser.State");