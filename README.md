**Chess Helper Bot**
This repository contains a Chess Helper Bot designed to assist users in analyzing chess positions and providing the best move suggestions using iphone Shortcuts. The bot utilizes TensorFlow for image recognition to analyze the chessboard position and then employs the Stockfish engine to determine the best move.

**Components:**

**iOS Shortcut. download: **
iPhone_shortcut/chess_helper_bot_Shortcut_app.shortcut in your apple device.
• A custom shortcut is provided for iOS devices using the Shortcuts app. This shortcut allows users to capture the screen, convert the captured image to base64, and send it to the Node.js server for processing. 
• Users can trigger this shortcut using a gesture in accessibility. 
2. nodeserver.js 
• This file contains the API gateway responsible for receiving base64 encoded images of chess positions, decoding them, running TensorFlow to analyze the position, and finally using Stockfish to determine the best move. 
• It's a Node.js application built with Express.js. 
3. app.py: • This Python script serves as the interface to execute TensorFlow for image recognition and Stockfish for calculating the best move. 
• It reads configurations from chess.conf, executes TensorFlow for image recognition, retrieves the predicted FEN (Forsyth-Edwards Notation), and then utilizes Stockfish to determine the best move.

Installation and Setup:

a. Clone the repository: 
git clone https://github.com/yourusername/chess-helper-bot.git 
b. Install dependencies: 
• For the Node.js part, ensure you have Node.js installed and run: npm install 
• For the Python part, ensure you have Python 3.x installed with TensorFlow and Stockfish. Install required packages via: pip install -r requirements.txt 
c. Configuration: 
• Configure config.json and chess.conf files according to your setup. • Ensure proper paths to TensorFlow, Stockfish, log files, and other configurations.

Usage:

Start the API gateway: node nodeserver.js This will start the Express server on port 3000 by default.
Send base64 encoded images to the endpoint /receive-base64 along with the base64 encoded text in the request body.
Additional Notes: 
• Make sure to adjust the time limit for Stockfish according to your requirements. • Ensure that the paths specified in the configurations (config.json and chess.conf) are correct and accessible.

Feel free to extend and customize this Chess Helper Bot according to your needs! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. 
