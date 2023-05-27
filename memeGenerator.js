var MemeGenerator = function() {

    let memeLookup = memes.reduce((d, x) => { d[x.name.lowerCase()] = x; return d; }, {});

    function parseMemeText(memeText) {
        const pattern = /(.+?)\s+(\[.+\])/;
        const matches = memeText.match(pattern);
        if (!matches) {
            throw new Error(`Error parsing meme text: ${memeText}`);
        }
        const memeName = matches[1].trim();
        const memeCaptionValues = JSON.parse(matches[2]);

        const currentMeme = memeLookup[memeName.lowerCase()];
        const imageUrl = currentMeme[`./data/labeled/${currentMeme['filename']}`]
        const currentMemeCaptionKeys = Object.keys(currentMeme['captions'])
        const currentMemeCaptionCoords = Object.values(currentMeme['captions'])

        var captionsWithCoords = []
        for (let i=0; i< memeCaptionValues.length; i+= 1) {
            captionsWithCoords.push([memeCaptionValues[i], currentMemeCaptionCoords[i]])
        }

        return {
            'memeName': memeName,
            'memeUrl': './data/labeled/' + currentMeme['filename'],
            'captionsWithCoords': captionsWithCoords,
        }



    }

    function showChatMessage(message) {
        let span = document.createElement('span');
        span.className = 'chatMessage';
        span.innerHTML = message;
        let chatLog = document.getElementById('chatLog');
        chatLog.appendChild(span);
        chatLog.scrollTo(0, chatLog.scrollHeight);
    }

    function loadImage(imageUrl) {
        let image = new Image();
        image.src = imageUrl;
        return image;
    }

    function showTextOverImage(imageDiv, imageUrl, textWithboxCoordinates) {
        // Create a new image element
        var image = loadImage(imageUrl)
      
        // Wait for the image to load
        image.onload = function() {
          // Create a new canvas element
          var canvas = document.createElement('canvas');
          
          // Set the width and height of the canvas to match the image
          canvas.width = image.width;
          canvas.height = image.height;
      
          // Get the 2D context of the canvas
          var context = canvas.getContext('2d');
          
          // Draw the image on the canvas
          context.drawImage(image, 0, 0);
          
          // Set the font and text color
          context.font = '32px Arial';
          context.fillStyle = 'rgb(100, 255, 100)';
          
          textWithboxCoordinates.forEach(([text, boxCoordinates]) => {
            
            // Set the box coordinates
            var x = boxCoordinates[0];
            var y = boxCoordinates[1];
            var width = boxCoordinates[2] - boxCoordinates[0];
            var height = boxCoordinates[3] - boxCoordinates[1];
        
            //// Draw a rectangle over the specified coordinates
            //context.fillRect(x, y, width, height);
            
            // Set the text position within the box
            var textX = x + 10; // Adjust the value to change the horizontal position
            var textY = y + height / 2; // Adjust the value to change the vertical position
            
            // Display the text within the box
            context.fillStyle = 'rgb(100, 255, 100)';
            context.fillText(text, textX, textY);
          });
          
          // Append the canvas to the document body or any desired element
          imageDiv.appendChild(canvas);
        };
    }
      

    return {
        parseMemeText: parseMemeText,
        showTextOverImage: showTextOverImage,

    }
};