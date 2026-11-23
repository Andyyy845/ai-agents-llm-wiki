# Language Models are Few-Shot Learners (GPT-3)

## 1. 論文中繼資料 (Metadata)
* **論文標題 (Title)**：Language Models are Few-Shot Learners
* **作者群 (Authors)**：Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Sandhini Agarwal, Ariel Herbert-Voss, Gretchen Krueger, Tom Henighan, Rewon Child, Aditya Ramesh, Daniel M. Ziegler, Jeffrey Wu, Clemens Winter, Christopher Hesse, Mark Chen, Eric Sigler, Mateusz Litwin, Scott Gray, Benjamin Chess, Jack Clark, Christopher Berner, Sam McCandlish, Alec Radford, Ilya Sutskever, Dario Amodei (OpenAI)
* **發表年份 (Year)**：2020 年（arXiv:2005.14165）
* **來源網址 (Source URL)**：[https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165)
* **原始 PDF 檔案**：[`raw/language_models_are_few_shot_learners.pdf`](../raw/language_models_are_few_shot_learners.pdf)

---

## 2. 研究背景與目的 (Background & Objective)
* **微調典範的局限 (Limitations of Fine-Tuning Paradigm)**：
  在 NLP 領域中，主流做法為「預訓練 + 微調」（Pre-training + Fine-tuning，如 BERT、RoBERTa、T5）。儘管模型架構在不同任務間通用，但要解決具體任務仍必須仰賴包含數千至數萬筆標註資料的專屬資料集進行梯度更新（Gradient Updates）。這帶來諸多限制（第 1 節，第 3 頁）：
  1. 收集大規模標註資料昂貴且耗時。
  2. 微調容易過度擬合特定狹窄的分佈，利用資料中的虛假關聯（Spurious Correlations），泛化能力差。
  3. 人類不需要幾萬次訓練才能學習新語言任務，往往僅憑簡短指令或少量範例即可理解並執行。
* **研究核心目的**：
  提出 **GPT-3**（最大達 1,750 億參數），探討在**不進行任何梯度更新或模型微調**的條件下，僅透過純文字提示進行上下文學習（**In-Context Learning**），模型在 Zero-Shot、One-Shot 與 Few-Shot 設定下能否匹敵甚至超越既有專門微調的 SOTA 模型（第 1 節，第 3-5 頁）。

---

## 3. 核心技術與研究方法 (Core Methodology & Architecture)

### 3.1 模型架構 (Model Architecture)
* 採用與 GPT-2 相同的自迴歸（Autoregressive）、Decoder-only Transformer 架構，包含改良的初始化、預正規化（Pre-normalization）與可逆分詞法（Reversible Tokenization），並引入局部稀疏注意力（Sparse Transformer 樣式，交替使用 Dense 與 Locally Banded Sparse Attention）（第 2.1 節，第 8 頁）。
* 測試了 8 種不同規模的模型，參數量由 1.25 億橫跨至 1,750 億（第 2.1 節，表 2.1，第 8 頁）：
  * **GPT-3 175B（完整版）**：96 層（Layers）、隱藏層維度 $d_{\text{model}} = 12,288$、96 個注意力頭（$d_{\text{head}} = 128$）、上下文長度 $n_{\text{ctx}} = 2048$ 個 Token、批次大小 3.2M Tokens。

### 3.2 訓練資料集與品質篩選 (Training Dataset)
總計訓練 3,000 億（300B）Tokens，資料集依品質權重加權取樣（第 2.2 節，表 2.2，第 8-9 頁）：
* **Filtered Common Crawl**：4,100 億 Tokens（權重佔比 60%，經過濾器與 MinHashLSH 模糊去重）。
* **WebText2**：190 億 Tokens（權重佔比 22%）。
* **Books1**：120 億 Tokens（權重佔比 8%）。
* **Books2**：550 億 Tokens（權重佔比 8%）。
* **Wikipedia**：30 億 Tokens（權重佔比 3%）。

### 3.3 上下文學習的三種評估設定 (In-Context Learning Paradigms)
在推論階段完全不調整模型權重，僅透過 Context 輸入（第 2 節，圖 2.1，第 6-7 頁）：
1. **Few-Shot (FS)**：提供任務自然語言說明，加上 $K$ 組範例（通常 $K = 10 \sim 100$，受限於 2048 Token 窗口），最後給出問題請求模型補全。
2. **One-Shot (1S)**：僅提供任務自然語言說明與 1 組示範範例。
3. **Zero-Shot (0S)**：僅給予任務說明指令，不提供任何範例。

---

## 4. 主要研究發現與實驗成果 (Key Findings & Experiments)

* **規模定律與上下文學習 (Scaling Laws for In-Context Learning)**：
  * 模型的交叉熵驗證損失（Cross-entropy Validation Loss）與計算量嚴格遵循冪律關係（Power-law）（第 3 節，圖 3.1，第 10-11 頁）。
  * 參數量越大，Few-Shot 帶來的效能增益斜率越陡峭，顯示大模型具備更強的 In-Context 學習適應能力（第 1 節，圖 1.2、圖 1.3，第 4-5 頁）。
