import { GL } from "alfrid";

import * as dat from "dat.gui";
import Config from "../Config";
import Settings from "../Settings";
import { saveJson } from "./";

export default (scene) => {
  const { refresh, reload } = Settings;
  const oControl = {
    save: () => {
      saveJson(Config, "Settings");
    },
    generate: () => {
      reload();
    },
  };

  const gui = new dat.GUI({ width: 300 });
  window.gui = gui;

  gui.add(Config, "autoSave").onFinishChange(reload);
  gui.add(Config, "mountainHeight", 2, 4).onFinishChange(reload);
  gui.add(Config, "stopAfterRender").onFinishChange(reload);
  gui.add(Config, "withSnow").onFinishChange(reload);
  gui.add(Config, "withFrame").onFinishChange(reload);
  gui.add(Config, "withStretchLine").onFinishChange(reload);
  gui.add(Config, "pixelated").onFinishChange(reload);
  gui.add(Config, "smooth").onFinishChange(reload);
  gui.add(Config, "mountainShade").onFinishChange(reload);

  const fExtra = gui.addFolder("Extra Settings");
  fExtra.add(Config, "fogStrength", 0, 1).onFinishChange(reload);
  fExtra.add(Config, "fov", 10, 160).onFinishChange(() => {
    reload();
  });
  fExtra.addColor(Config, "bgColor").onFinishChange(refresh);
  fExtra.addColor(Config, "fogColor").onFinishChange(refresh);

  gui
    .add(Config, "colorTheme", ["Sunset", "Night", "Green", "Foggy", "Blue"])
    .onFinishChange(reload);
  gui.add(oControl, "generate").name("Generate");
  gui.add(oControl, "save").name("Save Settings");
  gui.add(Settings, "reset").name("Reset Default");
};
