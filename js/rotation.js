// UA判定のJSライブラリーを実行
const uAParser = UAParser();

const $flip = $('.js-flip');
const $flipInner = $('.js-flip-inner');
const flipWidth = $flip.width();

// 円の直径を180度に割り当てる
const rate = 180 / flipWidth;

// .flip-innerクラスにつけるtransitionのduration値
const DURATION = 800;

// touchMoveのフラグ
let moving = false;

// touchEnd後、アニメーションしているときのフラグ
let animating = false;

// タップし始めたときのx座標
let startPointX = 0;

// タップを離したときのx座標
let endPointX = 0;

// 現在の回転量
let currentRotationVal = 0;

// デバイスを判定
let judgeDevice = () => {
  (uAParser.device.type !== 'mobile') ? $flip.addClass('is-pc') : $flip.removeClass('is-pc');
};

// スワイプしはじめたとき
let touchStartHandler = (e) => {
  if (uAParser.device.type !== 'mobile') return;
  if (moving) return;
  let touch = e.originalEvent.touches[0];
  // 触り始めたときのタップしたx,y座標を保存
  startPointX = touch.screenX;
};

// スワイプ中
let touchMoveHandler = (e) => {
  if (uAParser.device.type !== 'mobile') return;
  if (animating) return;
  moving = true;
  let touch = e.originalEvent.touches[0];

  // スワイプ量を保存
  endPointX = (touch.screenX - startPointX) * rate;

  // 半回転以上回転させないように-180度以上、180度以下に制限
  if (endPointX > 180 || endPointX < -180) {
    return;
  }

  roll(currentRotationVal + endPointX);
};

// 指を離したとき
let touchEndHandler = () => {
  if (uAParser.device.type !== 'mobile') return;
  if (!moving || animating) {
    return;
  }
  moving = false;

  // タップを離したとき、プラス方向に半分よりめくれていたら最後までめくる
  if(currentRotationVal + endPointX > currentRotationVal + 90) {
    currentRotationVal = currentRotationVal + 180;
  }
  // タップを離した時、マイナス方向に半分以上めくれていたら最後までめくる
  if(currentRotationVal + endPointX < currentRotationVal - 90) {
    currentRotationVal = currentRotationVal - 180;
  }

  // transitionしつつめくる
  $flip.addClass('is-animating');
  $flipInner.css('transform', 'rotateY(' + currentRotationVal + 'deg)');
  animating = true;

  setTimeout(() => {
    // cssで設定したduration分動いたら、transitionを切る
    $flip.removeClass('is-animating');
    animating = false;
  }, DURATION);

  // スワイプし始めた位置を初期化
  startPointX = 0;
};

// 回転
let roll = (rotationVal) => {
  $flipInner.css('transform', 'rotateY(' + (rotationVal) + 'deg)');
};

// リセット用イベント
$(window).on('resize', judgeDevice);

// イベント
$flip.on('touchstart', touchStartHandler);
$flip.on('touchmove', touchMoveHandler);
$flip.on('touchend', touchEndHandler);
$flip.on('mouseover', (e) => {
  if ($(e.currentTarget).hasClass('is-pc')) {
    $(e.currentTarget).addClass('is-hover');
  }
});

$flip.on('mouseout', (e) => {
  if ($(e.currentTarget).hasClass('is-pc')) {
    $(e.currentTarget).removeClass('is-hover');
  }
});

// 初期化
judgeDevice();
