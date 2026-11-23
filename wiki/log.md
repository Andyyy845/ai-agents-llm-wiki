# Wiki 歷程與檢核紀錄 (Ingestion & QA Log)

本文件依據專案規範 `AGENTS.md` 建立，詳細記錄每一批次論文攝入（Ingestion）過程、程式檢查（Code QA）、內容忠實度檢查（Faithfulness QA）、回退修復紀錄、HTML 簡報生成與檢核結果，以及目前知識庫狀態。

---

## 📌 HTML 教學簡報生成與檢核紀錄 (Phase 3: HTML Presentation Generation & QA)

* **執行日期**：2026-11-23
* **產出成果**：
  1. `slides/index.html`（10 頁完整結構化投影片，整合 SVG 原生圖解、公式與引用腳註）
  2. `slides/style.css`（高質感深色現代主題、響應式排版、進度條與按鈕互動樣式）
  3. `slides/script.js`（鍵盤導航 `←`/`→`/`Space`、按鈕翻頁、`X / 10` 頁碼計數器、觸控滑動、URL Hash `#slide-X`）
* **主題名稱**：《從大型語言模型（LLM）到 AI Agents 與 RAG》
* **目標讀者**：使用過 ChatGPT、但缺乏底層架構系統性認知的繁體中文大學生。
* **執行狀態**：✅ 成功生成並通過程式檢查、內容忠實度檢查與真實瀏覽器渲染測試。

### 1. 簡報 10 頁結構與重點摘要
1. **第 1 頁：封面與技術發展全景**
   - 概念躍遷路徑：基礎模型（Transformer）➔ 湧現能力（GPT-3）➔ 外部能力增強（RAG、Toolformer、ReAct）。
   - 明確指出當前 AI Agent 通常整合多篇論文思想（【教學概念示意】）。
   - 引用來源：標註五篇核心論文總體演進脈絡。
2. **第 2 頁：LLM、AI Agent、RAG 的協同關係**
   - 協同架構：大腦（LLM）、圖書館（RAG 非參數化記憶）、雙手與工具（Toolformer/ReAct 環境互動）。
   - 澄清說明：標註協同整合模式為當代系統工程抽象設計（【教學概念示意】）。
   - 引用來源：`wiki/index.md` 架構對比矩陣與五篇論文條目。
3. **第 3 頁：Transformer 與 Self-Attention 機制**
   - 核心創新：捨棄 RNN/CNN 循環架構，採用純注意力機制實現全局並行計算。
   - 關鍵公式：嚴格使用 $\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$，詳述除以 $\sqrt{d_k}$ 避免點積過大造成梯度消失。
   - 引用來源：`wiki/attention_is_all_you_need.md`（Vaswani et al., 2017, Section 3.2.1, Table 1）。
4. **第 4 頁：GPT-3 與 In-Context Learning（Few-Shot）**
   - 範式轉移：不更新參數量（No Gradient Updates / No Fine-Tuning），純靠 Prompt 上下文範例提示。
   - 實驗數據：TriviaQA 0-shot 64.3% ➔ Few-shot 71.2%；兩位數加法 0-shot 76.9% ➔ Few-shot 100%；WiC 49.4%（等同隨機猜測，客觀反映模型局限）。
   - 引用來源：`wiki/language_models_are_few_shot_learners.md`（Brown et al., 2020, Section 3, Table 3.3, Figure 3.10）。
5. **第 5 頁：ReAct：推理與行動結合架構**
   - 核心問題：Reasoning-only（CoT）易產生幻覺與資訊未更新；Acting-only 缺乏宏觀規劃能力。
   - 實驗結果：HotpotQA 抽樣 50 筆錯誤中 ReAct 幻覺率為 0%（CoT 達 56%）；ALFWorld 成功率 34 提高至 45；強調 ReAct 需與 CoT-SC 結合方達最優 (35.1 EM vs 27.4 EM)。
   - 引用來源：`wiki/react_reasoning_and_acting.md`（Yao et al., 2022, Section 3, Table 1, Table 2, Figure 4）。
6. **第 6 頁：ReAct 運作循環：Thought → Action → Observation**
   - 運作閉環：Thought（思考規劃）➔ Action（呼叫環境 API / Search）➔ Observation（接收環境反饋）➔ Thought...
   - 實例展示：HotpotQA「科羅拉多造山運動高地高度」三步檢索與推論過程。
   - 引用來源：`wiki/react_reasoning_and_acting.md`（Yao et al., 2022, Section 3, Figure 1(b)）。
7. **第 7 頁：Toolformer：讓語言模型自學使用工具**
   - 核心方法：自監督自我學習（Self-Supervised），利用 API 標籤與損失差值過濾（$L_i^- - L_i^+ \ge \tau_f$）自動過濾有用工具呼叫。
   - 實驗表現：CCNet 6.7B 模型在 ASDiv 數學推理上達到 40.4（大幅超越 GPT-3 175B 的 14.0）；客觀指出其僅限於零樣本上下文無交互呼叫。
   - 引用來源：`wiki/toolformer.md`（Schick et al., 2023, Section 2, Table 2）。
8. **第 8 頁：RAG：檢索增強生成架構**
   - 混合記憶架構：參數化記憶（BART 生成器）+ 非參數化記憶（DPR 密集向量檢索 Wikipedia 2,100 萬篇段落）。
   - 雙模型與熱插拔：RAG-Sequence（整句同一文檔）vs RAG-Token（逐字跨文檔注意力混合）；知識更新僅需更換 Index（2016 vs 2018 領袖試驗 70% vs 68% 準確率）；客觀指出 RAG 雖大幅降低但無法保證 100% 根除幻覺。
   - 引用來源：`wiki/retrieval_augmented_generation.md`（Lewis et al., 2020, Section 2, Table 1, Table 2, Figure 1）。
