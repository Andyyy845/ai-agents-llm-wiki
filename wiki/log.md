# Wiki 歷程與檢核紀錄 (Ingestion & QA Log)

本文件依據專案規範 `AGENTS.md` 建立，詳細記錄每一批次論文攝入（Ingestion）過程、程式檢查（Code QA）、內容忠實度檢查（Faithfulness QA）、回退修復紀錄及目前知識庫狀態。

---

## 📌 批次 03 (Batch 03) Ingestion 紀錄

* **執行日期**：2026-11-23
* **批次規模**：1 篇（符合每批 1～2 篇規範）
* **執行狀態**：✅ 成功完成攝入並通過全項檢查

### 1. 目標論文清單
1. `raw/retrieval_augmented_generation.pdf`
   - **標題**：Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
   - **作者**：Patrick Lewis 等 12 位作者（Facebook AI Research, UCL, NYU）
   - **年份**：2020（NeurIPS 2020）
   - **來源**：https://arxiv.org/abs/2005.11401
   - **產出條目**：`wiki/retrieval_augmented_generation.md`

---

### 2. 品質檢查報告 (QA Report - Batch 03)

#### 2.1 程式與技術檢查 (Code & Technical Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **檔案結構** | Markdown 語法規範、標題層級標準 | ✅ 通過 | 語法結構嚴謹，RAG-Sequence 與 RAG-Token 公式標註標準 |
| **內部連結有效性** | Wiki 條目與原始 PDF 相對路徑 | ✅ 通過 | `index.md` 與個別條目內部連結正確無死鏈 |
| **敏感資訊掃描** | 無 API Keys、密碼或機密字串 | ✅ 通過 | 無任何金鑰或敏感資料洩漏 |
| **檔案讀取與解析** | PDF 與 Markdown 均能正常解析 | ✅ 通過 | 原始 PDF 全文 19 頁完整解析無損 |

#### 2.2 內容忠實度檢查 (Content Faithfulness Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **來源資訊完整度** | 標題、作者群、年份、URL 齊全 | ✅ 通過 | 4 項核心中繼資料皆完整對齊 arXiv 與原始論文 |
| **數據與結論忠實度** | 實驗數據皆出自原文，無憑空捏造 | ✅ 通過 | 包含 NQ (44.5 EM)、TriviaQA (68.0 EM)、Jeopardy 人類評估數據 (42.7%) 及圖表編號 |
| **機制精準性** | 清楚說明 RAG-Sequence 與 RAG-Token 差異 | ✅ 通過 | 詳述邊緣化時機（整句單文檔 vs 逐字跨文檔）及 Thorough / Fast 解碼策略 |
| **重要內容缺漏檢驗** | 背景、核心技術、限制、初學者解釋俱全 | ✅ 通過 | 包含開卷考試比喻、Index Hot-Swapping（2016 vs 2018 領袖實驗） |

---

### 3. 自動修復歷程 (Revision History - Batch 03)
* **自動修正輪數**：第 0 輪（初次解析生成即通過完整 QA 雙重檢核，未觸發節點回退）。
* **待驗證標記 (Unverified Items)**：0 項（所有引述數據均有原文章節、圖表與頁碼可稽）。

---

## 📌 批次 02 (Batch 02) Ingestion 紀錄

* **執行日期**：2026-11-23
* **批次規模**：2 篇（符合每批 1～2 篇規範）
* **執行狀態**：✅ 成功完成攝入並通過全項檢查
* **收錄論文**：
  1. `raw/react_reasoning_and_acting.pdf` ➔ `wiki/react_reasoning_and_acting.md`
  2. `raw/toolformer.pdf` ➔ `wiki/toolformer.md`

---

## 📌 批次 01 (Batch 01) Ingestion 紀錄

* **執行日期**：2026-11-23
* **批次規模**：2 篇（符合每批 1～2 篇規範）
* **執行狀態**：✅ 成功完成攝入並通過全項檢查
* **收錄論文**：
  1. `raw/attention_is_all_you_need.pdf` ➔ `wiki/attention_is_all_you_need.md`
  2. `raw/language_models_are_few_shot_learners.pdf` ➔ `wiki/language_models_are_few_shot_learners.md`

---

## 📊 累積統計與達成度 (Cumulative Summary & DoD Status)
* **累計成功 Ingest 論文數**：**5 篇**
* **專案最低要求進度 ( $\ge 5$ 篇)**：🎉 **已達標 (100%)**
* **目前 Wiki 條目清單**：
  1. `wiki/attention_is_all_you_need.md`（Transformer / Self-Attention）
  2. `wiki/language_models_are_few_shot_learners.md`（GPT-3 / In-Context Learning）
  3. `wiki/react_reasoning_and_acting.md`（ReAct / Thought-Action-Observation Loop）
  4. `wiki/toolformer.md`（Toolformer / Self-Supervised Tool Calling）
  5. `wiki/retrieval_augmented_generation.md`（RAG / Hybrid Parametric & Non-Parametric Memory）
  6. `wiki/index.md`（索引總表與架構對比）
  7. `wiki/log.md`（全歷程檢核紀錄）
