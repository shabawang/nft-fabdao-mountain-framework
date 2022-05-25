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
  };

  const gui = new dat.GUI({ width: 300 });
  window.gui = gui;
  dat.GUI.toggleHide();

  gui.add(Config, "autoSave").onFinishChange(reload);
  gui.add(Config, "maxHeight", 1, 5).onFinishChange(reload);
  gui.add(Config, "noiseScale", 0.1, 5).onFinishChange(reload);
  gui.add(Config, "withMoon").onFinishChange(reload);
  gui.add(Config, "withShooringStar").onFinishChange(reload);
  gui.add(Config, "withSnow").onFinishChange(reload);
  gui.add(Config, "withFrame").onFinishChange(reload);
  gui.add(Config, "withStretchLine").onFinishChange(reload);
  gui.add(Config, "pixelated").onFinishChange(reload);
  gui.add(Config, "mountainShade").onFinishChange(reload);
  const fInteraction = gui.addFolder("Interactions");
  fInteraction.add(Config, "withPetals").onFinishChange(reload);
  fInteraction.add(Config, "withMonolith").onFinishChange(reload);
  fInteraction.add(Config, "withFireworks").onFinishChange(reload);
  fInteraction.add(Config, "withMilkyway").onFinishChange(reload);
  fInteraction.open();
  gui
    .add(Config, "colorTheme", ["Sunset", "Night", "Green", "Foggy", "Blue"])
    .onFinishChange(reload);

  gui.add(Config, "pixelRatio", [1, 2]).onFinishChange(reload);
  gui.add(oControl, "save").name("Save Settings");
  gui.add(Settings, "reset").name("Reset Default");
};
