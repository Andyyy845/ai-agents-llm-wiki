# ReAct: Synergizing Reasoning and Acting in Language Models

## 1. 論文中繼資料 (Metadata)
* **論文標題 (Title)**：ReAct: Synergizing Reasoning and Acting in Language Models
* **作者群 (Authors)**：Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao（Princeton University & Google Research, Brain team）
* **發表年份 (Year)**：2022 年（arXiv:2210.03629v3，發表於 ICLR 2023）
* **來源網址 (Source URL)**：[https://arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)
* **原始 PDF 檔案**：[`raw/react_reasoning_and_acting.pdf`](../raw/react_reasoning_and_acting.pdf)

---

## 2. 研究背景與目的 (Background & Objective)
* **既有方法的各自孤立瓶頸**：
  1. **純推理方法（Reason-only，如 Chain-of-Thought / CoT）**：雖然 CoT 能引導模型產生思考路徑，但推理過程完全依賴模型內部記憶，屬於靜態黑盒子（Static Black Box）。這導致模型容易產生事實幻覺（Fact Hallucination）且錯誤會在推理步驟中滾雪球般放大（Error Propagation）（第 1 節，第 2 頁）。
  2. **純行動方法（Act-only，如 WebGPT、SayCan）**：雖然能與外部環境（如搜尋引擎、機器人物理環境）互動，但缺乏高層次的抽象語言推理與工作記憶（Working Memory），模型容易迷失子目標（Subgoals）、無法針對環境回饋動態修正計畫，甚至陷入無意義的重複操作（第 1 節，第 2 頁）。
* **研究核心目的**：
  提出 **ReAct**（**Re**asoning + **Act**ing）架構，將「語言思考（Thought）」與「環境行動（Action）」以交錯（Interleaved）方式緊密結合。讓推理引導行動（Reason to Act：規劃目標、追蹤進度、處理異常），同時讓行動回饋支持推理（Act to Reason：透過外部觀察 Observation 獲取最新事實並修正認知），達成協同增效（Synergy）（第 1-2 節，第 2-3 頁）。

---

## 3. 核心方法與工作架構 (Core Methodology & Architecture)

### 3.1 擴展行動空間與執行迴圈 (Augmented Action Space & Loop)
在標準互動決策環境中，代理人在時間步 $t$ 接收環境觀察 $o_t \in \mathcal{O}$，並執行行動 $a_t \in \mathcal{A}$。
ReAct 將代理人的行動空間擴充為：

$$\hat{\mathcal{A}} = \mathcal{A} \cup \mathcal{L}$$

其中 $\mathcal{L}$ 為語言空間（Language Space）。在語言空間中的行動 $\hat{a}_t \in \mathcal{L}$ 被稱為**思考（Thought）**或推理軌跡（Reasoning Trace）（第 2 節，第 3 頁）：
* **Thought 的特性**：不會改變外部環境狀態（不產生環境 Observation），但會將思維脈絡寫入上下文 $c_{t+1} = (c_t, \hat{a}_t)$，作為後續推理與決策的工作記憶。
* **Thought 的具體功能**：
  1. 分解任務目標並制定行動計畫（Decomposing task goals）。
  2. 注入與任務相關的常識知識（Injecting commonsense knowledge）。
  3. 從環境觀察中提煉關鍵資訊（Extracting important information from observations）。
  4. 追蹤子目標完成狀態（Track progress）。
  5. 應對意外狀況並調整行動方案（Handle exceptions and adjust action plans）。

### 3.2 典型工作流程：Thought-Action-Observation 迴圈
ReAct 透過少樣本上下文提示（Few-Shot In-Context Prompting）引導凍結的大型語言模型（如 PaLM-540B 或 GPT-3），交替生成以下三元組（第 2 節，圖 1，第 2-3 頁）：
1. **Thought**（思考）：代理人分析目前局勢與下一步策略。
2. **Action**（行動）：向外部環境發出具體指令（例如 Wikipedia API：`search[entity]`、`lookup[string]`、`finish[answer]`）。
3. **Observation**（觀察）：外部環境回傳真實資料（例如 Wikipedia 頁面文字摘要、搜尋結果清單）。

### 3.3 結合內部與外部知識：ReAct 與 CoT-SC 融合啟發式
ReAct 的強項在於具備外部查證能力（Factual & Grounded），但受限於檢索精確度；CoT 則擅長組織內部語意推理結構。論文提出了雙向回退機制（第 3.2 節，第 5 頁）：
* **ReAct $\to$ CoT-SC**：當 ReAct 在指定步數內（HotpotQA 設定 7 步、FEVER 設定 5 步）未能得出答案時，回退至 CoT-SC（Self-Consistency 多數決）。
* **CoT-SC $\to$ ReAct**：當 CoT-SC 的取樣解答多數決票數低於半數（$n/2$）代表模型對內部知識信心不足時，主動切換至 ReAct 進行外部檢索。

---

## 4. 主要實驗成果 (Key Experimental Results)

論文在兩大類別共四個基準測試上進行評估（第 3-4 節，第 4-8 頁）：

### 4.1 知識密集型推理任務 (Knowledge-Intensive Reasoning)
* **HotpotQA（多跳問答）**：
  * PaLM-540B 提示下：ReAct（27.4 EM）顯著超越 Act-only（25.7 EM）。
  * 融合策略 **ReAct $\to$ CoT-SC** 取得 **35.1 EM**，大幅超越單純 CoT（29.4 EM）與 CoT-SC（33.4 EM）（第 3.3 節，表 1，第 5 頁）。
* **FEVER（事實查核）**：
  * ReAct 準確率達到 **60.9%**，直接擊敗純推理的 CoT（56.3%）。
  * **CoT-SC $\to$ ReAct** 達到 **64.6%**（表 1，第 5 頁）。
* **錯誤模式質化分析（Table 2，第 6 頁）**：
  * 在失敗案例中，CoT 的**幻覺錯誤率高達 56%**，而 ReAct 的**幻覺率降至 0%**！
  * 成功案例中，ReAct 的推理路徑真實性（True Positive）達 94%，顯著高於 CoT 的 86%。

### 4.2 互動決策任務 (Interactive Decision Making)
* **ALFWorld（文字型具身決策遊戲）**：
  * ReAct 最佳成功率達到 **71%**，遠勝 Act-only（45%）與在 10 萬筆專家軌跡上訓練的模仿學習代理人 BUTLER（37%）（第 4 節，表 3，第 8 頁）。
  * 僅憑 2 個 In-Context 示範範例，相對 Act-only 平均提升達 62%。
* **WebShop（多屬性網路購物導航）**：
  * ReAct 成功率（Success Rate）達 **40.0%**，得分 66.6，超越模仿學習（29.1%）與強化學習 IL+RL（28.7%）（第 4 節，表 4，第 8 頁）。

---

## 5. 研究限制 (Limitations)
1. **推理死循環問題 (Repetitive Loops)**：
   ReAct 結構強制依賴嚴格的交錯步驟。當搜尋回傳無效資訊時，模型容易失去彈性，陷入重複產生相同 Thought 與 Action 的死循環（佔推理錯誤的 47%）（第 3.3 節，表 2，第 6 頁）。
2. **極度依賴外部檢索品質 (Search Error Sensitivity)**：
   搜尋回傳無關資訊或空結果佔了失敗案例的 23%，容易徹底誤導後續思維走向（第 3.3 節，第 6 頁）。
3. **上下文長度限制 (Context Limit)**：
   在長跨度、多步驟的複雜任務中，Thought-Action-Observation 軌跡迅速膨脹，容易超出 LLM 的輸入長度上限（第 6 節，第 9 頁）。
4. **小模型提示難以學會 (Small Model Scaling Barrier)**：
   在 8B 或 62B 等較小參數量級下，單純 Prompting 難以同時學會推理與行動，需要額外仰賴 3,000 筆軌跡進行微調才能發揮優勢（第 3.3 節，圖 3，第 7 頁）。

---

## 6. 給大學生的繁體中文導讀：生活化圖解概念 (Beginner-Friendly Explanation)

### 6.1 比喻：做菜時的「邊想邊做」
* **純 CoT（閉門造車）**：
  一個廚師坐在沙發上空想：「我先放油，再放鹽，最後加松露」。結果他走進廚房才發現「家裡根本沒有松露」，但他還是照著原計畫假裝有松露繼續炒，最後端出一道幻覺料理。
* **純 Act（無腦操作）**：
  廚師一進廚房就盲目打開冰箱、打開烤箱、拿起鍋鏟亂敲，根本不知道自己要做什麼菜，毫無章法。
* **ReAct（聰明的現代廚師）**：
  1. *Thought 1*：「我想做番茄炒蛋，先確認有沒有雞蛋。」
  2. *Action 1*：打開冰箱（呼叫外部環境）。
  3. *Observation 1*：看到有雞蛋，但沒有番茄。
  4. *Thought 2*：「既然沒有番茄，我應該改做蔥花炒蛋，先去拿蔥。」
  5. *Action 2*：走向蔬菜籃。
  
這就是現代 **AI Agent（智慧代理人）** 的雛形：**把思考與工具操作串聯成動態閉環**。

---

## 7. 後續 HTML 簡報重點引用 (Takeaways for Presentation)
1. **核心工作流程圖**：展示 `Thought ➔ Action ➔ Observation` 循環結構。
2. **與 CoT 的關鍵對比數據**：HotpotQA 失敗分析中，CoT 幻覺率高達 56%，而 ReAct 降為 0%。
3. **範式突破**：證明語言模型不僅能「回答問題（Reason）」，更能「操作環境、使用 API（Act）」，是大型語言模型走向 Autonomous Agent 的基石文獻。
