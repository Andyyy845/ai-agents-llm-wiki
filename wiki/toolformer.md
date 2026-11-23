# Toolformer: Language Models Can Teach Themselves to Use Tools

## 1. 論文中繼資料 (Metadata)
* **論文標題 (Title)**：Toolformer: Language Models Can Teach Themselves to Use Tools
* **作者群 (Authors)**：Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta Raileanu, Maria Lomeli, Luke Zettlemoyer, Nicola Cancedda, Thomas Scialom（Meta AI Research & Universitat Pompeu Fabra）
* **發表年份 (Year)**：2023 年（arXiv:2302.04761v1）
* **來源網址 (Source URL)**：[https://arxiv.org/abs/2302.04761](https://arxiv.org/abs/2302.04761)
* **原始 PDF 檔案**：[`raw/toolformer.pdf`](../raw/toolformer.pdf)

---

## 2. 研究背景與目的 (Background & Objective)
* **大型語言模型的固有先天缺陷**：
  儘管 LLM 展現驚人的 Few-Shot 泛化能力，但其基礎自迴歸架構在面對一些基本功能時存在根本性障礙（第 1 節，第 1 頁）：
  1. **缺乏最新資訊（Temporal Blindness）**：無法獲取預訓練之後發生的近期事件，且缺乏時間推進感。
  2. **事實性幻覺（Factual Hallucination）**：對於精確的實體知識容易捏造事實。
  3. **精準計算能力匱乏（Arithmetic Weakness）**：神經網路無法像簡單計算機一樣穩定執行多位數四則運算。
  4. **低資源語言理解困難（Low-Resource Languages）**。
* **既有工具呼叫方法的瓶頸**：
  先前讓模型使用外部工具的方法，通常依賴**大量昂貴的人工標註（Human Annotations）**，或是**被侷限在特定任務的 Prompt 設定**中，無法讓模型自主決定「何時使用」、「呼叫哪種工具」與「如何傳遞參數」（第 1 節，第 1 頁）。
* **研究核心目的**：
  提出 **Toolformer**，透過**自監督學習（Self-Supervised Learning）**方式，僅需極少數人工範例示範 API 格式，讓語言模型自主在大規模語料中探索、生成潛在的 API 調用，並透過損失函數篩選出「確實有助於預測後續 Token」的呼叫資料，最終微調模型自身。使模型具備自主判斷何時呼叫、傳遞參數與整合 API 回傳結果的能力，且不損害模型原本的語言建模能力（第 1-2 節，第 1-3 頁）。

---

## 3. 核心方法與技術架構 (Core Methodology & Architecture)

### 3.1 基礎模型與 API 線性化表示
* **基底模型**：預訓練之 GPT-J（67 億參數，6.7B），並以 CCNet 子集作為語料 $C$（第 2、4.1 節，第 2-4 頁）。
* **線性化 API 表示法**：
  使用特殊字元標記 API 呼叫，不需修改詞彙表即可將 API 呼叫無縫嵌入純文字序列（第 2 節，第 2 頁）：
  $$e(c, r) = \text{<API>} \, a_c(i_c) \to r \, \text{</API>}$$
  * $a_c$：API 名稱（如 `Calculator`、`QA`、`WikiSearch`、`MT`、`Calendar`）。
  * $i_c$：輸入參數（如 `400 / 1400` 或 `"Who is the publisher of..."`）。
  * $r$：API 執行後回傳之純文字結果（如 `0.29`）。

### 3.2 自監督三步驟資料擴增管線 (Self-Supervised Pipeline)
整個訓練資料建立過程分為三個階段（第 2 節，圖 2、第 3 頁）：

```
[原始文字 x] 
    │
    ▼ (1. 取樣潛在呼叫：利用少數 Prompt 找出機率高於門檻的位置並取樣 API 參數)
[候選 API 調用 c]
    │
    ▼ (2. 執行 API：呼叫真實工具取得回傳結果 r)
[完整呼叫序列 e(c, r)]
    │
    ▼ (3. 交叉熵損失篩選：評估 L^- - L^+ >= τ_f)
[通過篩選的有利呼叫] ──► 嵌入原文本產生 C* ──► 微調 GPT-J
```

1. **取樣 API 呼叫 (Sampling API Calls)**：
   * 給予少量示範提示 $P(x)$，計算每個位置 $i$ 產生 `<API>` 的機率 $p_i$。保留 $p_i > \tau_s$ 的前 $k$ 個位置。
   * 自模型取樣生成 API 呼叫參數，直到生成 `</API>` 為止。
2. **執行 API 呼叫 (Executing API Calls)**：
   * 呼叫實際工具（如執行 Python 計算機腳本、呼叫 BM25 維基百科檢索器、調用 Atlas QA 模型、NLLB 翻譯模型或 Calendar 取得當前日期），取得文字結果 $r_i$。
3. **過濾 API 呼叫 (Filtering API Calls - 核心關鍵)**：
   * 定義在位置 $i$ 之後預測後續 Token 的加權交叉熵損失（Weighted Cross-Entropy Loss）$L_i$。
   * 比較兩種情境的損失：
     * $L_i^+$：將包含結果的 API 呼叫 $e(c_i, r_i)$ 作為前綴時，後續 Token 的預測損失。
     * $L_i^-$：未呼叫 API 或呼叫 API 卻沒有提供結果時的最低損失：$\min(L_i(\varepsilon), L_i(e(c_i, \varepsilon)))$。
   * **篩選門檻**：唯有當加入 API 結果後，預測損失降低量達到門檻時才予以保留：
     $$L_i^- - L_i^+ \ge \tau_f$$
   * 這確保了保留下來的 API 呼叫「真的能幫助模型更好地理解與預測下文」。

### 3.3 模型微調與推論中斷機制
* **微調 (Finetuning)**：將保留有 API 呼叫的文本 $C^*$ 與原始語料混合，以標準語言模型目標（Language Modeling Objective）微調 GPT-J。
* **推論中斷 (Inference Decoding)**：在生成文字時，一旦模型自主輸出 `$\to$` 標記，解碼立即中斷，系統呼叫對應 API，將回傳字串與 `</API>` 插入輸入流後，模型繼續進行後續生成（第 2 節，第 4 頁）。

---

## 4. 五大外部工具與實驗成果 (Tools & Experimental Results)

### 4.1 五大工具配置（第 3 節，表 1，第 4-5 頁）
1. **計算機 (Calculator)**：支援基礎四則運算，四捨五入至小數點後兩位。
2. **維基百科搜尋 (Wikipedia Search)**：基於 BM25 檢索器，檢索 KILT 維基百科文章片段。
3. **問答系統 (Question Answering)**：採用檢索增強模型 Atlas（Izacard et al., 2022）。
4. **機器翻譯 (Machine Translation)**：採用 600M 參數之 NLLB 模型，將其他語言轉為英文。
5. **日曆 (Calendar)**：無需參數，回傳查詢當下日期，提供時間感知。

### 4.2 主要實驗成果（第 4 節，第 5-9 頁）
* **數學推理大幅超越 175B 大模型（Table 4，第 6 頁）**：
  在 ASDiv、SVAMP 與 MAWPS 數學基準測試上，僅具備 **6.7B 參數的 Toolformer 分別取得 40.4、29.4、44.0 的成績**，遠遠超越未具工具之 GPT-J（7.5, 5.2, 9.9），更以**兩倍以上的幅度擊潰參數量大 25 倍的 GPT-3 175B（14.0, 10.0, 19.8）**與 OPT 66B！
* **知識補全 (LAMA Benchmark，Table 3，第 6 頁)**：
  在 SQuAD、Google-RE、T-REx 子集上，Toolformer（33.8, 11.5, 53.5）全面超越 GPT-J 基線（17.8, 4.9, 31.9），並打敗 GPT-3 175B（26.8, 7.0, 39.8）。
* **規模擴展定律 (Scaling Laws，Section 4.4，Figure 4，第 8-9 頁)**：
  * 使用工具的能力在大約 **775M 參數以上才會湧現**。
  * 124M 與 355M 的小模型無法有效學會使用工具，工具反而無法帶來顯著收益。
* **語言建模能力不衰退 (Table 8，第 8 頁)**：
  在 WikiText 與 CCNet 上驗證 Perplexity，證明加入 API 呼叫微調並不會破壞模型原有的文字生成與語言理解底層能力。

---

## 5. 研究限制 (Limitations)
1. **無法鏈式調用工具 (Cannot Chain Tools)**：
   Toolformer 無法將一個工具的輸出作為另一個工具的輸入（例如先透過 Calendar 查日期，再用 QA 查當天事件），因為訓練資料中的 API 調用皆為獨立取樣生成（第 7 節，第 11 頁）。
2. **缺乏互動式搜尋能力 (Non-Interactive Search)**：
   對於搜尋引擎回傳的多項結果，無法像人類或 ReAct 一樣翻頁瀏覽、過濾或動態改寫查詢詞（第 7 節，第 11 頁）。
3. **輸入措辭敏感度 (Sensitivity to Phrasing)**：
   模型決定是否呼叫 API 容易受到 Prompt 具體用詞影響（第 7 節，第 11 頁）。
4. **取樣樣本效率低 (Low Sample Efficiency)**：
   計算機工具在處理百萬篇文檔中，僅篩選出數千個有用的呼叫樣本（第 7 節，第 11 頁）。
5. **未考慮運算成本 (Ignoring Computational Cost)**：
   模型決定是否發起 API 呼叫時，尚未考量呼叫該 API 所需耗費的外部伺服器或計算開銷（第 7 節，第 11 頁）。

---

## 6. 給大學生的繁體中文導讀：生活化圖解概念 (Beginner-Friendly Explanation)

### 6.1 比喻：做筆記自修的學生
* **傳統大型模型（死背型學生）**：
  就像一個死背百科全書的大學生，你問他「$3829 \times 4912$ 等於多少？」，他硬要在腦袋裡算心算，結果算錯（幻覺）。
* **Toolformer（懂得寫小抄查工具的自修生）**：
  這個學生在預習教科書時，看到一段句子：「某產品銷量從 1400 跌到 400，跌幅是……」，他在旁邊空白處寫下註記：`[算一下：(1400-400)/1400]`。
  如果他發現按計算機之後「真的更容易把後面的筆記寫完」，他就把這個習慣固定下來。
  經過多次練習，他學會在「考試遇到複雜數學或日期時，**反射性地從鉛筆盒拿出計算機**」，完全不需要老師教他每一題怎麼按。

### 6.2 與現代 ChatGPT / Function Calling 的關係
Toolformer 開創了**「語言模型自主內嵌 API 語法」**的先河。現在 ChatGPT、Claude 能夠無縫調用 Python 解譯器、Bing 搜尋或執行自訂 Plugin，其「在文字中插入特定 Token 並中斷執行、等待系統傳回結果再接續輸出」的運作機制，正是奠基於 Toolformer 的核心思想！

---

## 7. 後續 HTML 簡報重點引用 (Takeaways for Presentation)
1. **自監督過濾公式圖解**：損失差值篩選準則 $L_i^- - L_i^+ \ge \tau_f$（有幫助才學）。
2. **以小博大的驚人數據**：6.7B 的 Toolformer 數學推理分數超越 175B 的 GPT-3 兩倍以上。
3. **工具能力的湧現臨界點**：775M 參數量級是學會使用工具的分水嶺。
4. **與 ReAct 的核心定位劃分**：
   - ReAct 是**提示階段的思考循環（In-Context Thought Loop）**。
   - Toolformer 是**模型訓練階段的自監督工具嵌入（Self-Supervised Weight Finetuning）**。
