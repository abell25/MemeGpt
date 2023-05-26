function showMessage(message) {
    if (message) { console.log(`showMessage: ${message}`); }
    document.getElementById('messageArea').innerHTML = message;
}
function clearMessage() { showMessage(''); }

function showChatMessage(message) {
    let span = document.createElement('span');
    span.className = 'chatMessage';
    span.innerHTML = message;
    let chatLog = document.getElementById('chatLog');
    chatLog.appendChild(span);
    chatLog.scrollTo(0, chatLog.scrollHeight);
    return span;
}


(() => {
    let chatGptManager = ChatGptManager();
    let memeGenerator = MemeGenerator();

    document.getElementById('sendButton').addEventListener('click', function() {
        let message = document.getElementById('chatInput').value;
        chatGptManager.getMeme(message).then((response) => {
            let parsedResponse = memeGenerator.parseMemeText(response['rawText']);



            let span = document.createElement('span');
            span.className = 'chatMessage';
            let memeUrl = parsedResponse['memeUrl'];
            let textWithboxCoordinates = parsedResponse['captionsWithCoords'];
            memeGenerator.showTextOverImage(span, memeUrl, textWithboxCoordinates)

            let chatLog = document.getElementById('chatLog');
            chatLog.appendChild(span);
            chatLog.scrollTo(0, chatLog.scrollHeight);


            console.log('-------parsed response:-------')
            console.log(parsedResponse)
            //showChatMessage(response['rawText']);
            console.log(`response: <<${response}>>`);
            document.getElementById('chatInput').value = ''; 
        });
    });

})();