9. **第 9 頁：技術架構橫向對比：ReAct vs Toolformer vs RAG**
   - 完整對比維度：核心目標、工具/知識調用方式、學習與訓練機制、即時交互能力、主要優點與代表性限制。
   - 引用來源：`wiki/index.md` 核心架構對比表。
10. **第 10 頁：總結、學習路徑與參考文獻**
    - 學習建議：從 Prompt 使用者跨越到架構設計者。
    - 完整文獻清單：五篇權威論文完整中繼資料（標題、作者群、年份、arXiv 官方連結）。
    - 引用來源：`wiki/index.md` 總體目錄。

---

### 2. 品質檢查報告 (QA Report - Phase 3)

#### 2.1 程式與技術檢查 (Code & Technical Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **HTML 語法與標籤完整性** | 標準 HTML5，無未閉合標籤或解析錯誤 | ✅ 通過 | 經 Python `html.parser` 逐行驗證，所有標籤完全對稱閉合 |
| **CSS 樣式與排版** | 響應式排版、支援深色主題、進度條 | ✅ 通過 | 支援各尺寸螢幕，視覺排版層次清晰，無溢出截斷 |
| **JavaScript 語法與邏輯** | 無語法錯誤，完整鍵盤/按鈕/滑動/Hash 控制 | ✅ 通過 | 經 `node -c` 語法檢驗 0 錯誤；支援鍵盤、左右箭頭、空格鍵翻頁與頁碼即時更新 |
| **內部連結與安全掃描** | 論文超連結正確無失效，無 API Key 或機密資料 | ✅ 通過 | 5 篇 arXiv 論文官方連結齊全且正確；掃描無任何敏感金鑰 |
| **單機獨立運作性** | 本地直接開啟或標準 HTTP 伺服器運作無外部依賴 | ✅ 通過 | 採用原生標準 Web 技術（原生 SVG 圖解、Unicode 數學符號），無第三方外部 CDN 依賴阻斷風險 |

#### 2.2 內容忠實度檢查 (Content Faithfulness Checks)
| 檢查項目 | 檢查標準 | 檢查結果 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **資訊來源限制遵守** | 內容 100% 取自 Wiki 5 篇條目與 `index.md` | ✅ 通過 | 嚴格未引入未經驗證之外部假設或未收錄模型 |
| **公式嚴謹性** | Self-Attention 公式分母嚴格使用 $\sqrt{d_k}$ | ✅ 通過 | 第 3 頁明確標註 $\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ 且標明 $d_k=64$ 維度縮放原理 |
| **實驗數據忠實度** | 實驗數據皆出自原論文，無誇大或斷章取義 | ✅ 通過 | TriviaQA (64.3% vs 71.2%)、兩位數加法 (76.9% vs 100%)、WiC (49.4%)、ReAct 50 筆錯誤分析 (0% vs 56%)、Toolformer ASDiv (40.4 vs 14.0)、RAG Hot-swapping (70% vs 68%) 全數吻合 |
| **客觀性與限制陳述** | 忠實陳述各方法局限性與邊界條件 | ✅ 通過 | 清楚註記：ReAct 單獨使用時需要 CoT-SC 互補、Toolformer 僅為零樣本不可互動呼叫、RAG 無法保證 100% 根除幻覺 |
| **概念標記清晰度** | 綜合工程架構明確標示教學抽象示意 | ✅ 通過 | 第 2 頁、第 9 頁與第 10 頁清楚標註 `【教學概念示意】`，區分單一論文原創與現代工程整合架構 |

---

### 3. 真實瀏覽器渲染與互動驗證 (Browser Verification)
* **測試方式**：透過內建 Web 瀏覽器子代理實際存取本地服務（`http://localhost:8888`）。
* **測試結果**：
  1. **首頁載入**：頁面標題正確顯示為《從大型語言模型（LLM）到 AI Agents 與 RAG》，投影片計數器正確初始化為 `1 / 10`。
  2. **按鈕翻頁驗證**：點擊「下一頁 ❯」按鈕，投影片平滑切換至第 2 頁（計數器即時更新為 `2 / 10`，URL Hash 更新為 `#slide-2`）；再次點擊切換至第 3 頁（`#slide-3`）。
  3. **公式渲染驗證**：第 3 頁 Self-Attention 核心公式 `Attention(Q, K, V) = softmax( (Q Kᵀ) / √dₖ ) V` 渲染清晰無異常，分母清楚顯示為 $\sqrt{d_k}$。
  4. **主控台檢查**：Console 錯誤數為 0，網路資源請求錯誤數為 0。
  5. **版面狀態**：字體排版、卡片陰影、SVG 流程圖及進度條皆正常呈現，無文字溢出或按鈕失效情況。

---

### 4. 自動修復歷程 (Revision History - Phase 3)
* **自動修正輪數**：第 0 輪（大綱經嚴格審核後，一次性產出完整合規代碼與內容，程式與忠實度雙重檢核 100% 通過）。
* **待驗證標記 (Unverified Items)**：0 項。

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
* **教學簡報成果產出**：
  1. `slides/index.html`（10 頁繁體中文 HTML 教學簡報）
  2. `slides/style.css`（現代深色主題、響應式樣式表）
  3. `slides/script.js`（鍵盤/滑動/按鈕互動腳本）
