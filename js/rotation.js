// UA判定のJSライブラリーを実行
const uAParser = UAParser();

const $flip = $('.js-flip');
const $flipInner = $('.js-flip-inner');

// コインフリップ関数
const coinflip = () => {

  // イージング関数
  let easing = (count, b, c, d, s) => {
    if (s === undefined) s = 1.70158;
    return c * ((count = count / d - 1) * count * ((s + 1) * count + s) + 1) + b;
  };

  // 回転中の状態から元に戻す
  let reset = () => {
    $flipInner.css('transform', '');
  };

  let frame = 20;
  let count = 0;
  let rotation = {
    x: 0,
    y: 0
  };
  // さわり始めた時のx座標とy座標を保存
  let point = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  };
  let tmp = {
    x: 0,
    y: 0
  };
  let moving = false;
  let animating = false;

  let touchStartHandler = (e) => {
    if (uAParser.device.type !== 'mobile') return;
    if (moving) return;
    let touch = e.originalEvent.touches[0];
    point.x = touch.screenX;
    point.y = touch.screenY;
    point.dx = 0;
    point.dy = 0;
    console.log('touchStartHandler', point.x);
    console.log('touchStartHandler', point.y);
    console.log('touchStartHandler', point.dx);
    console.log('touchStartHandler', point.dy);
  };

  let touchMoveHandler = (e) => {
    if (uAParser.device.type !== 'mobile') return;
    if (animating) return;
    moving = true;
    let touch = e.originalEvent.touches[0];
    let x = (touch.screenX - point.x);
    let y = (touch.screenY - point.y);
    point.dx += x;
    point.dy += y;

    if (Math.abs(point.dx) > 10) {
      e.preventDefault();
    }

    point.x = touch.screenX;
    point.y = touch.screenY;
    console.log('touchMoveHandler', point.x);
    console.log('touchMoveHandler', point.y);
    console.log('touchMoveHandler', point.dx);
    console.log('touchMoveHandler', point.dy);

    if (point.dx > 180) {
      point.dx = 180;
    } else if (point.dx < -180) {
      point.dx = -180;
    }

    roll(point.dx);
  };

  let touchEndHandler = () => {
    if (uAParser.device.type !== 'mobile') return;
    if (!moving || animating) {
      return;
    }
    moving = false;
    point.x = point.y = 0;
    tmp.x = rotation.x + point.dx;
    tmp.y = rotation.y + point.dy;
    console.log('touchEndHandler', point.x);
    console.log('touchEndHandler', point.y);
    console.log('touchEndHandler', point.dx);
    console.log('touchEndHandler', point.dy);
    if (point.dx > 45) {
      tmp.lx = rotation.x + 180;
    } else if (point.dx < -45) {
      tmp.lx = rotation.x - 180;
    } else {
      tmp.lx = rotation.x;
    }
    animating = true;
    tmp.ly = 0;
    count = 0;
    setTimeout(loopHandler, 16);
  };

  let loopHandler = () => {
    let rx = easing(count, tmp.x, tmp.lx - tmp.x, frame - 1) - rotation.x;
    let ry = easing(count, tmp.y, tmp.ly - tmp.y, frame - 1) - rotation.y;
    if (count === frame) {
      rotation.x += rx;
      rotation.y += ry;
      animating = moving = false;
      return;
    }
    count++;
    roll(rx);
    setTimeout(loopHandler, 16);
  };

  // 計算した値を指定
  let roll = (x) => {
    $flipInner.css('transform', 'rotateY(' + (x + rotation.x) + 'deg)');
  };

  // Event
  $flip.on('touchstart', touchStartHandler);
  $flip.on('touchmove', touchMoveHandler);
  $flip.on('touchend', touchEndHandler);

  // リセット用イベント
  $(window).on('resize', reset);
};

$flip.on('mouseover', (e) => {
  if (uAParser.device.type === 'mobile') return;
  $(e.currentTarget).addClass('is-active');
});

$flip.on('mouseout', (e) => {
  if (uAParser.device.type === 'mobile') return;
  $(e.currentTarget).removeClass('is-active');
});

coinflip();
