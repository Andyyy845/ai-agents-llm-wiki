# Attention Is All You Need (Transformer)

## 1. 論文中繼資料 (Metadata)
* **論文標題 (Title)**：Attention Is All You Need
* **作者群 (Authors)**：Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
* **發表年份 (Year)**：2017 年（NIPS 2017）
* **來源網址 (Source URL)**：[https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
* **原始 PDF 檔案**：[`raw/attention_is_all_you_need.pdf`](../raw/attention_is_all_you_need.pdf)

---

## 2. 研究背景與目的 (Background & Objective)
* **既有架構的根本瓶頸**：
  在 Transformer 誕生前，主流序列轉換（Sequence Transduction）模型主要基於遞迴神經網路（Recurrent Neural Networks, RNN），包含 LSTM 與 GRU，並搭配 Encoder-Decoder 架構。然而，RNN 本質上必須沿著時間步（Time Steps）按順序進行遞迴計算（$h_t = f(h_{t-1}, x_t)$），這導致了**無法在訓練時跨時間步進行高度平行化（Parallelization）**，尤其在長序列（Long Sequences）下受到記憶體與批次處理限制，訓練極為耗時（第 1 節，第 2 頁）。
* **長距離依賴問題 (Long-Range Dependencies)**：
  雖然卷積網路（CNN，如 ByteNet、ConvS2S）能進行平行計算，但其關聯兩個遠距離詞彙所需的運算量隨距離呈線性或對數級增長，難以有效捕捉長距離語意關聯（第 2 節，第 2 頁）。
* **研究核心目的**：
  提出一種完全捨棄循環（Recurrence）與卷積（Convolution）的新型架構——**Transformer**，純粹依賴注意力機制（Attention Mechanism）來捕捉輸入與輸出序列的全域依賴關係，大幅提升訓練平行度與翻譯品質（第 1 節，第 2 頁）。

---

## 3. 核心技術與架構 (Core Architecture & Methodology)

Transformer 採用經典的 **Encoder-Decoder** 結構（第 3 節，第 2-5 頁）：

### 3.1 編碼器與解碼器堆疊 (Encoder & Decoder Stacks)
* **編碼器 (Encoder)**：
  * 由 $N = 6$ 個完全相同的層（Layers）堆疊而成。
  * 每層包含兩個子層：
    1. **Multi-Head Self-Attention**（多頭自注意力機制）。
    2. **Position-wise Feed-Forward Network**（逐位置前饋網路）。
  * 每個子層外皆包覆**殘差連接 (Residual Connection)** 與 **層正規化 (Layer Normalization)**：$\text{LayerNorm}(x + \text{Sublayer}(x))$。
  * 內部隱藏維度固定為 $d_{\text{model}} = 512$，前饋網路內部擴展維度為 $d_{ff} = 2048$（第 3.1 節，第 3 頁）。
* **解碼器 (Decoder)**：
  * 同樣由 $N = 6$ 個相同層堆疊而成。
  * 每層包含三個子層：
    1. **Masked Multi-Head Self-Attention**：遮罩自注意力，防止當前位置注意到未來的詞（確保自迴歸性質，Auto-regressive property）。
    2. **Encoder-Decoder Attention**：對編碼器的輸出進行注意力計算（Query 來自解碼器前一層，Key 與 Value 來自編碼器輸出）。
    3. **Position-wise Feed-Forward Network**。

### 3.2 縮放點積注意力 (Scaled Dot-Product Attention)
注意力機制將 Query ($Q$)、Key ($K$)、Value ($V$) 向量映射至輸出。計算公式如下（第 3.2.1 節，第 4 頁）：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

* **縮放因子 $\frac{1}{\sqrt{d_k}}$ 的作用**：當維度 $d_k$ 較大時，點積結果的量級會大幅增加，容易將 Softmax 函數推向梯度極小的區域（Gradient Saturation）。除以 $\sqrt{d_k}$（此論文中 $d_k = 64$）可穩定梯度，避免梯度消失。

### 3.3 多頭注意力機制 (Multi-Head Attention)
相較於只進行單一的 Attention 計算，多頭機制將 $Q, K, V$ 透過 $h$ 組不同的可學習線性投影矩陣投影至較低維度（$d_k = d_v = d_{\text{model}} / h = 64$），平行執行 $h = 8$ 次 Attention，最後將各頭的輸出拼接（Concatenate）並線性投影輸出（第 3.2.2 節，第 4-5 頁）：

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$

* **效益**：允許模型同時在不同位置關注來自不同子空間表示（Representation Subspaces）的豐富資訊，防止單一注意力頭的權重平均化效應。

### 3.4 位置編碼 (Positional Encoding)
由於架構不含遞迴與卷積，為使模型能感知序列中詞彙的前後相對或絕對順序，在輸入 Embedding 加入正弦與餘弦函數的位置編碼（第 3.5 節，第 6 頁）：

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

* **特性**：波長呈現幾何級數分佈，使模型容易學習依相對位置進行關注（對於任意固定偏移量 $k$，$PE_{pos+k}$ 可表示為 $PE_{pos}$ 的線性轉換）。

---

## 4. 主要研究發現與實驗成果 (Key Findings & Experiments)

* **機器翻譯突破 (Machine Translation)**：
  * **WMT 2014 英德翻譯 (English-to-German)**：Transformer (big) 達到 **28.4 BLEU**，打破當時最佳紀錄（含 Ensemble 模型），提升超過 2.0 BLEU（第 6.1 節，表 2，第 8 頁）。
  * **WMT 2014 英法翻譯 (English-to-French)**：達到 **41.8 BLEU**，創下全新單一模型 SOTA，且訓練成本僅為文獻中既有最佳模型的極小部分（在 8 顆 P100 GPU 上僅訓練 3.5 天）（第 6.1 節，第 8 頁）。
  * **基礎模型 (Base Model)** 僅需 8 顆 P100 訓練 12 小時（第 5.2 節，第 7 頁）。
* **計算複雜度對比 (Computational Complexity)**：
  * 自注意力機制（Self-Attention）每層的時間複雜度為 $O(n^2 \cdot d)$，序列操作步數為 $O(1)$，最大路徑長度為 $O(1)$；而 RNN 序列操作步數為 $O(n)$，最大路徑長度為 $O(n)$（第 4 節，表 1，第 6 頁）。
  * 在句子長度 $n < d$ 的情況下，自注意力機制運算速度顯著快於 RNN。
* **跨任務泛化能力 (Generalization)**：
  * 在缺少特定任務調優的情況下，直接應用於英語句法剖析（English Constituency Parsing, WSJ 23），在 discriminative 設定下達到 91.3 F1，semi-supervised 設定下達到 92.7 F1，超越了絕大多數 RNN 專屬模型（第 6.3 節，表 4，第 10 頁）。

---

## 5. 研究限制 (Limitations)
1. **二次方複雜度 (Quadratic Complexity)**：
   自注意力矩陣計算對於序列長度 $n$ 呈現 $O(n^2)$ 的計算與記憶體開銷。在極長文本的情境下，運算與記憶體需求急遽升高（論文在第 4 節與第 7 節提到對極長序列可能需要限制在局部窗口 $r$ 的 Restricted Self-Attention）。
2. **推論階段自迴歸解碼瓶頸 (Sequential Generation at Inference)**：
   雖然訓練時可以透過 Teacher Forcing 與矩陣運算達成全並行，但在推論產生文字時，Decoder 依然必須逐步（Token-by-token）生成，無法完全並行輸出（第 7 節結論指出 "Making generation less sequential is another research goal of ours"）。
3. **單純文本模態 (Text-Only Modality)**：
   原始論文僅驗證於純文本之機器翻譯與語法剖析任務，尚未擴展至影像、音訊或多模態領域（第 7 節）。

---

## 6. 新手教學導讀：給大學生的繁體中文圖解概念 (Beginner-Friendly Explanation)

### 6.1 生活化比喻：傳統 RNN vs Transformer
* **傳統 RNN（逐字閱讀法）**：
  就像一個人閱讀一本小說，必須看完第 1 個字才能看第 2 個字，看到第 100 個字時，前面的記憶已經開始模糊。而且不能找多個人分工「同時看每一頁」，因為每一步都需要上一步的記憶。
* **Transformer（全局速讀檢索法）**：
  就像一張開整頁書，你可以**同時**看到這頁所有的字。當你想理解「它」指的是誰時，眼神可以瞬間在整個句子劃出連線（Self-Attention），同時把代名詞與其指涉的名詞關聯起來。

### 6.2 與 ChatGPT 的關聯
當今的 ChatGPT、GPT-4、Claude 等大型語言模型（LLM），其骨幹架構皆衍生自 Transformer。ChatGPT 屬於 **Decoder-only** 架構，即借用了 Transformer 中的 Masked Self-Attention 機制，一邊閱讀前文、一邊預測下一個 Token。

---

## 7. 後續 HTML 簡報重點引用 (Takeaways for Presentation)
1. **核心名言與概念**：「Attention Is All You Need」宣告序列模型不再需要循環神經網路（RNN）與卷積神經網路（CNN）。
2. **關鍵公式與圖解**：縮放點積注意力公式 $\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ 與 Multi-Head Attention 架構圖。
3. **三大優勢**：
   - 訓練全平行化（平行處理長句子）。
   - 長距離語意捕捉能力（路徑長度 $O(1)$）。
   - 顯著降低計算資源消耗與時間（12 小時至 3.5 天即達 SOTA）。
4. **原生缺點**：長序列下 $O(n^2)$ 的記憶體開銷。
