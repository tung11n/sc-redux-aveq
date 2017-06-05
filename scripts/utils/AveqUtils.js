var live = false;
var webSocket;
var streamId;
const token = 'dfca6698a71b1d51bb9a2947270364a072664085212a5f5edaa87d0cdc52881a';
const endpoint = 'wss://aveq.io/api/s/host'; //'ws://localhost:4567/s/host'; //

export function toggleStream(streamName, streamDesc) {
  if (!live) {
    webSocket = new WebSocket(endpoint);
    webSocket.onopen = function() { start(streamName, streamDesc); };
    webSocket.onmessage = function (msg) { updateStatus(msg); };
    webSocket.onclose = function () { live = false; };
    webSocket.onerror = function (e) { alert(JSON.stringify(e));};
  }
  else {
    console.log('Closing stream');
    sendCommand('DISCONNECT', streamId, 'Finished');
  }
}

function start(streamName, streamDesc) {
  let payload = new Object();
  payload.name = streamName;
  payload.description = streamDesc;
  payload.userName = 'digitalage';
  payload.token = token;
  sendCommand('NEW_STREAM', '', payload);
}

export function message(text) {
  if (live) {
    let payload = new Object();
    sendCommand('ADD_MESSAGE', streamId, text);
  }
}

export function play(value) {
  if (live) {
    let payload = new Object();
    payload.id = value.id;
    payload.title = value.title;
    payload.duration = value.duration;
    payload.artworkUrl = value.artwork_url;
    payload.trackUrl = value.uri;
    payload.artist = value.user;
    payload.type = 'AUDIO';
    sendCommand('ADD_TRACK', streamId, payload);
  }
}

export function progress(value) {
  if (live) {
    let payload = new Object();
    payload.streamId = streamId;
    payload.currentPosition = value.currentPosition;
    sendCommand('PLAY_PROGRESS', streamId, payload);
  }
}

function sendCommand(cmd, streamId, payload) {
  let command = new Object();
  command.command = cmd;
  command.streamId = streamId;
  command.payload = payload;//JSON.stringify(payload);
  webSocket.send(JSON.stringify(command));
}

function updateStatus(msg) {
    let command = JSON.parse(msg.data);
    //console.log('Payload=' + msg.data);
    switch (command.command) {
      case 'HOST_STATUS':
        let stream = command.payload;
        streamId = stream.id;
        console.log('Stream created. id=' + streamId + ', name="' + stream.name + '"');
        live = true;
        break;
      case 'DISCONNECTED':
        console.log('Stream closed. id=' + streamId);
        live = false;
        break;
      default:
        break;
    }
}
