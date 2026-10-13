# Codex 專案規範

## 專案事實

- 本專案使用 Create React App、`react-scripts`、React 18、React Router DOM 6 與 npm。實際安裝版本以 `package-lock.json` 和安裝環境為準；不要只依賴 `package.json` 的版本範圍。
- 入口為 `src/index.js`；頁面與路由記錄於 `docs/PROJECT_OVERVIEW.md`。
- 頁面資料透過 `src/hooks/customhooks.js` 的 `useStorage` 存於瀏覽器 `localStorage`。不要假設有伺服器端持久化或安全的登入服務。

## 修改原則

- 開始前先查看 `git status --short --branch`、相關程式碼與設定，保留使用者現有修改。
- 僅修改完成需求所需的檔案；不要自行遷移建置工具、升級核心依賴、變更部署設定或新增套件。
- 路由修改須同步檢查 `src/App.js`、`src/index.js` 及導覽連結。HashRouter 是目前設定。
- 延續既有 JavaScript、React Hooks 與 CRA ESLint 慣例。狀態更新不可直接修改既有陣列或物件；使用新值更新。
- 不要把密碼、token、API key 或其他機密寫入程式碼、文件、提交或日誌。登入目前為前端示範邏輯，不可描述為正式安全驗證。
- 未經需求要求，不讀取或輸出 `.env` 機密內容。新增環境變數前，先確認 CRA 的 `REACT_APP_` 規則與部署需求；前端環境變數會進入客戶端建置，不適合存放秘密。
- 不要臆造 API、路由、測試、工作流程或執行結果；不確定時明確標示尚未確認。

## 驗證要求

- 依修改內容選擇驗證：`npm test` 執行測試，`npm run build` 驗證正式建置；檢查 lint 輸出與瀏覽器錯誤（如適用）。回報實際執行的指令及結果，不得宣稱未執行的驗證已通過。
- 測試是 CRA/Jest 與 Testing Library；目前 `src/App.test.js` 為尚未更新的 CRA 範例，和應用路由不一致。修改測試或路由時，先理解此現況再判讀測試結果。
- 本專案沒有獨立 lint script，也沒有已確認的 Prettier 設定；不要執行不存在的 npm script。

## Git 安全

- 修改前、修改後都檢查 Git 狀態與差異；只提交需求相關內容，避免納入使用者修改、產物、機密或無關檔案。
- 不擅自提交、推送、部署、切換分支或改寫共享歷史。除非使用者明確要求，不執行 `git reset --hard`、`git clean`、強制推送或其他會丟失資料的操作。
- 回復變更前先確認變更來源與範圍；只回復本次明確建立的修改，不覆蓋使用者既有工作。
- `npm run deploy` 會發布遠端 GitHub Pages；執行前須有明確部署要求，並確認差異與目標。
