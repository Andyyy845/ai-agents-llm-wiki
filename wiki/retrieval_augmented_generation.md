# Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (RAG)

## 1. 論文中繼資料 (Metadata)
* **論文標題 (Title)**：Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
* **作者群 (Authors)**：Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela（Facebook AI Research, University College London, New York University）
* **發表年份 (Year)**：2020 年（NeurIPS 2020，arXiv:2005.11401v4）
* **來源網址 (Source URL)**：[https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)
* **原始 PDF 檔案**：[`raw/retrieval_augmented_generation.pdf`](../raw/retrieval_augmented_generation.pdf)

---

## 2. 研究背景與目的 (Background & Objective)
* **純參數化記憶（Parametric-only Memory）的瓶頸**：
  預訓練神經語言模型（如 T5、BART、GPT）將事實知識隱式存儲在模型權重中（作為參數化知識庫）。然而，這種純參數化記憶面臨三大根本限制（第 1 節，第 1 頁）：
  1. **難以精確擴展與更新（Knowledge Update & Expansion）**：若世界事實發生變化（如國家領袖換屆），必須重新訓練或微調整個神經網路。
  2. **缺乏決策溯源性（Lack of Provenance & Interpretability）**：無法直接檢查模型答案依據哪一份文獻。
  3. **事實性幻覺（Factual Hallucination）**：在知識密集型任務（Knowledge-Intensive Tasks）中容易編造看似合理但錯誤的內容。
* **既有檢索增強模型的侷限**：
  先前結合可微分檢索器（Differentiable Retriever）的模型（如 REALM、ORQA）大多僅探索「抽取式問答（Extractive QA）」，限制了模型處理摘要、生成與抽象推論的靈活性（第 1 節，第 1-2 頁）。
* **研究核心目的**：
  提出一種通用的端到端微調處方——**檢索增強生成（Retrieval-Augmented Generation, RAG）**，將**預訓練參數化記憶（Seq2Seq 生成器 BART）**與**非參數化記憶（基於 DPR 的維基百科稠密向量索引）**緊密結合，使語言模型能夠動態檢索外部知識並生成更加精確、豐富且具備溯源依據的文字（第 1-2 節，第 1-3 頁）。

---

## 3. 核心技術架構與數學表徵 (Core Architecture & Methodology)

RAG 整合了兩大神經組件，並以端到端（End-to-End）方式聯合訓練（第 2 節，圖 1，第 2-3 頁）：

```
[輸入查詢 x] 
    │
    ├──► [查詢編碼器 Query Encoder: BERT_q] ──► q(x)
    │                                            │
    │     [維基百科稠密向量索引: 2,100 萬篇] ◄───┴──► (MIPS 最大內積檢索)
    │                                                   │
    │                                                   ▼ 取得 Top-K 文本片段 z
    │                                                   │
    └──► [Seq2Seq 生成器: BART-large] ◄─────────────────┘
                │
                ▼ (邊緣化機率計算：RAG-Sequence 或 RAG-Token)
        [最終生成答案序列 y]
```

### 3.1 兩大記憶組件
1. **非參數化記憶（Non-parametric Memory，檢索器 DPR）**：
   * 基於稠密段落檢索（Dense Passage Retriever, DPR，Karpukhin et al., 2020）。
   * 檢索機率定義為雙編碼器（Bi-encoder）點積之 Softmax：
     $$p_\eta(z|x) \propto \exp\left(d(z)^T q(x)\right)$$
     其中 $d(z) = \text{BERT}_d(z)$ 為文檔編碼器，$q(x) = \text{BERT}_q(x)$ 為查詢編碼器。
   * 索引涵蓋 2018 年 12 月的 Wikipedia Dump，切分為 2,100 萬個 100 字片段，使用 FAISS 構建 HNSW 稠密向量索引，於亞線性時間內完成最大內積搜尋（MIPS）（第 2.2 節，第 3 頁；第 3 節，第 4 頁）。
2. **參數化記憶（Parametric Memory，生成器 BART）**：
   * 採用 4 億參數的預訓練 Seq2Seq 模型 BART-large（Lewis et al., 2019）。
   * 輸入為原始查詢 $x$ 與檢索文檔 $z$ 的簡單拼接（Concatenation），計算生成機率 $p_\theta(y_i|x, z, y_{1:i-1})$（第 2.3 節，第 3 頁）。

