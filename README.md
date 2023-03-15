SLACK_SIGNING_SECRET: found under Basic Information > App Credentials > Signing Secret
SLACK_BOT_TOKEN: found under OAuth & Permissions > Bot User OAuth Token
SLACK_APP_TOKEN: found under Basic Information > App-Level Tokens, click on the token name to obtain it
OPENAI_API_KEY
OPENAI_CHAT_NUM_OF_MESSAGES: Number of messages bot will cache. It's used for appending previous conversioations when calling chat completions API. MUST BE EVEN. Default value: 2.
OPENAI_CHAT_TTL: The duration of time (second) that messages will be kept. Default value: null (keep forever).
OPENAI_CHAT_SYSTEM_MESSAGE: First messsage to help set the behavior of the assistant. Default value: null.
