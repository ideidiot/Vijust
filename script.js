const popupVijust = document.getElementById("Vijust");
const closeVijust = document.getElementById("closeVijust");
const openVijust = document.querySelector(".openVijust");

const popupScreen1 = document.getElementById("popupScreen1");
const selectTextButton = document.getElementById("selectTextButton");
const deselectTextButton = document.getElementById("deselectTextButton");

const popupScreen2 = document.getElementById("popupScreen2");
const backToScreen1Button = document.getElementById("backToScreen1");
const addOutlineButton = document.getElementById("addOutline");
const customColorButton = document.getElementById("customColor");
const colorSliderContainer = document.getElementById("colorSliderContainer");
const mainButtonsContainer = document.getElementById("mainButtonsContainer");

let currentTargetElement = null;
let documentClickListener = null;

openVijust.addEventListener("click", () => {
  popupVijust.style.display = "block";
  showScreen1(); 
});

closeVijust.addEventListener("click", () => {
  popupVijust.style.display = "none";
  resetPopupState();
  disableSelectMode();
});

function showScreen1() {
  popupScreen1.style.display = "flex";
  popupScreen2.style.display = "none";
  resetScreen2Content();
  currentTargetElement = null;
  updateDeselectButtonState();
  backToScreen1Button.style.display = "none";
}

function showScreen2() {
  if (currentTargetElement) {
    popupScreen1.style.display = "none";
    popupScreen2.style.display = "flex";
    resetScreen2Content();
    updateDeselectButtonState();
    backToScreen1Button.style.display = "block";
  } else {
    alert("操作対象の文章が選択されていません。");
    showScreen1();
  }
}

function resetScreen2Content() {
  mainButtonsContainer.style.display = "block";
  colorSliderContainer.innerHTML = "";
  addOutlineButton.textContent = "縁取り";
  backToScreen1Button.style.display = "block";
}

function resetPopupState() {
  currentTargetElement = null;
  showScreen1();
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

    showScreen2();
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

backToScreen1Button.addEventListener("click", () => {
  showScreen1(); //　currentTargetElementは保持
});

customColorButton.addEventListener("click", () => {
  if (!currentTargetElement) {
    console.warn("操作対象要素がありません。");
    return;
  }

  mainButtonsContainer.style.display = "none"; 
  backToScreen1Button.style.display = "none";
  
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
                <button class="backToScreen2">◀戻る</button> </div>
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
      .querySelector(".backToScreen2")
      .addEventListener("click", () => {
        resetScreen2Content();
        backToScreen1Button.style.display = "block";
      });
  }
});

// 縁取りのトグル関数
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
