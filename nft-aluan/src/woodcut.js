

class Woodcut {
  constructor(targetGfx, paperColor, inkColor,limit,_stroke) {

    const lines = [];
    // let unit = constrain(int(defultW*0.005),3,5);
    let unit = _stroke;
    // console.log("unit:",unit);
    const w = targetGfx.width;
    const h = targetGfx.height;
    const gfx = createGraphics(w, h);
    gfx.fill(paperColor); // '#f1e9db'
    gfx.noStroke();

    for (let i = 0; i < h / unit + 1; i++) {
      for (let j = 0; j < w / unit + 1; j++) {
        lines.push({ x: unit * j, y: unit * i });
      }
    }
    shuffle(lines, true);

    for (let i = 0; i < lines.length; i++) {
      const val =brightness(targetGfx.get(lines[i].x, lines[i].y));

      let ro=3.14/4;
      // console.log(val);
      if (val > limit) {
        gfx.push();
        {
          gfx.translate(lines[i].x, lines[i].y);
          gfx.rotate(R.random_num(-PI / 30, PI / 30));
          gfx.rotate(ro);
          gfx.ellipse(0, 0, unit * R.random_num(0.4, 0.5)*scal, unit * R.random_num(2, 6)*scal);
        }
        gfx.pop();
      }
    }
    return gfx;
  }
}
