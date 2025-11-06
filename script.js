//まじで綺麗すぎて手のつけようがないんだけどどうしてくれるの

const popupVijust = document.getElementById("Vijust");
const closeVijust = document.getElementById("closeVijust");
const openVijust = document.querySelector(".openVijust");

const popupScreenSelectSentence = document.getElementById("popupScreenSelectSentence");
const selectTextButton = document.getElementById("selectTextButton");
const deselectTextButton = document.getElementById("deselectTextButton");

const popupScreenCustom = document.getElementById("popupScreenCustom");
const backToScreenSelectSentenceButton = document.getElementById("backToScreenSelectSentence");
const addOutlineButton = document.getElementById("addOutline");
const customColorButton = document.getElementById("customColor");
const colorSliderContainer = document.getElementById("colorSliderContainer");
const mainButtonsContainer = document.getElementById("mainButtonsContainer");

let currentTargetElement = null;
let documentClickListener = null;

openVijust.addEventListener("click", () => {
  popupVijust.style.display = "block";
  showScreenSelectSentence(); 
});

closeVijust.addEventListener("click", () => {
  popupVijust.style.display = "none";
  resetPopupState();
  disableSelectMode();
});

function showScreenSelectSentence() {
  popupScreenSelectSentence.style.display = "flex";
  popupScreenCustom.style.display = "none";
  resetScreenCustomContent();
  currentTargetElement = null;
  updateDeselectButtonState();
  backToScreenSelectSentenceButton.style.display = "none";
}

function showScreenCustom() {
  if (currentTargetElement) {
    popupScreenSelectSentence.style.display = "none";
    popupScreenCustom.style.display = "flex";
    resetScreenCustomContent();
    updateDeselectButtonState();
    backToScreenSelectSentenceButton.style.display = "block";
  } else {
    alert("操作対象の文章が選択されていません。");
    showScreenSelectSentence();
  }
}

function resetScreenCustomContent() {
  mainButtonsContainer.style.display = "block";
  colorSliderContainer.innerHTML = "";
  addOutlineButton.textContent = "縁取り";
  backToScreenSelectSentenceButton.style.display = "block";
}

function resetPopupState() {
  currentTargetElement = null;
  showScreenSelectSentence();
  disableSelectMode();
}

function updateDeselectButtonState() {
  if (currentTargetElement) {
    deselectTextButton.style.display = "block";
  } else {
    deselectTextButton.style.display = "none";
  }
}

function enableSelectMode() {
  if (documentClickListener) return;

  document.body.style.cursor = "pointer";

  documentClickListener = function (event) {
    if (
      popupVijust.contains(event.target) ||
      openVijust.contains(event.target)
    ) {
      return;
    }

    currentTargetElement = event.target;
    console.log("クリックされた要素:", currentTargetElement);

    // 実装するかは悩んでるけど、クリックされた要素が操作可能な要素であるかチェックする機能
    // if (!currentTargetElement.closest('.operable-content')) {
    //   alert("この要素は操作できません。別の文章をクリックしてください。");
    //   currentTargetElement = null;
    //   return;
    // }

    disableSelectMode();

    if (popupVijust.style.display === "none" || !popupVijust.style.display) {
      popupVijust.style.display = "block";
    }

    showScreenCustom();
  };
  document.addEventListener("click", documentClickListener);
  console.log("選択モードを有効化しました。");
}

function disableSelectMode() {
  if (documentClickListener) {
    document.removeEventListener("click", documentClickListener);
    documentClickListener = null;
  }
  document.body.style.cursor = "default"; // カーソルを元に戻す
  console.log("選択モードを無効化しました。");
}

selectTextButton.addEventListener("click", () => {
  alert("変更したい文章をクリックしてください。");
  popupVijust.style.display = "none";
  enableSelectMode();
});

deselectTextButton.addEventListener("click", () => {
  resetPopupState();
  alert("選択が解除されました。");
});

backToScreenSelectSentenceButton.addEventListener("click", () => {
  showScreenSelectSentence(); //　currentTargetElementは保持
});

