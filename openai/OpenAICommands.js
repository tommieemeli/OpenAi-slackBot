const roles = require("./roles");
const logger = require("../logger").getLogger("OpenAICommand");

class OpenAICommand {
  constructor(openAIApi, cache, config) {
    this.openAIApi = openAIApi;
    this.cache = cache;
    this.config = config;
  }

  async createCompletion(prompt, options) {
    const completion = await this.openAIApi.createCompletion({
      model: "gpt-4",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    });

    return completion.data.choices[0].text;
  }

  async chat(id, message, options) {
    // get last messages from cache
    let lastMessages = this.cache.get(id) ?? [];
    lastMessages = [...lastMessages, { role: roles.USER, content: message }];
    // consider response from OpenAI, we keep only the last N - 1 messages
    lastMessages = lastMessages.slice(-this.getNumOfMessages() + 1);

    const systemMessages = this.config.chat.systemMessage
      ? [
          {
            role: roles.SYSTEM,
            content: this.config.chat.systemMessage,
          },
        ]
      : [];

    const res = await this.createChatCompletion(
      [...systemMessages, ...lastMessages],
      options
    );

    // Add the assistant's response to the array of messages and update the cache
    this.cache.set(
      id,
      [...lastMessages, { role: roles.ASSISTANT, content: res }],
      this.config.chat.ttl
    );

    logger.debug("cached messages: ", this.cache.get(id));

    return res;
  }

  getNumOfMessages() {
    const numOfMessages = this.config.chat.numOfMessages;

    if (numOfMessages < 2) {
      throw new Error("OPENAI_CHAT_NUM_OF_MESSAGES must be >= 2.");
    }

    if (numOfMessages % 2 !== 0) {
      throw new Error("OPENAI_CHAT_NUM_OF_MESSAGES must be an even number.");
    }

    return numOfMessages;
  }

  async createChatCompletion(messages, options) {
    const completion = await this.openAIApi.createChatCompletion({
      model: "gpt-4",
      messages,
      ...options,
    });

    return completion.data.choices[0].message.content;
  }

  async generateImage(prompt) {
    const res = await this.openAIApi.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    return res.data.data[0].b64_json;
  }
}

module.exports = OpenAICommand;