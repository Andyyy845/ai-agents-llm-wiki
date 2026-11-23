# AI Agents 與大型語言模型（LLM）Wiki 目錄索引

歡迎使用「AI Agents 與大型語言模型（LLM）Wiki」知識庫。本知識庫旨在以嚴謹的學術論文為基礎，系統化整理 LLM、AI Agents 及 RAG 的核心技術脈絡，並作為後續產出新手教學 HTML 簡報的權威知識來源。

---

## 📚 已收錄論文條目清單 (Ingested Papers)

目前累計收錄篇數：**4 篇**（本專案目標：至少 5 篇核心學術論文）。

| 編號 | 論文名稱 (Title) | 核心領域 | 發表年份 | 作者群 | Wiki 條目 | 原始文獻 |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| 01 | **Attention Is All You Need** | Transformer / Attention Mechanism | 2017 | Ashish Vaswani 等人 | [詳細條目](attention_is_all_you_need.md) | [PDF 原始檔](../raw/attention_is_all_you_need.pdf) / [arXiv](https://arxiv.org/abs/1706.03762) |
| 02 | **Language Models are Few-Shot Learners** | GPT-3 / In-Context Learning / Scaling | 2020 | Tom B. Brown 等人 (OpenAI) | [詳細條目](language_models_are_few_shot_learners.md) | [PDF 原始檔](../raw/language_models_are_few_shot_learners.pdf) / [arXiv](https://arxiv.org/abs/2005.14165) |
| 03 | **ReAct: Synergizing Reasoning and Acting in Language Models** | AI Agents / Reasoning Loop / Decision Making | 2022 | Shunyu Yao 等人 (Princeton & Google) | [詳細條目](react_reasoning_and_acting.md) | [PDF 原始檔](../raw/react_reasoning_and_acting.pdf) / [arXiv](https://arxiv.org/abs/2210.03629) |
| 04 | **Toolformer: Language Models Can Teach Themselves to Use Tools** | Tool Use / Self-Supervised Learning / API Calling | 2023 | Timo Schick 等人 (Meta AI) | [詳細條目](toolformer.md) | [PDF 原始檔](../raw/toolformer.pdf) / [arXiv](https://arxiv.org/abs/2302.04761) |

---

## 🧭 知識脈絡導航 (Knowledge Progression)

```
[現代 LLM 與 Agent 技術演進史]
  │
  ├── 1. Attention Is All You Need (2017)
  │      └── 基礎架構突破：顛覆 RNN/CNN，確立 Transformer 與 Self-Attention 核心地位
  │
  ├── 2. Language Models are Few-Shot Learners (2020)
  │      └── 模型規模擴展：發現 Scaling Law，開創 Prompting 與 In-Context Learning 典範
  │
  └── [走向外部世界與自主行動：AI Agents 的兩大工具路徑]
         │
         ├── 3. ReAct: Reasoning + Acting (2022) ──【提示階段的思考代理循環】
         │      └── 凍結大模型 + In-Context Prompting：透過 Thought-Action-Observation 閉環動態規劃
         │
         └── 4. Toolformer: Self-Supervised Tool Use (2023) ──【訓練階段的工具微調內嵌】
                └── 權重微調 + 自監督損失過濾：讓模型在文字預測中自主學會插入 API 呼叫
```

---

## ⚖️ 核心技術對比：ReAct vs. Toolformer (重要概念區分)

在 AI Agents 與工具調用領域，ReAct 與 Toolformer 常被提及，但兩者在**運作層級、模型狀態與執行架構**上有著根本性差異，不可混為一談：

| 比較維度 | ReAct (Reasoning + Acting) | Toolformer (Self-Supervised Tool Calling) |
| :--- | :--- | :--- |
| **技術定位** | **動態推理與多步驟決策工作流程 (Workflow)** | **模型層級的自監督工具呼叫學習 (Training Method)** |
| **模型狀態** | **凍結模型 (Frozen LLM)**，無需更新權重 | **微調模型 (Finetuned LLM)**，更新模型權重 |
| **執行機制** | **In-Context 提示工程**（提供少數範例引導） | **自監督訓練**（利用損失差值 $L^- - L^+ \ge \tau_f$ 篩選語料） |
| **核心互動迴圈** | `Thought ➔ Action ➔ Observation ➔ Thought` 多輪迭代 | 單向文字生成時，自主輸出 `<API>` 並在 `$\to$` 中斷等待結果插入 |
| **思維透明度** | **高**：明確輸出語言形式的「思考歷程（Thought）」 | **無**：直接預測是否呼叫 API，無中間自然語言思維鏈 |
| **多步驟鏈式調用** | **支援**：可根據前一次結果動態決定下一步行動 | **不支援**：API 獨立生成，無法將 A 工具輸出作為 B 工具輸入 |
| **主要應用場景** | 複雜多跳問答（HotpotQA）、文字遊戲（ALFWorld）、網頁購物（WebShop） | 基礎常規運算（Calculator）、維基實體檢索、機器翻譯、行事曆日期 |

---

## 📝 執行日誌與維護
* 完整 Ingest 與檢核歷程請參閱：[wiki/log.md](log.md)
* 系統協作規範與回退機制請參閱：[AGENTS.md](../AGENTS.md)
