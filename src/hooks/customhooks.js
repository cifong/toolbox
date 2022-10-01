import React from "react";
import { AuthContext } from "context/authContext";
const useAuth = () => {
    return React.useContext(AuthContext);
};
const useStorage = (storageKey, initialValue) => {
    const [value, setValue] = React.useState(
        () => JSON.parse(localStorage.getItem(storageKey)) || initialValue
    );

    React.useEffect(() => {
        if(value === null) {
            localStorage.removeItem(storageKey);
            return;
        }
        localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);
    return [value, setValue];
}
export { useAuth, useStorage };