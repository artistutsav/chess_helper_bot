import subprocess
import chess
import chess.engine
import configparser
import logging
import tensorflow as tf

# Function to read configurations from chess.conf
def read_config():
    config = configparser.ConfigParser()
    config.read('chess.conf')
    return config

# Read configurations from chess.conf
config = read_config()
log_filepath = config.get('logpath', 'log_filepath')  # Define log file path here

# Configure logging
logging.basicConfig(filename=log_filepath, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_tensorflow_chessbot(image_filepath, tensorflow_path):
    # Run TensorFlow chessbot and capture the output
    command = ["python3", tensorflow_path, "--filepath", image_filepath]
    result = subprocess.run(command, capture_output=True, text=True)

    # Log command and result
    logging.info(f"Command executed: {' '.join(command)}")
    logging.info("Output:")
    logging.info(result.stdout)
    logging.info("Error:")
    logging.info(result.stderr)

    # Check for errors in the TensorFlow chessbot output
    if result.returncode != 0:
        logging.error("Error running TensorFlow chessbot:")
        logging.error(result.stderr)
        return None

    # Parse the output to extract FEN
    output_lines = result.stdout.split('\n')
    fen_index = output_lines.index('Predicted FEN:') + 1
    predicted_fen = output_lines[fen_index].strip()

    return predicted_fen

def get_best_move(fen, stockfish_path):
    # Initialize a chess board with the given FEN
    board = chess.Board(fen)

    # Configure Stockfish engine
    with chess.engine.SimpleEngine.popen_uci(stockfish_path) as engine:
        # Get the best move from Stockfish
        result = engine.play(board, chess.engine.Limit(time=2.0))  # You can adjust the time limit as needed
        best_move = result.move

    return best_move

# Example: Run TensorFlow chessbot on the image file
image_filepath = config.get('chessbot', 'image_filepath')
tensorflow_path = config.get('chessbot', 'tensorflow_path')
predicted_fen = run_tensorflow_chessbot(image_filepath, tensorflow_path)

if predicted_fen:
    logging.info("Predicted FEN: " + predicted_fen)

    # Get the best move from Stockfish
    stockfish_path = config.get('stockfish', 'executable_path')
    best_move = get_best_move(predicted_fen, stockfish_path)
    logging.info("Best Move: " + best_move.uci())

    # Write the best move to the file
    best_move_filepath = config.get('output', 'best_move_filepath')
    with open(best_move_filepath, 'w') as file:
        best_move_str = best_move.uci()
        file.write(best_move_str)

    logging.info("Best Move: " + str(best_move))
