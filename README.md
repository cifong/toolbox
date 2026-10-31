# Toolbox

以 React 建置的個人日常工具網站，包含儀表板、習慣追蹤、餐費紀錄、上下班時間計算與運動計時器。應用程式使用 Vite 建置，並以 HashRouter 管理前端路由。

## 環境需求

- 目前本機驗證使用 Node.js 26.13.0、npm 11.20.0；專案尚未透過 `.nvmrc` 或 `engines` 欄位固定 Node.js 版本。
- 依賴版本由 `package-lock.json` 鎖定。安裝時建議使用 `npm ci`。

## 安裝與啟動

```bash
npm ci
npm start
```

開發伺服器預設網址為 <http://localhost:5173>。Vite 提供模組熱更新。

## 可用指令

| 指令 | 用途 |
| --- | --- |
| `npm start` | 啟動開發伺服器 |
| `npm test` | 執行 Vitest 測試 |
| `npm run build` | 建置正式版至 `build/` |
| `npm run preview` | 本機預覽正式建置 |
| `npm run deploy` | 先執行 `predeploy` 建置，再使用 `gh-pages -d build` 發布 |

目前只有 `src/App.test.jsx` 一個測試檔。測試以 `MemoryRouter` 包住 `App`，並確認登入頁的 `Welcome` 標題可見。

## 部署

`package.json` 設定 `homepage` 為 <https://cifong.github.io/toolbox>，`predeploy` 建置 `build/`，`deploy` 使用 `gh-pages` 發布。部署指令會更新遠端 GitHub Pages 內容；執行前請先確認變更與目標 repository。GitHub Pages repository 設定及目前線上發布狀態尚未確認。

應用程式使用 `HashRouter`，路由網址包含 `#`。這是目前程式碼的設定，不代表已驗證線上部署成功。

## 專案文件

- [專案架構](docs/PROJECT_OVERVIEW.md)
- [開發環境與指令](docs/DEVELOPMENT.md)
- [Git 工作流程](docs/GIT_WORKFLOW.md)
- [Codex 專案規範](AGENTS.md)

## Vite 參考資料

- [Vite 文件](https://vite.dev/guide/)
- [Vite 靜態網站部署](https://vite.dev/guide/static-deploy)
- [Vitest 文件](https://vitest.dev/guide/)
- [React 文件](https://react.dev/)
