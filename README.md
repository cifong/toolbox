# Toolbox

以 React 建置的個人日常工具網站，包含儀表板、習慣追蹤、餐費紀錄、上下班時間計算與運動計時器。應用程式使用 Create React App 建置，並以 HashRouter 管理前端路由。

## 環境需求

- Node.js 24.14.0、npm 11.9.0 為目前盤點到的本機版本；尚未確認這是否為專案唯一支援的版本組合。
- 依賴版本由 `package-lock.json` 鎖定。安裝時建議使用 `npm ci`。

## 安裝與啟動

```bash
npm ci
npm start
```

開發伺服器預設網址為 <http://localhost:3000>。CRA 會在程式碼變更時重新載入；CRA 的 ESLint 問題也可能顯示於開發輸出。

## 可用指令

| 指令 | 用途 |
| --- | --- |
| `npm start` | 啟動開發伺服器 |
| `npm test` | 啟動 CRA/Jest 互動式測試；預設進入 watch 模式 |
| `npm run build` | 建置正式版至 `build/` |
| `npm run deploy` | 先執行 `predeploy` 建置，再使用 `gh-pages -d build` 發布 |
| `npm run eject` | 將 CRA 設定複製至專案；此操作不可逆，請勿在一般開發流程中執行 |

目前只有 `src/App.test.js` 一個測試檔；該測試仍是 CRA 初始範例，與目前頁面及路由設定不一致。測試結果尚未確認。

## 部署

`package.json` 設定 `homepage` 為 <https://cifong.github.io/toolbox>，`predeploy` 建置 `build/`，`deploy` 使用 `gh-pages` 發布。部署指令會更新遠端 GitHub Pages 內容；執行前請先確認變更與目標 repository。GitHub Pages repository 設定及目前線上發布狀態尚未確認。

應用程式使用 `HashRouter`，路由網址包含 `#`。這是目前程式碼的設定，不代表已驗證線上部署成功。

## 專案文件

- [專案架構](docs/PROJECT_OVERVIEW.md)
- [開發環境與指令](docs/DEVELOPMENT.md)
- [Git 工作流程](docs/GIT_WORKFLOW.md)
- [Codex 專案規範](AGENTS.md)

## Create React App 參考資料

本專案由 Create React App 建立。以下保留原 README 的主要參考資料：

- [Create React App 入門](https://facebook.github.io/create-react-app/docs/getting-started)
- [執行測試](https://facebook.github.io/create-react-app/docs/running-tests)
- [部署](https://facebook.github.io/create-react-app/docs/deployment)
- [程式碼分割](https://facebook.github.io/create-react-app/docs/code-splitting)
- [分析 bundle 大小](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [進階設定](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [建置壓縮問題排查](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
- [React 文件](https://react.dev/)
