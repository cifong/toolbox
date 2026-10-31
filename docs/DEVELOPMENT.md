# 開發指南

## 環境與安裝

目前執行環境為 Node.js 26.13.0、npm 11.20.0。專案沒有 `.nvmrc`、`.node-version` 或 `engines` 欄位，因此其他支援版本範圍尚未確認。React 與建置工具的實際版本請以 `package-lock.json` 為準。

```bash
npm ci
npm start
```

`npm ci` 依 lockfile 安裝套件；若 lockfile 與 `package.json` 不一致，npm 會回報錯誤。開發伺服器預設在 <http://localhost:5173>。

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm start` | 啟動 Vite 開發伺服器，支援模組熱更新 |
| `npm test` | 執行 Vitest 測試 |
| `npm run build` | 產生正式建置於 `build/` |
| `npm run preview` | 本機預覽正式建置 |
| `npm run deploy` | 執行 `predeploy` 後發布 `build/` 至 gh-pages；會改變遠端發布內容 |

沒有 `lint` 或 `format` npm script。

Vite 正式建置使用 Vite 的預設瀏覽器目標；`package.json` 中原有的 `browserslist` 設定不會自動套用於 Vite。若需要支援比 Vite 預設範圍更舊的瀏覽器，需另行設定相容性方案；本次未驗證舊版瀏覽器支援。

## 建議開發流程

1. 檢查 `git status --short --branch`，確認分支並保留既有修改。
2. 閱讀欲修改頁面及相關路由、元件、hook、資料來源。
3. 以小範圍修改完成需求，避免未要求的依賴或架構變更。
4. 依變更執行相關測試或建置，查看瀏覽器及終端錯誤。
5. 檢視 `git diff` 與 `git status`，確認沒有機密、產物或無關修改。

## 測試現況

測試使用 Vitest 與 jsdom，`src/setupTests.js` 載入 `@testing-library/jest-dom`。目前只有 `src/App.test.jsx` 一個範例測試，執行結果需以實際輸出判斷；不要把它描述為完整測試覆蓋。

`npm run build` 可用於檢查正式版編譯；是否成功需實際執行後確認。

## 錯誤排查

- **套件安裝錯誤**：確認使用 npm 與專案根目錄，再執行 `npm ci`；不要隨意刪除 lockfile 或改用另一個套件管理工具。
- **開發伺服器無法啟動**：記錄完整錯誤訊息、Node/npm 版本及執行指令；確認 5173 埠是否已被使用、依賴是否安裝完成。
- **路由直接進入失敗**：確認目前使用 `HashRouter`，部署網址的前端路徑應保留 `#`，並確認 `src/App.jsx` 路由是否存在。
- **天氣未顯示**：Weather 元件在載入、請求失敗及沒有預報資料時會顯示對應提示；請求失敗或沒有資料時可按「Try again」重試。若仍無法載入，檢查瀏覽器網路面板對 Open-Meteo 的請求及回應，區分 API 網路錯誤與解析錯誤。
- **測試失敗**：先檢查測試是否符合目前頁面與 Router provider，再判斷錯誤來自測試環境或應用邏輯。
- **正式建置失敗**：以 `npm run build` 的第一個錯誤為線索，確認 import 路徑大小寫及語法。

## 環境變數與機密

未發現此專案目前使用環境變數。Vite 前端可使用以 `VITE_` 開頭的變數，但編譯後會暴露於客戶端；不可放置密碼、私鑰或其他機密。`.gitignore` 只忽略部分 `.env.*.local` 檔案；新增本機設定前，確認忽略規則，避免提交敏感內容。
