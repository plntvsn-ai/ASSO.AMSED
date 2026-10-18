import { runMasterRobot } from "./bossOrchestrator";

export async function autoGenerateAndPublish() {
  try {
    const res = await runMasterRobot({ force: true });
    return {
      success: true,
      topic: res.topic || res.published,
      published: res.published || res.topic,
      article: res.article
    };
  } catch (err) {
    console.error("autoGenerateAndPublish error:", err);
    return {
      success: false,
      error: err.message
    };
  }
}

export const executeAutoPublish = autoGenerateAndPublish;
export default autoGenerateAndPublish;