### 3.2 兩大 RAG 機率表徵形式 (RAG Formulations)
RAG 將檢索文檔 $z$ 視為潛在變數（Latent Variable），並提出兩種不同的邊緣化（Marginalization）計算方式（第 2.1 節，第 3 頁）：

#### 1. RAG-Sequence 模型（整句單一文檔假定）
假定整句生成答案 $y$ 均來自同一個檢索文檔 $z$。先對各文檔計算完整的序列生成機率，再進行邊緣化加總：

$$p_{\text{RAG-Sequence}}(y|x) \approx \sum_{z \in \text{top-}k(p(\cdot|x))} p_\eta(z|x) \prod_{i=1}^N p_\theta(y_i|x, z, y_{1:i-1})$$

* **解碼策略（Section 2.5，第 4 頁）**：
  * **Thorough Decoding**：對每個檢索文檔分別進行 Beam Search，收集候選集合 $Y$，再對未產生該候選的文檔補算前向傳播機率並加總。
  * **Fast Decoding**：近似假定未在 Beam Search 中被生成的假設機率為 0，避免額外前向運算。

#### 2. RAG-Token 模型（逐字跨文檔自由切換）
允許在生成序列中的**每一個 Token $y_i$ 時，參考不同的檢索文檔**。這使得生成器能夠綜合多篇文檔的內容組裝出答案：

$$p_{\text{RAG-Token}}(y|x) \approx \prod_{i=1}^N \sum_{z \in \text{top-}k(p(\cdot|x))} p_\eta(z|x) p_\theta(y_i|x, z, y_{1:i-1})$$

* **解碼策略**：可將邊緣化後的轉移機率直接代入標準的 Beam Search 解碼器。

### 3.3 聯合訓練機制 (Training Setup)
* 以負對數邊緣概似（Negative Marginal Log-Likelihood）$-\sum_j \log p(y_j|x_j)$ 為目標，不需任何標註「應檢索哪篇文檔」的直接監督訊號。
* **訓練效率設計**：訓練過程中固定文檔編碼器 $\text{BERT}_d$ 與文檔索引（避免重複建立 2,100 萬篇索引的高昂成本），僅微調查詢編碼器 $\text{BERT}_q$ 與生成器 BART（第 2.4 節，第 3-4 頁）。

---

## 4. 主要實驗成果 (Key Experimental Results)

### 4.1 開放領域問答 (Open-Domain QA) 奪得全項 SOTA
在四大基準資料集上，RAG 全面刷新最佳紀錄（第 4.1 節，表 1，第 6 頁）：
* **Natural Questions (NQ)**：RAG-Seq 達 **44.5 EM**，擊敗封閉式大模型 T5-11B（34.5 EM）、抽取式模型 REALM（40.4 EM）與 DPR（41.5 EM）。
* **TriviaQA (TQA)**：RAG-Seq 達 **68.0 EM**（Wiki split），超越 T5-11B+SSM（60.5 EM）。
* **WebQuestions (WQ)**：RAG-Token 達 **45.5 EM**。
* **CuratedTrec (CT)**：RAG-Seq 達 **52.2 EM**。
* **超越抽取式極限**：當檢索到的前 $k$ 篇文檔中「完全未出現精確答案」時，抽取式模型得分為 0%，而 RAG 仍能從線索中推理生成正確答案，在 NQ 達到 **11.8% 準確率**（第 4.1 節，第 6 頁）。

### 4.2 知識密集型生成：顯著降低幻覺、提升多樣性
* **MS-MARCO NLG**：RAG-Seq 取得 40.8 Rouge-L 與 44.2 Bleu-1，超越參數化基準 BART（38.2 / 41.6）（第 4.2 節，表 2，第 6 頁）。
* **Jeopardy 知識問答生成**：人類評估顯示，在 452 組比較中，**42.7% 的案例認為 RAG 比 BART 更具真實性（Factual）**，僅 7.1% 認為 BART 較佳（第 4.3 節，表 4，第 8 頁）。
* **FEVER 事實查核**：在未接受任何檢索監督的情況下，RAG 3 分類準確率達 72.5%、2 分類達 89.5%，逼近經複雜管道工程監督訓練之專屬 SOTA（第 4.4 節，表 2，第 6 頁）。

