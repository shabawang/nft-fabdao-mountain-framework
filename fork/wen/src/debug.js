import Stats from "stats.js";
import Scheduler from "scheduling";
const stats = new Stats();
if (process.env.NODE_ENV === "development") {
  document.body.appendChild(stats.domElement);
}

Scheduler.addEF(() => {
  stats.update();
});
