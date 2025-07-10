// script.js

// セレクタ取得
const popupVijust = document.getElementById("Vijust");
const closeVijust = document.getElementById("closeVijust");
const openVijust = document.querySelector(".openVijust");

// UI画面のセレクタ
const popupScreen1 = document.getElementById("popupScreen1"); // 選択/解除ボタンがある画面
const selectTextButton = document.getElementById("selectTextButton");
const deselectTextButton = document.getElementById("deselectTextButton");

const popupScreen2 = document.getElementById("popupScreen2"); // 操作画面
const backToScreen1Button = document.getElementById("backToScreen1"); // 画面1に戻るボタン
const addOutlineButton = document.getElementById("addOutline");
const customColorButton = document.getElementById("customColor");
const colorSliderContainer = document.getElementById("colorSliderContainer");
const mainButtonsContainer = document.getElementById("mainButtonsContainer"); // 縁取り/CUSTOMボタンのコンテナ

// 現在操作対象となっている要素を保持する変数
let currentTargetElement = null;

// ドキュメントクリックイベントリスナーを保持する変数
let documentClickListener = null;

// --- ポップアップを開く ---
openVijust.addEventListener("click", () => {
  popupVijust.style.display = "block";
  showScreen1(); // 常に初期画面から開始
});

// --- ポップアップを閉じる ---
closeVijust.addEventListener("click", () => {
  popupVijust.style.display = "none";
  resetPopupState(); // ポップアップを閉じるときに状態をリセット
  disableSelectMode(); // 選択モードがアクティブなら解除
});

// --- 画面切り替え関数 ---
function showScreen1() {
  popupScreen1.style.display = "flex"; // flex-direction: column; に対応するため 'flex' に変更
  popupScreen2.style.display = "none";
  resetScreen2Content(); // 画面2の内容をリセット
  currentTargetElement = null; // 選択解除時はcurrentTargetElementをリセット
  updateDeselectButtonState();
  backToScreen1Button.style.display = "none"; // 画面1では戻るボタンを非表示
}

function showScreen2() {
  if (currentTargetElement) {
    popupScreen1.style.display = "none";
    popupScreen2.style.display = "flex"; // flex-direction: column; に対応するため 'flex' に変更
    resetScreen2Content(); // 念のため画面2の表示状態を初期化
    updateDeselectButtonState(); // 選択解除ボタンの状態を更新
    backToScreen1Button.style.display = "block"; // 画面2では戻るボタンを表示
  } else {
    alert("操作対象の文章が選択されていません。");
    showScreen1();
  }
}

// 画面2の内容（縁取り/CUSTOMボタン、スライダー）を初期状態に戻す
// スライダーが非表示になり、縁取り/CUSTOMボタンが表示される状態
function resetScreen2Content() {
  mainButtonsContainer.style.display = "block"; // 縁取り/CUSTOMボタンを表示
  colorSliderContainer.innerHTML = ""; // スライダーを非表示にするためにクリア
  addOutlineButton.textContent = "縁取り"; // 縁取りボタンのテキストも初期化
  backToScreen1Button.style.display = "block"; // CUSTOM画面から戻る際は#backToScreen1を表示
}

// ポップアップ全体の状態をリセット
function resetPopupState() {
  currentTargetElement = null; // ターゲット要素をリセット
  showScreen1(); // 画面1に戻す
  disableSelectMode(); // 選択モードを解除
}

// 「選択を解除」ボタンの表示状態を更新
function updateDeselectButtonState() {
  if (currentTargetElement) {
    deselectTextButton.style.display = "block"; // 選択されている場合、解除ボタンを表示
  } else {
    deselectTextButton.style.display = "none"; // 選択されていない場合、解除ボタンを非表示
  }
}

// --- 選択モードの有効化と無効化 ---
function enableSelectMode() {
  if (documentClickListener) return;

  document.body.style.cursor = "pointer"; // カーソルをポインタに変更

  documentClickListener = function (event) {
    // ポップアップ自身や開くボタン、またはその子孫要素がクリックされた場合は無視する
    if (
      popupVijust.contains(event.target) ||
      openVijust.contains(event.target)
    ) {
      return;
    }

    currentTargetElement = event.target;
    console.log("クリックされた要素:", currentTargetElement);

    // 必要に応じて、クリックされた要素が操作可能な要素であるかチェックする
    // if (!currentTargetElement.closest('.operable-content')) {
    //   alert("この要素は操作できません。別の文章をクリックしてください。");
    //   currentTargetElement = null;
    //   return;
    // }

    disableSelectMode(); // 選択モードを無効化

    // ポップアップが閉じていれば開く
    if (popupVijust.style.display === "none" || !popupVijust.style.display) {
      popupVijust.style.display = "block";
    }

    showScreen2(); // 操作画面に遷移
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

// --- 画面1のボタンイベント ---
selectTextButton.addEventListener("click", () => {
  alert("変更したい文章をクリックしてください。"); // ユーザーに指示
  popupVijust.style.display = "none"; // ポップアップを一時的に非表示にする
  enableSelectMode(); // 選択モードを有効化
});

deselectTextButton.addEventListener("click", () => {
  resetPopupState(); // ターゲットをリセットし、画面1に戻る
  alert("選択が解除されました。");
});

// --- 画面2のボタンイベント ---
backToScreen1Button.addEventListener("click", () => {
  showScreen1(); // 画面1に戻る (currentTargetElementは保持されたまま)
});

// CUSTOMボタンをクリックしたときの動作
customColorButton.addEventListener("click", () => {
  if (!currentTargetElement) {
    console.warn("操作対象要素がありません。");
    return;
  }

  mainButtonsContainer.style.display = "none"; // 既存のボタンを非表示に
  backToScreen1Button.style.display = "none"; // !!! 追加: #backToScreen1 を非表示にする !!!

  // スライダーがすでに表示されていないか確認
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

    // CUSTOM画面から戻るボタンのイベントリスナー
    colorSliderContainer
      .querySelector(".backToScreen2")
      .addEventListener("click", () => {
        resetScreen2Content(); // スライダーを非表示にし、ボタンを表示
        backToScreen1Button.style.display = "block"; // !!! 追加: #backToScreen1 を再表示する !!!
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

// 初期状態で「選択を解除」ボタンを非表示にする
document.addEventListener("DOMContentLoaded", updateDeselectButtonState);