### 4.3 知識熱插拔（Index Hot-Swapping）：免重訓更新世界知識
論文進行了經典實驗：將 2016 年維基百科索引直接替換為 2018 年索引（不對模型權重進行任何訓練）（第 4.5 節，第 7-8 頁）：
* 針對世界領導人更迭問題（82 位領袖），替換為 2018 索引後，回答 2018 領袖的正確率達 **68%**（若錯配 2016 索引則準確率暴跌至 4%~12%）。
* **結論**：證實 RAG 具備**即時替換非參數化記憶即可更新模型知識庫**的絕佳特性。

---

## 5. 研究限制 (Limitations)
1. **檢索崩潰現象 (Retrieval Collapse)**：
   在序列目標較長的任務（如故事生成）中，檢索梯度可能變得不具資訊量，導致檢索器學會對所有輸入檢索相同文檔，使模型退化為純 BART（附錄 H，第 19 頁）。
2. **外部知識庫偏見與錯誤傳遞**：
   RAG 生成的真實度受限於檢索來源。若維基百科本身存在錯誤、偏見或過時資訊，模型將如實反映並傳播（第 6 節、社會影響，第 10 頁）。
3. **向量索引龐大記憶體開銷**：
   2,100 萬篇維基百科向量索引未壓縮時需約 100 GB CPU 記憶體，經 FAISS 壓縮後仍需約 36 GB，部署硬體門檻高於一般純生成模型（附錄 C，第 17 頁）。
4. **文檔編碼器固定帶來的次優性**：
   為了計算可行性，訓練時凍結了文檔編碼器 $\text{BERT}_d$，無法根據具體下游任務雙向微調文本表示（第 2.4 節，第 4 頁）。

---

## 6. 給大學生的繁體中文導讀：生活化圖解概念 (Beginner-Friendly Explanation)

### 6.1 比喻：閉卷考試 vs 開卷考試與專屬小抄
* **純參數模型（如未連網的 ChatGPT / 閉卷考試）**：
  就像學生進考場前把整本歷史書死背在腦子裡。如果老師問一個冷門日期，他可能記混了而自信地寫出錯誤年份（幻覺）。若教科書修訂版出版了，他必須重新讀完整本書（重新訓練）才能更新記憶。
* **RAG 模型（開卷考試 + 高速圖書檢索員）**：
  1. 學生（BART 生成器）帶著一本圖書館目錄走進考場。
  2. 看到考題「誰是 2024 年法國總統？」，身旁的高速檢索員（DPR）立刻在書架（非參數索引）翻出最新的百科全書段落放到他桌上。
  3. 學生閱讀最新段落後，精確寫下答案，並能附上書名與頁碼。
  4. 如果想要讓學生擁有最新知識，不需要對他的大腦動手術，**只要把桌上的百科全書抽換成今年最新版（Index Hot-Swapping）即可**！

### 6.2 與現代 AI 系統的血緣關係
如今企業內部使用的「私有知識庫問答」、「PDF 對話工具（如 ChatPDF）」以及各類連網搜尋聊天機器人，底層架構的核心全部源於這篇論文奠定的 RAG 概念。

---

## 7. 後續 HTML 簡報重點引用 (Takeaways for Presentation)
1. **RAG 核心公式圖解**：參數化記憶（BART）+ 非參數化記憶（DPR 稠密索引）。
2. **RAG-Sequence vs. RAG-Token**：
   - Sequence：一篇文章支撐整句回答（邏輯連貫）。
   - Token：每個詞可參考不同文章（多文檔資訊融合）。
3. **殺手級優勢：Index Hot-Swapping**：抽換向量資料庫即可更新知識，成本遠低於重新預訓練（Pre-training）或微調（Fine-tuning）。
4. **與 ReAct、Toolformer 的三足鼎立定位**：
   - ReAct：Agent 的多步思維與環境互動策略。
   - Toolformer：自主在文本中內嵌 API 調用。
   - RAG：專注於外掛大規模知識庫的高效生成檢索機制。
