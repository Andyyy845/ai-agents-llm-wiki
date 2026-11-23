# AI Agents 與大型語言模型（LLM）Wiki 目錄索引

歡迎使用「AI Agents 與大型語言模型（LLM）Wiki」知識庫。本知識庫旨在以嚴謹的學術論文為基礎，系統化整理 LLM、AI Agents 及 RAG 的核心技術脈絡，並作為後續產出新手教學 HTML 簡報的權威知識來源。

---

## 📚 已收錄論文條目清單 (Ingested Papers)

目前累計收錄篇數：**5 篇**（已達成專案標準：至少收錄 5 篇核心學術論文）。

| 編號 | 論文名稱 (Title) | 核心領域 | 發表年份 | 作者群 | Wiki 條目 | 原始文獻 |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| 01 | **Attention Is All You Need** | Transformer / Attention Mechanism | 2017 | Ashish Vaswani 等人 | [詳細條目](attention_is_all_you_need.md) | [PDF 原始檔](../raw/attention_is_all_you_need.pdf) / [arXiv](https://arxiv.org/abs/1706.03762) |
| 02 | **Language Models are Few-Shot Learners** | GPT-3 / In-Context Learning / Scaling | 2020 | Tom B. Brown 等人 (OpenAI) | [詳細條目](language_models_are_few_shot_learners.md) | [PDF 原始檔](../raw/language_models_are_few_shot_learners.pdf) / [arXiv](https://arxiv.org/abs/2005.14165) |
| 03 | **ReAct: Synergizing Reasoning and Acting in Language Models** | AI Agents / Reasoning Loop / Decision Making | 2022 | Shunyu Yao 等人 (Princeton & Google) | [詳細條目](react_reasoning_and_acting.md) | [PDF 原始檔](../raw/react_reasoning_and_acting.pdf) / [arXiv](https://arxiv.org/abs/2210.03629) |
| 04 | **Toolformer: Language Models Can Teach Themselves to Use Tools** | Tool Use / Self-Supervised Learning / API Calling | 2023 | Timo Schick 等人 (Meta AI) | [詳細條目](toolformer.md) | [PDF 原始檔](../raw/toolformer.pdf) / [arXiv](https://arxiv.org/abs/2302.04761) |
| 05 | **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** | RAG / Dense Retrieval / Hybrid Memory | 2020 | Patrick Lewis 等人 (FAIR) | [詳細條目](retrieval_augmented_generation.md) | [PDF 原始檔](../raw/retrieval_augmented_generation.pdf) / [arXiv](https://arxiv.org/abs/2005.11401) |

---

## 🧭 知識脈絡導航 (Knowledge Progression)

```
[現代 LLM 與 AI Agents 技術演進地圖]
  │
  ├── 1. Attention Is All You Need (2017)
  │      └── 【底層基石】：打破 RNN 序列限制，奠定 Transformer 與自注意力平行計算架構
  │
  ├── 2. Language Models are Few-Shot Learners (2020)
  │      └── 【能力湧現】：驗證 Scaling Laws 規模定律，確立 In-Context Learning 與 Few-Shot 提示典範
  │
  ├── 3. Retrieval-Augmented Generation (RAG) (2020)
  │      └── 【外掛記憶】：參數化（BART）+ 非參數化（DPR 維基索引），實現免重訓之知識熱插拔（Hot-swapping）
  │
  ├── 4. ReAct: Reasoning + Acting (2022)
  │      └── 【思維閉環】：以 Thought-Action-Observation 循環，在凍結模型下實現動態推理與環境互動
  │
  └── 5. Toolformer (2023)
         └── 【工具內嵌】：以自監督損失差值過濾，訓練模型自主決定何時呼叫 API 工具
```

---

## ⚖️ 三大進階架構辨析：RAG vs. ReAct vs. Toolformer

本專案收錄的三篇工具與外部資訊擴展經典論文，各自解決不同面向的問題：

| 比較維度 | RAG (檢索增強生成) | ReAct (推理與行動協同) | Toolformer (自監督工具呼叫) |
| :--- | :--- | :--- | :--- |
| **核心目標** | 解決知識過期與記憶容量問題，提供外部可信事實依據 | 解決複雜任務規劃與幻覺問題，實現多步動態決策 | 解決計算、日期等固有缺陷，使模型自主學會調用 API |
| **記憶/工具機制** | 參數化記憶（BART）+ 非參數化記憶（DPR 稠密向量索引） | 外部環境 API（搜尋、點擊、觀察），透過 Prompting 驅動 | 透過特殊的 API Token 內嵌於模型詞彙與文字預測中 |
| **模型狀態** | 端到端聯合微調（BERT_q + BART） | 凍結大模型（PaLM / GPT-3），純靠上下文提示 | 自監督資料擴增後微調模型（GPT-J 6.7B） |
| **互動形式** | 一次性檢索 Top-K 文檔後融合生成 | 多輪 `Thought ➔ Action ➔ Observation` 閉環 | 生成到 `$\to$` 時中斷解碼，插入單一工具結果後接續 |
| **典型場景** | 企業知識庫、法規查核、文檔問答（ChatPDF） | 具身導航（ALFWorld）、多跳深度推論、網頁下單 | 數學計算器、時間日曆查詢、機器翻譯轉換 |

---

## 📝 執行日誌與維護
* 完整 Ingest 與檢核歷程請參閱：[wiki/log.md](log.md)
* 系統協作規範與回退機制請參閱：[AGENTS.md](../AGENTS.md)
