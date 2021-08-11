const accessToken = "";
const uniqueMeetingId = btoa("neeraj@example.com");
const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;

const ws = new WebSocket(symblEndpoint);

// Fired when a message is received from the WebSocket server
ws.onmessage = (event) => {
  // You can find the conversationId in event.message.data.conversationId;
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.type === 'message' && data.message.hasOwnProperty('data')) {
    console.log('conversationId', data.message.data.conversationId);
  }
  if (data.type === 'message_response') {
    for (let message of data.messages) {
      console.log('Transcript (more accurate): ', message.payload.content);
    }
  }
  if (data.type === 'topic_response') {
    for (let topic of data.topics) {
      console.log('Topic detected: ', topic.phrases)
    }
  }
  if (data.type === 'topic_response') {
    for (let topic of data.topics) {
      console.log('Topic detected: ', topic.phrases)
    }
  }
  if (data.type === 'insight_response') {
    for (let insight of data.insights) {
      console.log('Insight detected: ', insight.payload.content);
    }
  }
  if (data.type === 'message' && data.message.hasOwnProperty('punctuated')) {
    console.log('Live transcript (less accurate): ', data.message.punctuated.transcript)
  }
  if (data.type === 'tracker_response') {
                
                console.log("tracker_response " + JSON.stringify(data.trackers[0].name));
                console.log("tracker_response data " + JSON.stringify(data));
  }
  console.log(`Response type: ${data.type}. Object: `, data);
};

// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
ws.onerror  = (err) => {
  console.error(err);
};

// Fired when the WebSocket connection has been closed
ws.onclose = (event) => {
  console.info('Connection to websocket closed');
};

// Fired when the connection succeeds.
ws.onopen = (event) => {
  ws.send(JSON.stringify({
    type: 'start_request',
    meetingTitle: 'Websockets How-to', // Conversation name
    insightTypes: ['question', 'action_item'], // Will enable insight generation
    trackers: [

  {
    "name": "Agent Politeness",
    "vocabulary": ["Anything I Can Help With",
      "something I can help you with",
      "How can I help you",
      "appreciate your business",
      "appreciate your help",
      "appreciate your valued business",
      "appreciate your time",
      "appreciate your patience,",
      "excuse me",
      "if you don't mind",
      "beg your pardon",
      "thank you for your patience",
      "Glad to help",
      "happy to help",
      "no worries",
      "it have been my pleasure",
      "thank you for choosing us",
      "happy to return your call as soon as possible",
      "have a great day",
      "have an amazing day",
      "have a great rest of your day",
      "have a good evening",
      "have a good morning",
      "have a good afternoon",
      "how are you",
      "I am sorry",
      "we are extremely sorry",
      "I am sorry we are just a second away",
      "I am sorry stay on the line momentarily",
      "I am sorry I didn't hear you",
      "Please let me",
      "Please wait please",
      "Please confirm",
      "Please will you",
      "Please can we",
      "Please wait",
      "Sir thanks",
      "Maam thanks",
      "Thank you, pleasure",
      "Thank you, awesome",
      "you're welcome"
    ]
  },{
    "name": "Compliments",
    "vocabulary": [
      "Thank you for giving us opportunity to serve you",
      "Thank you for your business",
      "Thank you for your support",
      "I appreciate you being so enthusiastic about following this up",
      "I think you’re just being humble",
      "I’m always happy to have a conversation with such a friendly person",
      "It is great that you have been so thorough in your research",
      "It is very responsible of you to have made that decision",
      "Thank you for being so observant and spotting our mistake",
      "Thank you for being so patient with me on this",
      "You are very generous to say that",
      "You have been very cooperative",
      "which makes my job a lot easier",
      "Your feedback has been very helpful",
      "I will share it with",
      "I guess I just like your company"
    ]
  }
  ],
    config: {
      confidenceThreshold: 0.5,
      languageCode: 'en-US',
      speechRecognition: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
      }
    },
    speaker: {
      userId: 'example@symbl.ai',
      name: 'Example Sample',
    }
  }));
};

const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

/**
 * The callback function which fires after a user gives the browser permission to use
 * the computer's microphone. Starts a recording session which sends the audio stream to
 * the WebSocket endpoint for processing.
 */
const handleSuccess = (stream) => {
  const AudioContext = window.AudioContext;
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);
  const gainNode = context.createGain();
  source.connect(gainNode);
  gainNode.connect(processor);
  processor.connect(context.destination);
  processor.onaudioprocess = (e) => {
    // convert to 16-bit payload
    const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
    const targetBuffer = new Int16Array(inputData.length);
    for (let index = inputData.length; index > 0; index--) {
        targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
    }
    // Send audio stream to websocket.
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(targetBuffer.buffer);
    }
  };
};


handleSuccess(stream);
