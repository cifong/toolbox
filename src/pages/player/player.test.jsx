import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "context/authContext";
import Player from "./player";

function renderPlayer() {
    return render(
        <AuthContext.Provider value={{ token: "test-user" }}>
            <MemoryRouter>
                <Player />
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

test("offers settings when the player has no saved configuration", () => {
    renderPlayer();

    expect(screen.getByRole("link", { name: "前往設定" })).toHaveAttribute("href", "/settings");
});

test("offers a settings link when loading the Drive folder fails", async () => {
    localStorage.setItem("drivePlayerSettings-test-user", JSON.stringify({
        apiKey: "test-api-key",
        folderId: "test-folder-id",
    }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "Access denied" } }),
    }));

    renderPlayer();

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Access denied"));
    expect(screen.getByRole("link", { name: "編輯 Drive 設定" })).toHaveAttribute("href", "/settings");
});

test("hides the settings edit link after successfully loading the playlist", async () => {
    localStorage.setItem("drivePlayerSettings-test-user", JSON.stringify({
        apiKey: "test-api-key",
        folderId: "test-folder-id",
    }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            files: [{ id: "track-1", name: "track.mp3", mimeType: "audio/mpeg" }],
        }),
    }));

    renderPlayer();

    await waitFor(() => expect(screen.getByRole("list", { name: "播放清單" })).toBeInTheDocument());
    expect(screen.queryByRole("link", { name: "編輯 Drive 設定" })).not.toBeInTheDocument();
});