customColorButton.addEventListener("click", () => {
  if (!currentTargetElement) {
    console.warn("操作対象要素がありません。");
    return;
  }

  mainButtonsContainer.style.display = "none"; 
  backToScreenSelectSentenceButton.style.display = "none";
  
  if (!colorSliderContainer.querySelector(".colorSlider")) {
    const colorSliderHTML = `
            <div class="colorSlider">
                <div>
                    <label class="textOnSlider" for="redRange">Red</label>
                    <input type="range" id="redRange" min="0" max="255" value="200" />
                </div>
                <div>
                    <label class="textOnSlider" for="greenRange">Green</label>
                    <input type="range" id="greenRange" min="0" max="255" value="200" />
                </div>
                <div>
                    <label class="textOnSlider" for="blueRange">Blue</label>
                    <input type="range" id="blueRange" min="0" max="255" value="200" />
                </div>
                <button class="backToScreenCustom">◀戻る</button> </div>
        `;
    colorSliderContainer.insertAdjacentHTML("beforeend", colorSliderHTML);

    // スライダーIDの重複を避けるため、querySelectorをcolorSliderContainer内で実行
    const redRange = colorSliderContainer.querySelector("#redRange");
    const greenRange = colorSliderContainer.querySelector("#greenRange");
    const blueRange = colorSliderContainer.querySelector("#blueRange");

    const currentColor = getComputedStyle(currentTargetElement).color;
    const rgb = currentColor.match(/\d+/g).map(Number);
    redRange.value = rgb[0];
    greenRange.value = rgb[1];
    blueRange.value = rgb[2];

    const updateColor = () => {
      const r = redRange.value;
      const g = greenRange.value;
      const b = blueRange.value;
      currentTargetElement.style.color = `rgb(${r}, ${g}, ${b})`;
    };

    redRange.addEventListener("input", updateColor);
    greenRange.addEventListener("input", updateColor);
    blueRange.addEventListener("input", updateColor);

    colorSliderContainer
      .querySelector(".backToScreenCustom")
      .addEventListener("click", () => {
        resetScreenCustomContent();
        backToScreenSelectSentenceButton.style.display = "block";
      });
  }
});

// 縁取りのトグル
const toggleOutline = () => {
  if (!currentTargetElement) {
    console.warn("操作対象要素がありません。");
    return;
  }

  if (currentTargetElement.style.textShadow) {
    currentTargetElement.style.textShadow = "";
    addOutlineButton.textContent = "縁取り";
  } else {
    currentTargetElement.style.textShadow =
      "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
    addOutlineButton.textContent = "縁取りを削除";
  }
};
addOutlineButton.addEventListener("click", toggleOutline);

const moveButtons = {
  topLeft: document.querySelector(".move-top-left"),
  topRight: document.querySelector(".move-top-right"),
  bottomLeft: document.querySelector(".move-bottom-left"),
  bottomRight: document.querySelector(".move-bottom-right"),
};

moveButtons.topLeft.addEventListener("click", () => {
  popupVijust.style.top = "20px";
  popupVijust.style.left = "20px";
  popupVijust.style.right = "auto";
  popupVijust.style.bottom = "auto";
});

moveButtons.topRight.addEventListener("click", () => {
  popupVijust.style.top = "20px";
  popupVijust.style.left = "auto";
  popupVijust.style.right = "20px";
  popupVijust.style.bottom = "auto";
});

moveButtons.bottomLeft.addEventListener("click", () => {
  popupVijust.style.top = "auto";
  popupVijust.style.left = "20px";
  popupVijust.style.right = "auto";
  popupVijust.style.bottom = "20px";
});

moveButtons.bottomRight.addEventListener("click", () => {
  popupVijust.style.top = "auto";
  popupVijust.style.left = "auto";
  popupVijust.style.right = "20px";
  popupVijust.style.bottom = "20px";
});

document.addEventListener("DOMContentLoaded", updateDeselectButtonState);
