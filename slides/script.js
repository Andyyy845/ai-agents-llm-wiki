/**
 * 簡報播放與互動控制器
 * 《從大型語言模型（LLM）到 AI Agents 與 RAG》
 */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;
  let currentIndex = 0;

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const pageCounter = document.getElementById("page-counter");
  const progressBar = document.getElementById("progress-bar");

  // 從 URL Hash 初始化頁數
  function getInitialSlide() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#slide-")) {
      const slideNum = parseInt(hash.replace("#slide-", ""), 10);
      if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= totalSlides) {
        return slideNum - 1;
      }
    }
    return 0;
  }

  // 更新目前幻燈片狀態
  function updateSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    // 更新頁碼計數
    if (pageCounter) {
      pageCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }

    // 更新進度條
    if (progressBar) {
      const percentage = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // 更新按鈕啟用狀態
    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === totalSlides - 1;

    // 更新 URL Hash
    window.location.hash = `#slide-${currentIndex + 1}`;
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      updateSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      updateSlide(currentIndex - 1);
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 綁定按鈕事件
  if (btnPrev) btnPrev.addEventListener("click", prevSlide);
  if (btnNext) btnNext.addEventListener("click", nextSlide);
  if (btnFullscreen) btnFullscreen.addEventListener("click", toggleFullscreen);

  // 鍵盤導航監聽
  window.addEventListener("keydown", (e) => {
    // 忽略在輸入框內的鍵盤事件
    if (["input", "textarea"].includes(e.target.tagName.toLowerCase())) {
      return;
    }

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ": // 空白鍵
        e.preventDefault();
        nextSlide();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        prevSlide();
        break;
      case "Home":
        e.preventDefault();
        updateSlide(0);
        break;
      case "End":
        e.preventDefault();
        updateSlide(totalSlides - 1);
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  });

  // 支援觸控滑動手勢
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50; // 滑動門檻像素
    if (touchEndX < touchStartX - threshold) {
      nextSlide(); // 向左滑，下一頁
    }
    if (touchEndX > touchStartX + threshold) {
      prevSlide(); // 向右滑，上一頁
    }
  }

  // 初始化第一頁或指定頁數
  updateSlide(getInitialSlide());
});
