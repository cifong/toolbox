# 專案架構

## 技術組成

| 項目 | 目前確認內容 |
| --- | --- |
| 建置工具 | Vite |
| UI | React、React DOM 19.3.1 |
| 路由 | React Router DOM 7.18.5，入口使用 `HashRouter` |
| 樣式 | `src/assets/App.css` |
| 狀態 | React Context（登入狀態）及 React Hooks；頁面資料使用瀏覽器 `localStorage` |
| 測試 | Vitest、jsdom、React Testing Library；涵蓋登入/路由、localStorage、習慣、餐費、打卡及天氣資料 |
| 外部服務 | Dashboard 天氣資料使用 Open-Meteo Forecast API |

版本為目前 lockfile 與安裝目錄確認結果；`package.json` 宣告的是版本範圍。

## 目錄與入口

- `index.html`：Vite 的 HTML 入口，載入 `src/index.jsx`。
- `src/index.jsx`：取得 `#root`、建立 React root，套用 `React.StrictMode` 與 `HashRouter`，渲染 `App`；呼叫 `reportWebVitals()`，目前未傳入回呼，因此未送出量測資料。
- `src/App.jsx`：組合 AuthProvider、導覽、頁首與路由。
- `src/pages/`：功能頁面。
- `src/components/`：共用元件，包括登入 Context provider、導覽、頁首和天氣元件。
- `src/context/`：建立 AuthContext。
- `src/hooks/`：`useAuth`、`useStorage`。
- `src/data/`：天氣請求/轉換邏輯與運動計時器靜態資料。
- `src/utils/`：共用日期工具。
- `src/assets/`：CSS 與 SVG 圖檔。
- `public/`：manifest、圖示與 robots.txt；Vite 將此處資產複製至建置結果。
- `package.json`、`package-lock.json`：依賴、scripts 與鎖定版本。

## 路由

路由由 `src/App.jsx` 定義，外層 `HashRouter` 位於 `src/index.jsx`。

| 路徑 | 頁面 | 存取 |
| --- | --- | --- |
| `/` | Login | 公開 |
| `/login` | Login | 公開 |
| `/dashboard` | Dashboard | ProtectedRoute |
| `/habittrack` | HabitTrack | ProtectedRoute |
| `/meals` | Meals | ProtectedRoute |
| `/worksignin` | Worksignin | ProtectedRoute |
| `/workouttimer` | WorkoutTimerIndex | ProtectedRoute |
| `/workouttimer/:tid` | WorkoutTimer | ProtectedRoute |
| `/settings` | Settings | ProtectedRoute |
| `/player` | Cloud Player | ProtectedRoute |
| 其他 | 404 訊息 | 公開 fallback |

`src/pages/todolist/todolist.js` 有 TodoList 元件，但目前沒有掛載至路由或導覽。

## 登入與資料流

1. `AuthProvider` 使用 `useStorage('logininguser', null)` 讀寫登入名稱。
2. Login 頁面以程式內固定字串檢查密碼，然後呼叫 `onLogin`；`fakeAuth` 延遲後以使用者名稱作為 token。
3. `ProtectedRoute` 以 token 是否存在判斷是否導向 `/login`，並保留原路徑；登入後預設前往 `/dashboard`。
4. `Navigation`、`Header` 透過 `useAuth` 讀取 Context；登出將 token 設為 null。
5. 各資料頁以 `useStorage` 將狀態 JSON 化後保存於 localStorage，許多 key 依登入名稱區分，例如 `habitlist${token}`、`meallist${token}`、`workTime${token}`。沒有發現伺服器資料庫或 API 身分驗證。

登入與密碼檢查完全在客戶端，localStorage 亦可由使用者修改；此實作只能視為示範流程，不是安全認證。

## 頁面與外部資料

- **Dashboard**：計算年、月、週、日進度；包含 Weather 元件。
- **Weather**：依程式碼內的 Xihu 與 Nantun 經緯度載入目前及未來三日天氣；載入期間顯示提示，請求失敗或沒有預報資料時顯示說明與重試按鈕。
- **HabitTrack**：習慣名稱與七日勾選狀態保存於 localStorage。清單為空時提示新增方式；新增、勾選及清除本週勾選後，會以即時狀態訊息回報結果。習慣勾選框及編輯、刪除控制有可辨識名稱。
- **Meals**：每日狀態、支出明細、預算及餘額保存於 localStorage。尚無支出時顯示新增指引；支出金額須大於零，新增成功或輸入無效時會顯示狀態訊息。
- **Worksignin**：上班時間設定與打卡時間保存於 localStorage，並計算預估下班時間。打卡前會檢查時數範圍及工作時間是否大於請假時間；打卡結果或設定錯誤會顯示狀態訊息。
- **WorkoutTimer**：清單及計時流程使用 `src/data/workouttimer.js` 的靜態資料；`:tid` 對應資料 id。可開始、暫停及重新開始計時，並以狀態訊息回報開始、暫停或完成；找不到計時資料或步驟時顯示返回清單的提示。
- **Login**：帳號與密碼欄位為必填；密碼不符時顯示錯誤訊息。
- **Settings**：目前為簡單頁面。
- **Cloud Player**：使用者輸入 Google Drive API Key 與資料夾 ID，透過 `useStorage` 依登入名稱保存設定，並載入資料夾內的 MP3、MP4 檔案播放。此 API Key 模式需資料夾與媒體檔案可公開讀取；私人 Drive 存取需另行整合 Google OAuth。
- **TodoList**：元件檔案存在但尚未路由整合。

`src/data/weather.js` 對 `https://api.open-meteo.com/v1/forecast` 發出 `fetch`，傳送緯度、經度、每日欄位、時間格式、預報天數及時區，並將回傳值轉換成元件使用的欄位。程式碼沒有配置 API key 或環境變數。API 可用性及實際回應未於本次檢查驗證。

## 品質與部署設定

- 沒有獨立 lint script 或 Prettier 設定檔。
- 測試由 `npm test` 執行；目前 6 個測試檔、14 個案例，涵蓋登入/路由、`useStorage`、習慣追蹤、餐費、打卡及天氣資料。
- `.github/workflows/ci-cd.yml` 在針對 `main` 的 Pull Request 與推送時執行 `npm ci`、`npm test` 和 `npm run build`；只有推送至 `main` 且前置工作成功時才部署 GitHub Pages。遠端工作流程及 Pages 設定尚未經 GitHub 實際執行確認。
- GitHub Pages 設定位於 `package.json` 與 `vite.config.mjs`：`homepage` 指向 `https://cifong.github.io/toolbox`，Vite `base` 為 `/toolbox/`，建置輸出至 `build/`；手動 `deploy` script 使用 `gh-pages -d build`。`HashRouter` 支援以 hash 表示前端路徑。
