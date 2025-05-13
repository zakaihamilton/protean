import { useCallback, useEffect } from "react";
import { login } from "server/login";
import { createState } from "src/Core/Base/State";
import { createConsole } from "src/Core/Util/Console";

const console = createConsole("ManagerUser");

const LOCAL_STORAGE_KEY_USER_ID = 'userId';
const LOCAL_STORAGE_KEY_AUTH_HASH = 'userHash';

export function ManagerUser() {
    const managerUser = ManagerUser.State.useState();

    const userLogin = useCallback(async (userId, password) => {
        userId = userId.toLowerCase().replace(/[^a-z0-9]/g, '');
        managerUser.hash = null;
        try {
            const hash = await login(userId, password);
            if (hash) {
                managerUser.userId = userId;
                managerUser.hash = hash;
                managerUser.loggedIn = true;
                return;
            }
        }
        catch (error) {
            managerUser.loggedIn = false;
            console.error(error);
            throw error;
        }
    }, [managerUser]);

    const userLogout = useCallback(() => {
        managerUser.userId = null;
        managerUser.hash = null;
        managerUser.loggedIn = false;
    }, [managerUser]);

    useEffect(() => {
        managerUser.login = userLogin;
        managerUser.logout = userLogout;
        const userId = localStorage.getItem(LOCAL_STORAGE_KEY_USER_ID);
        const hash = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH_HASH);
        if (!userId || !hash) {
            return;
        }
        managerUser.userId = userId;
        login(userId, hash).then((resultHash) => {
            if (resultHash !== hash) {
                console.log("auto login failed");
                return;
            }
            console.log("auto login successful");
            managerUser.hash = hash;
            managerUser.loggedIn = true;
        }).catch(() => {
            console.log("auto login failed");
            managerUser.hash = null;
        });
    }, [managerUser, userLogin, userLogout]);

    useEffect(() => {
        const { userId, hash } = managerUser;
        if (typeof userId !== "undefined") {
            if (userId) {
                localStorage.setItem(LOCAL_STORAGE_KEY_USER_ID, userId);
            }
            else {
                localStorage.removeItem(LOCAL_STORAGE_KEY_USER_ID);
            }
        }
        if (typeof hash !== "undefined") {
            if (hash) {
                localStorage.setItem(LOCAL_STORAGE_KEY_AUTH_HASH, hash);
            }
            else {
                localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH_HASH);
            }
        }
    }, [managerUser, managerUser.userId, managerUser.hash]);

    return null;
}

ManagerUser.State = createState("ManagerUser.State");