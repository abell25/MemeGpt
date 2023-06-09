const CHATGPT_API_KEY = 'chatGptApiKey';
const MAX_NUM_MEME_CHOICES = 35;

const MODEL_TO_ENDPOINT_LOOKUP = {
    "gpt-4": "/v1/chat/completions",
    "gpt-4-0314": "/v1/chat/completions",
    "gpt-4-32k": "/v1/chat/completions",
    "gpt-4-32k-0314": "/v1/chat/completions",
    "gpt-3.5-turbo": "/v1/chat/completions",
    "gpt-3.5-turbo-0301": "/v1/chat/completions",
    "text-davinci-003": "/v1/completions",
    "text-davinci-002": "/v1/completions",
    "text-curie-001": "/v1/completions",
    "text-babbage-001": "/v1/completions",
    "text-ada-001": "/v1/completions",  
}

var ChatGptManager = function() {

    function getApiKey() {
        const storedToken = localStorage.getItem(CHATGPT_API_KEY);
        if (storedToken) { return storedToken; }
        const token = prompt('Please enter your OpenAI API key:').replace('Bearer ', '');
        localStorage.setItem(CHATGPT_API_KEY, token);
        return token;
    }

    function clearApiKey() {
        localStorage.removeItem(CHATGPT_API_KEY);
    }

    function getSettings() {
        return {
            'modelName': document.getElementById('modelName').value,
            'temperature': parseFloat(document.getElementById('temperature').value),
            'maxTokens': parseInt(document.getElementById('maxTokens').value),
            'numMemes': parseInt(document.getElementById('numMemes').value),
        };
    }

    function sendChatMessage(message) {
        let settings = getSettings(); 
        let endpoint = MODEL_TO_ENDPOINT_LOOKUP[settings.modelName];
        if (endpoint === '/v1/chat/completions') {
            return sendChatMessage_v1ChatCompletions(message, settings);
        } else if (endpoint === '/v1/completions') {
            return sendChatMessage_v1Completions(message, settings);
        } else {
            console.error(`Unknown endpoint: ${endpoint}`);
        }
    }

    function sendChatMessage_v1ChatCompletions(message, settings) {
        console.log(`prompt: <<${message}>>`);
        return fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getApiKey()}`,
          },
          body: JSON.stringify({
              "model": settings.modelName,
              "messages": [{"role": "user", "content": message}],
              "max_tokens": settings.maxTokens,
              "temperature": settings.temperature,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server
            // Use data as needed
            let response = data.choices[0]['message']['content'].trim('\n');
            console.log(`\nchatGPT response:\n================\n${response}\n================\n`);
            return response;
          })
          .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
          });
    }

      function sendChatMessage_v1Completions(message, settings) {
        console.log(`prompt: <<${message}>>`);
        return fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getApiKey()}`,
          },
          body: JSON.stringify({
              "model": settings.modelName,
              "prompt": message,
              "max_tokens": settings.maxTokens,
              "temperature": settings.temperature,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server
            // Use data as needed
            let response = data.choices[0].text.trim('\n');
            console.log(`\nchatGPT response:\n================\n${response}\n================\n`);
            return response;
          })
          .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
          });
      }

    function getPrompt(message) {
        let settings = getSettings(); 

        let meme_desc_strs = memes
            .map(x => `        * ${x.name} [${Object.keys(x.captions).join(', ')}]`)
            .sort(() => (Math.random() > .5) ? 1 : -1)
            .slice(0, MAX_NUM_MEME_CHOICES)
            .join('\n');

        return `
        You are memeGpt, instead of replying with text you will instead be replying with a meme, either to answer their question to generate a funny meme about the topic they specify.
        Here are the lists of memes you can reply with (with the format "memeName [caption1, caption2, ...]"):
        # MEMES_LIST:
${meme_desc_strs}

        The first line of your response should only contain the name of the meme you want to reply with along with the caption fields text, here are some example queries with an example output:
        User: 'sowing doubt'
	MemeGpt: 'Disaster Girl ["", "me sowing seeds of doubt"]'

	User: 'always worried i am sick'
	MemeGpt: 'Is this a pigeon ["my body", "any slightly unconfortable sensation", "is this death?"]'

	User: 'US Inflation'
	MemeGpt: 'Bike Fall ["US economy", "Increases the money supply by 40% in a single year", "Bitcoin is destablizing us!"]'

        If more than one meme is requested then put each meme on a new line, for example:
        'Always Has Been ["wait its all ohio?", "its always been ohio"]'
        'Woman Yelling At Cat ["Ohio isnt a meme", "but i like it"]'
        'Surprised Pikachu ["ohio", "its not just a meme"]'

        Anything written afterwards the first K lines will be ignored, where K is the number of memes requested.

        Please give ${settings['numMemes']} meme responses to the following message:
        "${message}"
        `;
    }

    function getMeme(message) {
        return sendChatMessage(getPrompt(message)).then((response) => {
            //var regex = /(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/;
            //let move = response.match(regex).slice(1, 5).map(x => parseInt(x));
            let message = response.split('\n').slice(1).join('\n').trim('\n');

            return {'rawText': response};
        });
    }


    return {
        sendChatMessage: sendChatMessage,
        getMeme: getMeme,

    }
}
