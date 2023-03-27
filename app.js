/**
 * Slack App Setting
 * Enable Socket Mode
 * Enable Event Subscriptions
 * OAuth & Permissions: app_mentions:read, chat:write
 * @slack/bolt requires at least NodeJs version 12.13.0
 */
const { App } = require("@slack/bolt");
const config = require("./config");
const { cache, openAIApi } = require("./openai/configuration");
const OpenAICommand = require("./openai/OpenAICommands");
const logger = require("./logger").getLogger("app");

const PORT = process.env.PORT || 3000;

const app = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
  socketMode: true,
  appToken: config.slack.appToken,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: PORT,
});

const openAICommand = new OpenAICommand(openAIApi, cache, config.openAI);

app.event("app_mention", async ({ event, say }) => {
  logger.debug("app_mention", event);

  try {
    const id = `${event.channel}_${event.user}`;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });

    await say({
      text: answer,
      thread_ts: event.ts,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${event.user}> ${answer}`,
          },
        },
      ],
    });

    logger.debug("app_mention completed");
  } catch (error) {
    logger.error(error);
  }
});

app.message(async ({ event, say }) => {
  logger.debug("message", event);

  try {
    const id = event.user;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });

    await say({text: answer, thread_ts: event.ts});

    logger.debug("message completed");
  } catch (error) {
    logger.error(error);
  }
});

app.command("/gen_image", async ({ command, ack, say }) => {
  logger.debug("/gen_image", command);

  try {
    await ack(); // Acknowledge command request
    const base64Str = await openAICommand.generateImage(command.text);
    const buffer = Buffer.from(base64Str, "base64");
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${command.user_id}> ${command.text}`,
          },
        },
      ],
    });
    await app.client.files.upload({
      channels: command.channel_id,
      file: buffer,
      filename: "image.png",
      filetype: "auto",
      title: command.text,
    });

    logger.debug("/gen_image completed");
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(PORT);

  logger.log("⚡️ SLackbot app is running!");
  logger.log("log level: ", logger.level);
  logger.log(PORT !== undefined ? "We were able to bind port" : "Hmm port is missing..")  
})();
