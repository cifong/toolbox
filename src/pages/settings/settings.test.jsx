import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "context/authContext";
import Settings from "./settings";

function renderSettings() {
    return render(
        <AuthContext.Provider value={{ token: "test-user" }}>
            <MemoryRouter>
                <Settings />
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

beforeEach(() => {
    localStorage.clear();
});

test("loads the existing Drive settings for the signed-in user", () => {
    localStorage.setItem("drivePlayerSettings-test-user", JSON.stringify({
        apiKey: "saved-api-key",
        folderId: "saved-folder-id",
    }));

    renderSettings();

    expect(screen.getByLabelText("Google Drive API Key")).toHaveValue("saved-api-key");
    expect(screen.getByLabelText("資料夾 ID")).toHaveValue("saved-folder-id");
});

test("saves trimmed Drive settings using the existing player storage key", async () => {
    renderSettings();

    await userEvent.type(screen.getByLabelText("Google Drive API Key"), "  new-api-key  ");
    await userEvent.type(screen.getByLabelText("資料夾 ID"), "  new-folder-id  ");
    await userEvent.click(screen.getByRole("button", { name: "儲存 Drive 設定" }));

    expect(JSON.parse(localStorage.getItem("drivePlayerSettings-test-user"))).toEqual({
        apiKey: "new-api-key",
        folderId: "new-folder-id",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Drive 設定已儲存");
});

test("does not replace saved settings when a required value is missing", async () => {
    localStorage.setItem("drivePlayerSettings-test-user", JSON.stringify({
        apiKey: "saved-api-key",
        folderId: "saved-folder-id",
    }));
    renderSettings();

    await userEvent.clear(screen.getByLabelText("資料夾 ID"));
    await userEvent.click(screen.getByRole("button", { name: "儲存 Drive 設定" }));

    expect(screen.getByRole("status")).toHaveTextContent("請輸入 Google Drive API Key 與資料夾 ID");
    expect(JSON.parse(localStorage.getItem("drivePlayerSettings-test-user"))).toEqual({
        apiKey: "saved-api-key",
        folderId: "saved-folder-id",
    });
});