* **封閉式問答 (Closed Book QA)**：
  * **TriviaQA**：GPT-3 175B 在 Zero-Shot 達 64.3%、One-Shot 達 68.0%、Few-Shot 達 **71.2%**，超越了經微調的 T5-11B（60.5%），並匹敵利用 2,100 萬筆文本索引進行外部檢索輔助的 RAG 模型（68.0%）（第 3.2 節，表 3.3，第 13 頁）。
* **文本補全與語言建模 (Completion & Language Modeling)**：
  * **LAMBADA**：Few-Shot 準確率達 **86.4%**，將 SOTA 提升了 18%（第 3.1.2 節，表 3.2，第 12 頁）。
* **通用基準測試 (SuperGLUE Benchmark)**：
  * GPT-3 175B Few-Shot 平均得分達 **71.8**，在僅使用 32 個範例且不微調的情況下，超越了完整微調的 BERT-Large（69.0），在 COPA 上取得 92.0% 逼近 SOTA（第 3.7 節，表 3.8，第 19 頁）。
* **即時推理與符號操作 (On-the-fly Reasoning & Synthetic Tasks)**：
  * **基礎四則運算**：在 Few-Shot 下，2 位數加法達 100% 準確率、2 位數減法達 98.9%、3 位數加減法達 80%~94%（第 3.9.1 節，表 3.9，第 21-23 頁）。
  * **SAT 類比題 (SAT Analogies)**：Few-Shot 準確率達 65.2%，超越美國大學考生平均的 57%（第 3.9.3 節，第 24-25 頁）。
  * **新聞文章生成**：人類受試者辨識 GPT-3 175B 生成文章（約 200 字）與真實新聞的正確率僅為 **52%**（接近隨機猜測的 50%）（第 3.9.4 節，表 3.11，第 25-27 頁）。

---

## 5. 研究限制與挑戰 (Limitations & Challenges)

1. **結構性任務瓶頸 (Comparison & Bi-directional Weaknesses)**：
   * 由於自迴歸架構無法雙向理解上下文，在需前後對照的自然語言推論任務（NLI，如 ANLI、RTE）與字詞上下文一致性任務（WiC，準確率僅 49.4%，與隨機猜測無異）表現貧弱（第 3.7-3.8 節，第 20-21 頁；第 5 節，第 33 頁）。
2. **常識物理推論缺陷 (Common Sense Physics)**：
   * 在涉及日常生活物理機制的常識推理時常出現愚蠢錯誤（例如：「如果我把乳酪放進冰箱，它會融化嗎？」）（第 5 節，第 33 頁）。
3. **長篇幻覺與前後矛盾 (Hallucination & Incoherence)**：
   * 在生成長文本時，容易出現自我矛盾、語意重複與脫離邏輯主題的現象（第 5 節，第 33 頁）。
4. **缺乏實體經驗錨定 (Lack of Grounding)**：
   * 僅仰賴文字預測目標，缺乏影像、物理互動或真實世界經驗支撐（第 5 節，第 34 頁）。
5. **推論運算成本極高 (Inference Cost)**：
   * 1,750 億參數使得日常推論需要龐大 GPU 叢集，延遲與成本均不利於一般即時部署（第 5 節，第 34 頁）。
6. **社會偏見與資料污染風險 (Bias & Contamination)**：
   * 網路爬蟲資料帶有性別、種族、宗教偏見（例如職業關聯偏向男性、特定宗教與負面詞彙共現率高）（第 6 節，第 34-39 頁）。
   * 部分測試資料集在預訓練資料中有微量洩漏（第 4 節，第 29-33 頁）。

---

## 6. 新手教學導讀：給大學生的繁體中文圖解概念 (Beginner-Friendly Explanation)

### 6.1 生活化比喻：請家教微調 vs 給實習生示範 (Fine-Tuning vs Few-Shot)
* **微調 (Fine-Tuning)**：
  就像送一個已經讀完大學的大腦去讀 2 年法律碩士（耗費大量心力進行梯度更新）。他雖然專精這門科目，但成本高昂，且可能因此遺忘其他技能。
* **Few-Shot Prompting（上下文學習）**：
  就像給一個資質聰穎的實習生交代任務時說：「你幫我把信件分類。例如『信件 A $\to$ 緊急』、『信件 B $\to$ 廣告』。請分類這封新信件：『……』」。
  實習生的大腦結構完全沒有被動手術改寫（Zero Gradient Updates），只是照著你剛給的 2 個範例現學現賣。

### 6.2 與現代 ChatGPT 的核心血緣
這篇論文確立了**「只要模型夠大，你根本不需要重寫程式或微調模型，只要會寫 Prompt 給範例，AI 就能完成任務」**的現代 Prompt Engineering 基礎，也是 ChatGPT 具備通用對話與遵循指令能力的最關鍵里程碑。

---

## 7. 後續 HTML 簡報重點引用 (Takeaways for Presentation)
1. **三大學習設定圖解**：Zero-Shot（純指令）、One-Shot（指令 + 1 範例）、Few-Shot（指令 + 數個範例）。
2. **核心觀念**：In-Context Learning 不更新任何模型權重（No Gradient Updates）。
3. **經典實驗佐證**：
   - 參數量從 125M 到 175B，Few-Shot 帶來爆發性成長。
   - TriviaQA 封閉式問答打破未微調模型的紀錄。
   - SAT 類比題超越人類考生平均水準。
4. **不可忽視的限制**：雙向比較任務極弱（WiC 隨機猜測水準）、缺乏常識物理理解、高昂的推論成本。
