Obtain the following keys and add them to a `.env` file at the root of the project directory:

- `SLACK_SIGNING_SECRET`: found under `Basic Information > App Credentials > Signing Secret`
- `SLACK_BOT_TOKEN`: found under `OAuth & Permissions > Bot User OAuth Token`
- `SLACK_APP_TOKEN`: found under `Basic Information > App-Level Tokens`, click on the token name to obtain it
- `OPENAI_API_KEY`
- `OPENAI_CHAT_ENABLE_SUMMARIZE`: If enabled, it will call OpenAPI chat completion to summarize previous conversioations when number of messages cached >= `OPENAI_CHAT_NUM_OF_MESSAGES`. Default value: false.
- `OPENAI_CHAT_NUM_OF_MESSAGES`: Number of messages bot will cache. It's used for appending previous conversioations when calling chat completions API. MUST BE EVEN. Default value: 2.
- `OPENAI_CHAT_TTL`: The duration of time (second) that messages will be kept. Default value: null (keep forever).
- `OPENAI_CHAT_SYSTEM_MESSAGE`: First messsage to help set the behavior of the assistant. Default value: null.

Your `.env` file should look like this:

```
OPENAI_API_KEY=xxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxx
SLACK_SIGNING_SECRET=xxxxxx
SLACK_APP_TOKEN=xapp-xxxxxx
OPENAI_CHAT_ENABLE_SUMMARIZE=false
OPENAI_CHAT_NUM_OF_MESSAGES=4
OPENAI_CHAT_TTL=1200
OPENAI_CHAT_SYSTEM_MESSAGE="You are a helpful assistant."
```

## Getting Started

To get started with the bot, follow these steps:

1. Install the necessary dependencies by running `npm install`
2. Start the bot by running `npm start`
