# Git 工作流程

## 修改前

```bash
git status --short --branch
git branch --show-current
```

確認目前分支及工作目錄狀態。若有既存修改，辨認其歸屬並保留；不要覆寫或混入與本次工作無關的內容。

## 檢視修改

```bash
git diff
git diff --check
git status --short
```

檢查完整差異、空白錯誤與新增檔案。`git diff` 不會顯示未追蹤檔案內容，檢視新檔時應另外開啟確認。提交前確認沒有 `.env`、憑證、建置產物、依賴目錄或無關變更。

## 提交

僅在使用者要求提交或工作流程明確授權時提交。先確認暫存內容，再提交需求相關檔案：

```bash
git add <明確的檔案路徑>
git diff --cached
git commit -m "簡潔描述變更"
```

避免使用 `git add .`，以免把不相關或使用者的修改一起納入。提交後檢查 `git status --short --branch` 和 `git show --stat --oneline HEAD`。

## 同步遠端

本次盤點的目前分支是 `main`，追蹤 `origin/main`，遠端為 GitHub repository `cifong/toolbox`。執行 pull、push 或變更分支前，確認使用者要求、目前分支與本地差異；未經要求不推送、不改寫共享歷史、不強制推送。

## 回復與風險操作

- 優先以小範圍、可檢視的修正處理問題；回復前先確認檔案與差異來源。
- 不執行 `git reset --hard`、`git clean`、強制推送或其他可能丟失資料的操作，除非使用者明確要求且目標已確認。
- 不用 `git checkout -- <file>` 或 `git restore` 覆蓋尚未辨認的修改。
- `npm run deploy` 會發布遠端 GitHub Pages，屬於外部可見變更；需有明確部署要求並先檢查 build 與 Git 差異。
