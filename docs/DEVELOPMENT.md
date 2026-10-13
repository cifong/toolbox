# 開發指南

## 環境與安裝

目前盤點的執行環境為 Node.js 24.14.0、npm 11.9.0。專案沒有 `.nvmrc`、`.node-version` 或 `engines` 欄位，因此其他支援版本範圍尚未確認。React 與建置工具的實際版本請以 `package-lock.json` 為準。

```bash
npm ci
npm start
```

`npm ci` 依 lockfile 安裝套件；若 lockfile 與 `package.json` 不一致，npm 會回報錯誤。開發伺服器預設在 <http://localhost:3000>。

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm start` | 啟動 CRA 開發伺服器，支援即時重新載入 |
| `npm test` | 啟動 CRA/Jest watch 測試模式；按 `q` 可離開互動模式 |
| `npm run build` | 產生正式建置於 `build/` |
| `npm run deploy` | 執行 `predeploy` 後發布 `build/` 至 gh-pages；會改變遠端發布內容 |

沒有 `lint` 或 `format` npm script。CRA 的 ESLint 規則由開發伺服器和建置工具整合提供。

## 建議開發流程

1. 檢查 `git status --short --branch`，確認分支並保留既有修改。
2. 閱讀欲修改頁面及相關路由、元件、hook、資料來源。
3. 以小範圍修改完成需求，避免未要求的依賴或架構變更。
4. 依變更執行相關測試或建置，查看瀏覽器及終端錯誤。
5. 檢視 `git diff` 與 `git status`，確認沒有機密、產物或無關修改。

## 測試現況

測試入口由 CRA/Jest 提供，`src/setupTests.js` 載入 `@testing-library/jest-dom`。目前只有 `src/App.test.js`，仍尋找已不在應用中的 CRA 範例連結，並未將 `App` 包在 Router 中。故測試成功與否尚未確認；修改功能時應先建立符合實際畫面及路由的測試，再依測試輸出判斷結果。不要把這個範例測試描述為完整測試覆蓋。

`npm run build` 可用於檢查正式版編譯；是否成功需實際執行後確認。

## 錯誤排查

- **套件安裝錯誤**：確認使用 npm 與專案根目錄，再執行 `npm ci`；不要隨意刪除 lockfile 或改用另一個套件管理工具。
- **開發伺服器無法啟動**：記錄完整錯誤訊息、Node/npm 版本及執行指令；確認 3000 埠是否已被使用、依賴是否安裝完成。先前曾有一次啟動失敗，但原因尚未確認，不能據此推定為版本或程式問題。
- **路由直接進入失敗**：確認目前使用 `HashRouter`，部署網址的前端路徑應保留 `#`，並確認 `App.js` 路由是否存在。
- **天氣未顯示**：檢查瀏覽器網路面板對 Open-Meteo 的請求及回應。現有程式未提供完整錯誤 UI，請區分 API 網路錯誤與解析錯誤。
- **測試失敗**：先檢查失敗測試是否仍是 CRA 範例、是否需要 Router provider，以及錯誤是否來自測試環境或應用邏輯。
- **正式建置失敗**：以 `npm run build` 的第一個錯誤為線索，確認 import 路徑大小寫、語法及 CRA ESLint 輸出；不要先 eject 或升級依賴。

## 環境變數與機密

未發現此專案目前使用環境變數。CRA 前端可使用以 `REACT_APP_` 開頭的變數，但編譯後會暴露於客戶端；不可放置密碼、私鑰或其他機密。`.gitignore` 只忽略部分 `.env.*.local` 檔案；新增本機設定前，確認忽略規則，避免提交敏感內容。
