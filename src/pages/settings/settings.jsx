import React from "react";
import { Link } from "react-router-dom";
import { useAuth, useStorage } from "hooks/customhooks";

const emptyDriveSettings = { apiKey: "", folderId: "" };

export default function Settings() {
    const { token } = useAuth();
    const [driveSettings, setDriveSettings] = useStorage(`drivePlayerSettings-${token}`, emptyDriveSettings);
    const [apiKey, setApiKey] = React.useState(driveSettings.apiKey || "");
    const [folderId, setFolderId] = React.useState(driveSettings.folderId || "");
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        setApiKey(driveSettings.apiKey || "");
        setFolderId(driveSettings.folderId || "");
    }, [driveSettings]);

    function saveDriveSettings(event) {
        event.preventDefault();
        const nextSettings = { apiKey: apiKey.trim(), folderId: folderId.trim() };
        if (!nextSettings.apiKey || !nextSettings.folderId) {
            setMessage("請輸入 Google Drive API Key 與資料夾 ID。");
            return;
        }
        setDriveSettings(nextSettings);
        setMessage("Drive 設定已儲存。前往播放器載入播放清單。");
    }

    return (
        <section className="container">
            <h1 className="page-title">設定</h1>
            <p className="page-description">管理此帳號在這個瀏覽器中的個人設定。</p>

            <section className="settings-section" aria-labelledby="drive-settings-title">
                <h2 id="drive-settings-title">Google Drive 播放器</h2>
                <p>設定會依登入名稱儲存在目前瀏覽器的 localStorage。</p>
                <form className="drive-player-setup" onSubmit={saveDriveSettings}>
                    <label>
                        Google Drive API Key
                        <input
                            type="password"
                            autoComplete="off"
                            value={apiKey}
                            onChange={event => setApiKey(event.target.value)}
                        />
                    </label>
                    <label>
                        資料夾 ID
                        <input
                            type="text"
                            autoComplete="off"
                            value={folderId}
                            onChange={event => setFolderId(event.target.value)}
                        />
                    </label>
                    <button type="submit">儲存 Drive 設定</button>
                </form>
                {message && <p className="settings-message" role="status">{message}</p>}
                <p className="drive-player-note">
                    API Key 仍會保存在此瀏覽器，請限制可使用的網站與 API。播放器目前要求資料夾與媒體檔案可透過連結讀取。
                </p>
                <Link className="settings-player-link" to="/player">前往隨身雲端播放器</Link>
            </section>
        </section>
    );
}
