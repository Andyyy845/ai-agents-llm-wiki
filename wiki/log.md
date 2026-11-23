# Wiki 歷程與檢核紀錄 (Ingestion & QA Log)

本文件依據專案規範 `AGENTS.md` 建立，詳細記錄每一批次論文攝入（Ingestion）過程、程式檢查（Code QA）、內容忠實度檢查（Faithfulness QA）、回退修復紀錄及目前知識庫狀態。

---

## 📌 批次 01 (Batch 01) Ingestion 紀錄

* **執行日期**：2026-11-23
* **批次規模**：2 篇（符合每批 1～2 篇規範）
* **執行狀態**：✅ 成功完成攝入並通過全項檢查

### 1. 目標論文清單
1. `raw/attention_is_all_you_need.pdf`
   - **標題**：Attention Is All You Need
   - **作者**：Ashish Vaswani 等 8 位作者
   - **年份**：2017
   - **來源**：https://arxiv.org/abs/1706.03762
   - **產出條目**：`wiki/attention_is_all_you_need.md`
2. `raw/language_models_are_few_shot_learners.pdf`
   - **標題**：Language Models are Few-Shot Learners
   - **作者**：Tom B. Brown 等 31 位作者（OpenAI）
   - **年份**：2020
   - **來源**：https://arxiv.org/abs/2005.14165
   - **產出條目**：`wiki/language_models_are_few_shot_learners.md`

---

### 2. 品質檢查報告 (QA Report - Batch 01)

#### 2.1 程式與技術檢查 (Code & Technical Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **檔案結構** | Markdown 語法規範、標題層級標準 | ✅ 通過 | 語法結構清晰，支援 GFM 與 LaTeX 公式 |
| **內部連結有效性** | Wiki 條目與原始 PDF 相對路徑 | ✅ 通過 | `index.md` 與個別條目內部連結正確無死鏈 |
| **敏感資訊掃描** | 無 API Keys、密碼或機密字串 | ✅ 通過 | 無任何金鑰或敏感資料洩漏 |
| **檔案讀取與解析** | PDF 與 Markdown 均能正常解析 | ✅ 通過 | 兩篇原始 PDF 全文解析無損 |

#### 2.2 內容忠實度檢查 (Content Faithfulness Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **來源資訊完整度** | 標題、作者群、年份、URL 齊全 | ✅ 通過 | 4 項核心中繼資料皆完整對齊 arXiv 紀錄 |
| **數據與結論忠實度** | 實驗數據皆出自原文，無憑空捏造 | ✅ 通過 | BLEU 分數、參數規模、圖表數據皆附原文章節與頁碼 |
| **重複資料檢驗** | 條目獨立，無無序重複收錄 | ✅ 通過 | 兩篇條目職責分明，無冗餘衝突內容 |
| **重要內容缺漏檢驗** | 背景、核心技術、限制、初學者解釋俱全 | ✅ 通過 | 包含生活化比喻、與 ChatGPT 之關聯及簡報要點 |
| **學術矛盾與爭議** | 客觀記錄限制與優缺點，不偏袒單方 | ✅ 通過 | 忠實記錄 Transformer 的 $O(n^2)$ 開銷及 GPT-3 的 WiC / 物理常識 / 社會偏見等限制 |

---

### 3. 自動修復歷程 (Revision History)
* **自動修正輪數**：第 0 輪（初次解析生成即通過完整 QA 雙重檢核，未觸發節點回退）。
* **待驗證標記 (Unverified Items)**：0 項（所有引述數據均有原文章節頁碼可稽）。

---

### 4. 累積統計 (Cumulative Summary)
* **已成功 Ingest 論文數**：2 篇
* **距離目標篇數**：尚餘 3 篇（目標 $\ge 5$ 篇）
* **產出檔案**：
  * `wiki/attention_is_all_you_need.md`
  * `wiki/language_models_are_few_shot_learners.md`
  * `wiki/index.md`
  * `wiki/log.md`
