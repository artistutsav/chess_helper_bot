const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Load configuration from file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Increase the request payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Endpoint to handle base64 encoded text
app.post('/receive-base64', (req, res) => {
  const base64Text = req.body.base64Text;

  if (!base64Text) {
    console.error('Base64 text is required');
    return res.status(400).json({ status: 'error', message: 'Base64 text is required' });
  }

  // Decode base64 and save as a PNG file
  const base64Data = base64Text.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(config.outputFilePath, base64Data, 'base64');
  console.log('Base64 text saved as output.png');

  // Set TF_CPP_MIN_LOG_LEVEL=2 environment variable
  process.env.TF_CPP_MIN_LOG_LEVEL = '2';

  // Run the app.py script in a child process
  const pythonProcess = spawn('python3', [config.scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });

  // Capture the stdout and stderr of the Python script
  let pythonScriptOutput = '';
  let pythonScriptError = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonScriptOutput += data.toString(); // Convert data to string
    console.log(`Python Script Output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    pythonScriptError += data.toString(); // Convert data to string
    console.error(`Error from Python Script: ${data}`);
  });

  // Listen for the Python script to exit
  pythonProcess.on('close', (code) => {
    console.log(`Python Script exited with code ${code}`);

    if (code === 0) {
      fs.readFile(config.bestMoveFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading best move file: ${err.message}`);
          return res.status(500).json({ status: 'error', message: 'Error reading best move file' });
        }

        const bestMove = data.trim();

        // Format the move by inserting a space between source and destination squares
        const formattedMove = bestMove.substr(0, 2) + " " + bestMove.substr(2, 2);
        console.log(`Formatted move: ${formattedMove}`);

        // Send the final response with the formatted move
        res.json({ status: 'success', message: 'Base64 text received, saved as output.png, and app.py completed', formattedMove });
      });
    } else {
      console.error('Error running app.py:', pythonScriptError);
      res.status(500).json({ status: 'error', message: 'Error running app.py', error: pythonScriptError });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
