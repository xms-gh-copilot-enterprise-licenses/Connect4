class Connect4Game {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winningCells = [];
        
        this.initializeBoard();
        this.setupEventListeners();
        this.renderBoard();
    }

    initializeBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = null;
            }
        }
    }

    setupEventListeners() {
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn.addEventListener('click', () => this.newGame());
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add click listener for all cells in the column
                cell.addEventListener('click', () => this.dropPiece(col));
                
                gameBoard.appendChild(cell);
            }
        }
        
        this.updateCurrentPlayerDisplay();
    }

    dropPiece(col) {
        if (this.gameOver) return;

        // Find the lowest available row in this column
        let targetRow = -1;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                targetRow = row;
                break;
            }
        }

        // Column is full
        if (targetRow === -1) return;

        // Update board state
        this.board[targetRow][col] = this.currentPlayer;

        // Create and animate the piece
        this.animatePieceDrop(targetRow, col, this.currentPlayer);

        // Check for win
        if (this.checkWin(targetRow, col)) {
            this.handleWin();
            return;
        }

        // Check for tie
        if (this.checkTie()) {
            this.handleTie();
            return;
        }

        // Switch players
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateCurrentPlayerDisplay();
    }

    animatePieceDrop(row, col, player) {
        const cells = document.querySelectorAll('.cell');
        const cellIndex = row * this.cols + col;
        const targetCell = cells[cellIndex];

        const piece = document.createElement('div');
        piece.className = `piece ${player}`;
        targetCell.appendChild(piece);

        // Disable column clicks during animation
        this.setColumnClickable(col, false);
        
        // Re-enable after animation
        setTimeout(() => {
            this.setColumnClickable(col, true);
        }, 600);
    }

    setColumnClickable(col, clickable) {
        const cells = document.querySelectorAll('.cell');
        for (let row = 0; row < this.rows; row++) {
            const cellIndex = row * this.cols + col;
            const cell = cells[cellIndex];
            if (clickable) {
                cell.classList.remove('disabled');
            } else {
                cell.classList.add('disabled');
            }
        }
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal /
            [1, -1]   // diagonal \
        ];

        for (let [dRow, dCol] of directions) {
            const cells = this.getConnectedCells(row, col, dRow, dCol, player);
            if (cells.length >= 4) {
                this.winningCells = cells;
                return true;
            }
        }
        return false;
    }

    getConnectedCells(row, col, dRow, dCol, player) {
        const cells = [[row, col]];

        // Check in positive direction
        let newRow = row + dRow;
        let newCol = col + dCol;
        while (this.isValidCell(newRow, newCol) && this.board[newRow][newCol] === player) {
            cells.push([newRow, newCol]);
            newRow += dRow;
            newCol += dCol;
        }

        // Check in negative direction
        newRow = row - dRow;
        newCol = col - dCol;
        while (this.isValidCell(newRow, newCol) && this.board[newRow][newCol] === player) {
            cells.unshift([newRow, newCol]);
            newRow -= dRow;
            newCol -= dCol;
        }

        return cells;
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    checkTie() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    handleWin() {
        this.gameOver = true;
        this.highlightWinningCells();
        this.showGameStatus(`${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} Player Wins!`);
    }

    handleTie() {
        this.gameOver = true;
        this.showGameStatus("It's a Tie!");
    }

    highlightWinningCells() {
        const cells = document.querySelectorAll('.cell');
        this.winningCells.forEach(([row, col]) => {
            const cellIndex = row * this.cols + col;
            const cell = cells[cellIndex];
            const piece = cell.querySelector('.piece');
            if (piece) {
                piece.classList.add('winning');
            }
        });
    }

    showGameStatus(message) {
        const gameStatus = document.getElementById('game-status');
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = message;
        gameStatus.classList.remove('hidden');
    }

    hideGameStatus() {
        const gameStatus = document.getElementById('game-status');
        gameStatus.classList.add('hidden');
    }

    updateCurrentPlayerDisplay() {
        const indicator = document.getElementById('current-player-indicator');
        indicator.textContent = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        indicator.className = `player-${this.currentPlayer}`;
    }

    newGame() {
        this.gameOver = false;
        this.currentPlayer = 'red';
        this.winningCells = [];
        this.initializeBoard();
        this.renderBoard();
        this.hideGameStatus();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Connect4Game();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Connect4Game;
}