/**
 * build 編譯相關的修改，例如發布版本、對專案建置或依賴的改動
 * chore 其他修改, 例如改變建置流程、或增加依賴函式庫、工具等
 * docs 文件修改
 * feat 新功能、新功能
 * fix 修改bug
 * perf 優化相關，例如提升效能、體驗
 * refactor 程式碼重構
 * revert 回滾到上一個版本
 * style 程式碼格式修改
 * test 測試用例修改
 */
/* eslint-env node */
module.exports = {
  extends: ['@commitlint/config-conventional'],
}