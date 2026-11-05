// 儲存停止動畫的水平精靈圖。
let stopSprite;
// 儲存行走動畫的水平精靈圖。
let walkSprite;
// 記錄角色在畫布中的水平位置。
let characterX;
// 記錄角色的面向；1 代表右方，-1 代表左方。
let facing = 1;
// 記錄目前播放的動畫種類。
let isWalking = false;
// 記錄右方向鍵目前是否按住。
let rightKeyPressed = false;
// 記錄左方向鍵目前是否按住。
let leftKeyPressed = false;
// 設定停止動畫的影格數。
const stopFrameCount = 6;
// 設定行走動畫的影格數。
const walkFrameCount = 8;
// 設定角色每秒播放的動畫影格數。
const animationFrameRate = 8;
// 設定角色每秒的水平移動速度，單位為像素。
const movementSpeed = 180;

// 在建立畫布前載入兩張精靈圖。
function preload() {
  // 載入停止動畫的精靈圖。
  stopSprite = loadImage("1/stop/stop.png");
  // 載入行走動畫的精靈圖。
  walkSprite = loadImage("1/walk/walk.png");
}

// 建立符合瀏覽器視窗大小的畫布。
function setup() {
  // 建立填滿視窗的畫布。
  createCanvas(windowWidth, windowHeight);
  // 將角色的起始位置設在畫布中央。
  characterX = width / 2;
  // 設定動畫更新速度。
  frameRate(60);
  // 設定圖片繪製時不顯示外框。
  noStroke();
  // 直接監聽瀏覽器鍵盤事件，確保按住方向鍵時能持續移動。
  window.addEventListener("keydown", handleMovementKeyDown);
  // 直接監聽方向鍵放開事件。
  window.addEventListener("keyup", handleMovementKeyUp);
  // 視窗失去焦點時清除按鍵狀態，避免角色持續行走。
  window.addEventListener("blur", releaseMovementKeys);
}

// 按下方向鍵時記錄狀態並阻止瀏覽器捲動。
function handleMovementKeyDown(event) {
  // 按住右方向鍵時設定向右移動狀態。
  if (event.key === "ArrowRight") {
    rightKeyPressed = true;
    // 阻止瀏覽器以方向鍵捲動畫面。
    event.preventDefault();
  }
  // 按住左方向鍵時設定向左移動狀態。
  if (event.key === "ArrowLeft") {
    leftKeyPressed = true;
    // 阻止瀏覽器以方向鍵捲動畫面。
    event.preventDefault();
  }
}

// 放開方向鍵時清除對應的移動狀態。
function handleMovementKeyUp(event) {
  // 放開右方向鍵時停止向右移動。
  if (event.key === "ArrowRight") {
    rightKeyPressed = false;
    // 阻止瀏覽器以方向鍵捲動畫面。
    event.preventDefault();
  }
  // 放開左方向鍵時停止向左移動。
  if (event.key === "ArrowLeft") {
    leftKeyPressed = false;
    // 阻止瀏覽器以方向鍵捲動畫面。
    event.preventDefault();
  }
}

// 清除所有方向鍵狀態。
function releaseMovementKeys() {
  // 清除右方向鍵狀態。
  rightKeyPressed = false;
  // 清除左方向鍵狀態。
  leftKeyPressed = false;
}

// 每一個畫面更新角色位置並繪製動畫。
function draw() {
  // 使用指定的淺藍色清除上一個畫面。
  background("#caf0f8");
  // 每次繪製前先將角色設為停止狀態。
  isWalking = false;

  // 按住右方向鍵時讓角色面向右方並向右移動。
  if (rightKeyPressed) {
    // 設定角色面向右方。
    facing = 1;
    // 設定目前播放行走動畫。
    isWalking = true;
    // 向右移動角色並限制其不超出畫布。
    characterX = min(characterX + movementSpeed * deltaTime / 1000, width);
  // 否則，按住左方向鍵時讓角色面向左方並向左移動。
  } else if (leftKeyPressed) {
    // 設定角色面向左方。
    facing = -1;
    // 設定目前播放行走動畫。
    isWalking = true;
    // 向左移動角色並限制其不超出畫布。
    characterX = max(characterX - movementSpeed * deltaTime / 1000, 0);
  }

  // 根據目前狀態選擇對應的影格總數。
  const activeFrameCount = isWalking ? walkFrameCount : stopFrameCount;
  // 根據目前狀態選擇完整的精靈圖。
  const activeSprite = isWalking ? walkSprite : stopSprite;
  // 計算單一影格在畫面上的平均寬度。
  const frameWidth = activeSprite.width / activeFrameCount;
  // 取得單一影格的高度。
  const frameHeight = activeSprite.height;
  // 依動畫速度計算目前播放到的影格編號。
  const currentFrame = floor(frameCount / (60 / animationFrameRate)) % activeFrameCount;
  // 計算目前影格在原始精靈圖中的整數起點。
  const sourceX = round(currentFrame * activeSprite.width / activeFrameCount);
  // 計算目前影格在原始精靈圖中的整數終點。
  const sourceEndX = round((currentFrame + 1) * activeSprite.width / activeFrameCount);
  http://localhost:8000/  // 計算目前影格在原始精靈圖中的實際像素寬度。
  const sourceFrameWidth = sourceEndX - sourceX;
  // 計算角色在畫布上繪製時的水平位置。
  const drawX = constrain(characterX, frameWidth / 2, width - frameWidth / 2);

  // 暫存繪圖狀態，避免翻轉影響其他畫面元素。
  push();
  // 將座標原點移至角色所在位置。
  translate(drawX, height / 2);
  // 依角色面向水平翻轉圖片。
  scale(facing, 1);
  // 明確從原始圖片裁切目前影格，再將它繪製在角色中央。
  drawingContext.drawImage(
    activeSprite.canvas,
    sourceX,
    0,
    sourceFrameWidth,
    frameHeight,
    -frameWidth / 2,
    -frameHeight / 2,
    frameWidth,
    frameHeight
  );
  // 還原先前暫存的繪圖狀態。
  pop();
}

// 視窗尺寸改變時同步調整畫布大小。
function windowResized() {
  // 將畫布調整為最新的視窗寬高。
  resizeCanvas(windowWidth, windowHeight);
  // 將角色位置限制在新畫布的可視範圍內。
  characterX = constrain(characterX, 0, width);
}
