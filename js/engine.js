/**
 * Nigerian Draughts (Draft) Engine
 * 
 * Rules Implemented:
 * - Default 10x10 board (50 active dark squares, 20 pieces per side).
 * - Men move forward 1 square diagonally.
 * - Men capture BOTH forward and backward over adjacent enemy pieces into an immediately empty square.
 * - Flying King ("Long King" / "Oga King"): moves any distance along empty diagonals;
 *   captures over enemy piece at a distance and can land on ANY vacant square beyond it.
 * - Compulsory Capture: If any capture is available, non-capturing moves are illegal.
 * - Nigerian Street Rule (Free Choice): Player can pick any capture sequence.
 * - Tournament Rule (FMJD): Player must choose the capture sequence taking the maximum pieces.
 * - Multi-jump chaining: Turn continues until no further captures are possible with the jumping piece.
 * - Captured pieces are lifted at the end of the turn (cannot jump the same piece twice in one turn).
 */

export const PLAYER_1 = 1; // Usually Light/White/Green (starts at bottom, moves up)
export const PLAYER_2 = 2; // Usually Dark/Black/Gold (starts at top, moves down)

export class NigerianDraughtsEngine {
  constructor(options = {}) {
    this.boardSize = options.boardSize || 10; // 10 (standard) or 8
    const rawRule = (options.ruleMode || options.ruleType || options.rule || 'nigeria').toString().toLowerCase().trim();
    this.ruleMode = (rawRule === 'international' || rawRule === 'tournament' || rawRule === 'fmjd')
      ? 'international'
      : (rawRule === 'ghana' || rawRule === 'damii' ? 'ghana' : 'nigeria');
    this.ruleType = this.ruleMode;
    this.p1Short = parseInt(options.p1Short || 0, 10); // 0 to 5 handicap
    this.modifications = options.modifications || 'none'; // 'crown_start_left_left', 'crown_start_middle_middle', 'ten_aside', etc.
    this.rowsPerPlayer = this.boardSize === 10 ? 4 : 3;
    this.reset();
  }

  setRuleset(rule, resetBoard = false) {
    const r = (rule || 'nigeria').toString().toLowerCase().trim();
    const prevMode = this.ruleMode;
    this.ruleMode = (r === 'international' || r === 'tournament' || r === 'fmjd')
      ? 'international'
      : (r === 'ghana' || r === 'damii' ? 'ghana' : 'nigeria');
    this.ruleType = this.ruleMode;
    if (resetBoard && prevMode !== this.ruleMode) {
      this.reset();
    }
  }

  reset() {
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
    this.currentTurn = PLAYER_1;
    this.selectedSquare = null;
    this.activeMultiJump = null; // Holds ongoing jump chain if in middle of multi-jump
    this.moveHistory = [];
    this.capturedPieces = { [PLAYER_1]: [], [PLAYER_2]: [] }; // Pieces captured BY player
    this.gameOver = false;
    this.winner = null; // PLAYER_1, PLAYER_2, or 'draw'
    this.winReason = '';
    this.halfMoveClock = 0; // for 25-king moves without capture draw rule
    this.positionCounts = new Map();

    this.setupBoard();
    this.recordPosition();
  }

  setupBoard() {
    // Clear board
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        this.board[r][c] = null;
      }
    }

    if (this.modifications === 'ten_aside') {
      // Fast 10-aside draughts: only 2 rows per player (rows 0, 1 for P2 and 8, 9 for P1)
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (this.isDarkSquare(r, c)) {
            if (r < 2) {
              this.board[r][c] = { player: PLAYER_2, isKing: false, id: `p2_${r}_${c}` };
            } else if (r >= this.boardSize - 2) {
              this.board[r][c] = { player: PLAYER_1, isKing: false, id: `p1_${r}_${c}` };
            }
          }
        }
      }
    } else if (this.modifications === 'random_ten_aside') {
      // Random 10-aside: 10 pieces randomly placed on legal dark squares in each home territory
      const p2Squares = [];
      const p1Squares = [];
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (this.isDarkSquare(r, c)) {
            if (r < this.rowsPerPlayer) p2Squares.push({ r, c });
            else if (r >= this.boardSize - this.rowsPerPlayer) p1Squares.push({ r, c });
          }
        }
      }
      p2Squares.sort(() => Math.random() - 0.5).slice(0, 10).forEach(({ r, c }) => {
        this.board[r][c] = { player: PLAYER_2, isKing: false, id: `p2_${r}_${c}` };
      });
      p1Squares.sort(() => Math.random() - 0.5).slice(0, 10).forEach(({ r, c }) => {
        this.board[r][c] = { player: PLAYER_1, isKing: false, id: `p1_${r}_${c}` };
      });
    } else {
      // Standard board setup (20 pieces per side on 10x10)
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (this.isDarkSquare(r, c)) {
            if (r < this.rowsPerPlayer) {
              this.board[r][c] = { player: PLAYER_2, isKing: false, id: `p2_${r}_${c}` };
            } else if (r >= this.boardSize - this.rowsPerPlayer) {
              this.board[r][c] = { player: PLAYER_1, isKing: false, id: `p1_${r}_${c}` };
            }
          }
        }
      }
    }

    // Apply Player 1 Short Handicap (remove 1 to 5 seeds from P1's front row)
    if (this.p1Short > 0) {
      let removed = 0;
      for (let r = this.boardSize - this.rowsPerPlayer; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          if (this.board[r][c] && this.board[r][c].player === PLAYER_1) {
            this.board[r][c] = null;
            removed++;
            if (removed >= this.p1Short) break;
          }
        }
        if (removed >= this.p1Short) break;
      }
    }

    // Apply Crown Start Modifications
    if (this.modifications === 'crown_start_left_left') {
      // P1 leftmost and P2 leftmost pieces start as Kings
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[0] && this.board[0][c] && this.board[0][c].player === PLAYER_2) {
          this.board[0][c].isKing = true;
          break;
        }
      }
      for (let c = 0; c < this.boardSize; c++) {
        const lastRow = this.boardSize - 1;
        if (this.board[lastRow] && this.board[lastRow][c] && this.board[lastRow][c].player === PLAYER_1) {
          this.board[lastRow][c].isKing = true;
          break;
        }
      }
    } else if (this.modifications === 'crown_start_middle_middle') {
      // Center Highway pieces start as Kings
      if (this.board[2] && this.board[2][2] && this.board[2][2].player === PLAYER_2) {
        this.board[2][2].isKing = true;
      } else if (this.board[3] && this.board[3][3] && this.board[3][3].player === PLAYER_2) {
        this.board[3][3].isKing = true;
      }
      if (this.board[7] && this.board[7][7] && this.board[7][7].player === PLAYER_1) {
        this.board[7][7].isKing = true;
      } else if (this.board[6] && this.board[6][6] && this.board[6][6].player === PLAYER_1) {
        this.board[6][6].isKing = true;
      }
    }
  }

  loadCustomPosition(pieces, turn = PLAYER_1) {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        this.board[r][c] = null;
      }
    }
    for (const p of pieces) {
      if (this.isValidSquare(p.r, p.c)) {
        const isKing = Boolean(
          p.isKing ||
          (p.player === PLAYER_1 && p.r === 0) ||
          (p.player === PLAYER_2 && p.r === this.boardSize - 1)
        );
        this.board[p.r][p.c] = {
          player: p.player,
          isKing,
          id: p.id || `p_${p.player}_${p.r}_${p.c}`
        };
      }
    }
    this.currentTurn = turn;
    this.activeMultiJump = null;
    this.moveHistory = [];
    this.capturedPieces = { [PLAYER_1]: [], [PLAYER_2]: [] };
    this.gameOver = false;
    this.winner = null;
    this.winReason = '';
    this.halfMoveClock = 0;
    this.positionCounts = new Map();
    this.recordPosition();
  }

  isDarkSquare(r, c) {
    if (this.ruleMode === 'international' || this.ruleMode === 'tournament' || this.ruleMode === 'fmjd') {
      // International Draughts (FMJD) board:
      // Bottom-left corner (row 9, col 0) is DARK (9+0=9 is odd).
      // Bottom-right corner (row 9, col 9) is LIGHT (9+9=18 is even).
      // Active playable dark squares satisfy (r + c) % 2 !== 0.
      return (r + c) % 2 !== 0;
    }
    // Nigerian & Ghanaian Draughts mirrored board:
    // Bottom-left corner (row 9, col 0) is LIGHT (9+0=9 is odd).
    // Bottom-right corner (row 9, col 9) is DARK (9+9=18 is even).
    // The Central Line (Highway) connects (0,0) to (9,9) on player's right.
    // Active playable dark squares satisfy (r + c) % 2 === 0.
    return (r + c) % 2 === 0;
  }

  isCentralLineSquare(r, c) {
    if (!this.isValidSquare(r, c)) return false;
    if (this.ruleMode === 'international' || this.ruleMode === 'tournament' || this.ruleMode === 'fmjd') {
      // FMJD Central Line (Grande Ligne) runs from bottom-left (9, 0) to top-right (0, 9)
      return (r + c === this.boardSize - 1);
    }
    // Nigerian & Ghanaian Highway runs from top-left (0, 0) to bottom-right (9, 9)
    return (r === c);
  }

  getCentralLineDescription() {
    if (this.ruleMode === 'international' || this.ruleMode === 'tournament' || this.ruleMode === 'fmjd') {
      return 'FMJD Main Diagonal (Bottom-Left to Top-Right — Otherwise of Default)';
    }
    if (this.ruleMode === 'ghana' || this.ruleMode === 'damii') {
      return 'Ghanaian Damii Central Line (Right-Hand Diagonal)';
    }
    return 'Nigerian Central Line (Highway on Right)';
  }

  isValidSquare(r, c) {
    return r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.isDarkSquare(r, c);
  }

  getPiece(r, c) {
    if (!this.isValidSquare(r, c)) return null;
    return this.board[r][c];
  }

  clone() {
    const copy = new NigerianDraughtsEngine({
      boardSize: this.boardSize,
      ruleMode: this.ruleMode,
      p1Short: this.p1Short,
      modifications: this.modifications
    });
    copy.board = this.board.map(row => row.map(cell => cell ? { ...cell } : null));
    copy.currentTurn = this.currentTurn;
    copy.activeMultiJump = this.activeMultiJump ? {
      ...this.activeMultiJump,
      jumpedPieces: this.activeMultiJump.jumpedPieces.map(p => ({ ...p }))
    } : null;
    copy.gameOver = this.gameOver;
    copy.winner = this.winner;
    copy.winReason = this.winReason;
    copy.halfMoveClock = this.halfMoveClock;
    return copy;
  }

  recordPosition() {
    const fen = this.serializeBoard();
    const count = (this.positionCounts.get(fen) || 0) + 1;
    this.positionCounts.set(fen, count);
    if (count >= 3) {
      this.gameOver = true;
      if (this.modifications === 'draw_odds_p2') {
        this.winner = PLAYER_2;
        this.winReason = 'Player 2 won by Draw Odds rule (3-fold repetition)';
      } else {
        this.winner = 'draw';
        this.winReason = 'Draw by threefold repetition';
      }
    }
  }

  serializeBoard() {
    let str = `${this.currentTurn}:`;
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const p = this.board[r][c];
        if (p) {
          str += `${r},${c},${p.player},${p.isKing ? 'K' : 'M'};`;
        }
      }
    }
    return str;
  }

  /**
   * Returns all legal single-step or capture moves for the current state.
   * If a multi-jump is in progress, only subsequent captures for the jumping piece are returned.
   */
  getAllLegalMoves(player = this.currentTurn) {
    if (this.gameOver) return [];

    // If currently mid-multijump, only that piece can continue capturing
    if (this.activeMultiJump) {
      const { r, c, jumpedPieces } = this.activeMultiJump;
      const piece = this.board[r][c];
      if (!piece) return [];
      return this.getPieceCaptures(r, c, piece, jumpedPieces);
    }

    // Step 1: Find all possible captures for all pieces of player
    const allCaptures = [];
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const piece = this.board[r][c];
        if (piece && piece.player === player) {
          const captures = this.getPieceCaptures(r, c, piece, []);
          allCaptures.push(...captures);
        }
      }
    }

    // Compulsory capture rule: If captures exist, only captures are legal!
    if (allCaptures.length > 0) {
      if (this.ruleMode === 'tournament' || this.ruleMode === 'international') {
        // Tournament FMJD rule: Only moves with maximum captured piece sequence are legal
        let maxCount = 0;
        for (const cap of allCaptures) {
          if (cap.totalChainLength > maxCount) {
            maxCount = cap.totalChainLength;
          }
        }
        return allCaptures.filter(cap => cap.totalChainLength === maxCount);
      }
      // Nigerian rule: Any capture sequence can be chosen freely
      return allCaptures;
    }

    // If no captures available, find regular non-capturing steps
    const regularMoves = [];
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const piece = this.board[r][c];
        if (piece && piece.player === player) {
          regularMoves.push(...this.getPieceRegularMoves(r, c, piece));
        }
      }
    }

    return regularMoves;
  }

  /**
   * Get legal regular (non-capturing) moves for a piece.
   */
  getPieceRegularMoves(r, c, piece) {
    const moves = [];
    const directions = piece.isKing
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : (piece.player === PLAYER_1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);

    if (!piece.isKing) {
      // Ordinary piece moves forward 1 square diagonally
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (this.isValidSquare(nr, nc) && !this.board[nr][nc]) {
          moves.push({
            from: { r, c },
            to: { r: nr, c: nc },
            isCapture: false,
            jumped: null,
            promotes: this.willPromote(piece, nr)
          });
        }
      }
    } else {
      // Flying King can slide any distance along empty diagonal
      for (const [dr, dc] of directions) {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (!this.isValidSquare(nr, nc)) break;
          if (this.board[nr][nc]) break; // Blocked by piece
          moves.push({
            from: { r, c },
            to: { r: nr, c: nc },
            isCapture: false,
            jumped: null,
            promotes: false
          });
          step++;
        }
      }
    }

    return moves;
  }

  /**
   * Get all capture moves for a piece, taking into account already jumped pieces in current turn.
   */
  getPieceCaptures(r, c, piece, jumpedPieces = []) {
    const immediateCaptures = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    const isAlreadyJumped = (jr, jc) => {
      return jumpedPieces.some(p => p.r === jr && p.c === jc);
    };

    if (!piece.isKing) {
      // Ordinary piece (seed / man) captures forward AND backward!
      for (const [dr, dc] of directions) {
        const enemyR = r + dr;
        const enemyC = c + dc;
        const landR = r + 2 * dr;
        const landC = c + 2 * dc;

        if (this.isValidSquare(landR, landC)) {
          const enemyPiece = this.board[enemyR][enemyC];
          const landOccupant = this.board[landR][landC];

          if (
            enemyPiece &&
            enemyPiece.player !== piece.player &&
            !isAlreadyJumped(enemyR, enemyC) &&
            (!landOccupant || (landR === r && landC === c)) // can land if empty
          ) {
            immediateCaptures.push({
              from: { r, c },
              to: { r: landR, c: landC },
              isCapture: true,
              jumped: { r: enemyR, c: enemyC, piece: enemyPiece },
              promotes: this.willPromote(piece, landR)
            });
          }
        }
      }
    } else {
      // Flying King captures across distance!
      for (const [dr, dc] of directions) {
        let step = 1;
        let foundEnemy = null;

        while (true) {
          const cr = r + dr * step;
          const cc = c + dc * step;
          if (!this.isValidSquare(cr, cc)) break;

          const occupant = this.board[cr][cc];
          if (occupant) {
            if (isAlreadyJumped(cr, cc)) {
              // Treated as empty or cannot jump twice
              break;
            }
            if (occupant.player === piece.player) {
              // Blocked by friendly piece
              break;
            }
            if (!foundEnemy) {
              foundEnemy = { r: cr, c: cc, piece: occupant };
            } else {
              // Two pieces in a row along same diagonal cannot be jumped together
              break;
            }
          } else {
            // Empty square
            if (foundEnemy) {
              // Valid landing square beyond the enemy piece!
              immediateCaptures.push({
                from: { r, c },
                to: { r: cr, c: cc },
                isCapture: true,
                jumped: foundEnemy,
                promotes: false // King is already king
              });
            }
          }
          step++;
        }
      }
    }

    // Compute maximum potential chain depth for each immediate capture (for tournament rule / evaluation)
    for (const cap of immediateCaptures) {
      cap.totalChainLength = this.getMaxCaptureChainLength(
        cap.to.r,
        cap.to.c,
        piece,
        [...jumpedPieces, cap.jumped],
        cap.promotes
      );
    }

    if (piece.isKing) {
      // Group immediate captures by jumped enemy piece position
      const byEnemy = new Map();
      for (const cap of immediateCaptures) {
        const key = `${cap.jumped.r},${cap.jumped.c}`;
        if (!byEnemy.has(key)) byEnemy.set(key, []);
        byEnemy.get(key).push(cap);
      }

      const validKingCaptures = [];
      for (const caps of byEnemy.values()) {
        const maxChainForEnemy = Math.max(...caps.map(c => c.totalChainLength));
        if (maxChainForEnemy > 1) {
          // Under compulsory capture rules, if any landing square allows continuing the capture,
          // dead-end landing squares that prematurely abort the capture are illegal
          validKingCaptures.push(...caps.filter(c => c.totalChainLength > 1));
        } else {
          // No landing square allows continuing; all landing squares along this ray are valid
          validKingCaptures.push(...caps);
        }
      }
      return validKingCaptures;
    }

    return immediateCaptures;
  }

  /**
   * Helper to calculate max depth of captures from a landing position
   */
  getMaxCaptureChainLength(r, c, piece, jumpedPieces, promotes) {
    if (promotes && (this.ruleMode === 'ghana' || this.ruleMode === 'damii')) return 1;

    const testPiece = piece.isKing ? piece : { ...piece, isKing: false };
    const nextCaptures = this.simulatePieceCaptures(r, c, testPiece, jumpedPieces);
    if (nextCaptures.length === 0) return 1;

    let maxFurther = 0;
    for (const next of nextCaptures) {
      const further = this.getMaxCaptureChainLength(
        next.to.r,
        next.to.c,
        testPiece,
        [...jumpedPieces, next.jumped],
        next.promotes
      );
      if (further > maxFurther) {
        maxFurther = further;
      }
    }
    return 1 + maxFurther;
  }

  simulatePieceCaptures(r, c, piece, jumpedPieces) {
    const isAlreadyJumped = (jr, jc) => jumpedPieces.some(p => p.r === jr && p.c === jc);
    const immediateCaptures = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    if (!piece.isKing) {
      for (const [dr, dc] of directions) {
        const enemyR = r + dr;
        const enemyC = c + dc;
        const landR = r + 2 * dr;
        const landC = c + 2 * dc;

        if (this.isValidSquare(landR, landC)) {
          const enemyPiece = this.board[enemyR][enemyC];
          const landOccupant = this.board[landR][landC];

          if (
            enemyPiece &&
            enemyPiece.player !== piece.player &&
            !isAlreadyJumped(enemyR, enemyC) &&
            (!landOccupant || (landR === r && landC === c)) &&
            !isAlreadyJumped(landR, landC)
          ) {
            immediateCaptures.push({
              from: { r, c },
              to: { r: landR, c: landC },
              isCapture: true,
              jumped: { r: enemyR, c: enemyC, piece: enemyPiece },
              promotes: this.willPromote(piece, landR)
            });
          }
        }
      }
    } else {
      for (const [dr, dc] of directions) {
        let step = 1;
        let foundEnemy = null;

        while (true) {
          const cr = r + dr * step;
          const cc = c + dc * step;
          if (!this.isValidSquare(cr, cc)) break;

          const occupant = this.board[cr][cc];
          if (occupant) {
            if (isAlreadyJumped(cr, cc)) {
              // Jumped pieces remain physically on board until move ends; ray blocked
              break;
            }
            if (occupant.player === piece.player) break;
            if (!foundEnemy) {
              foundEnemy = { r: cr, c: cc, piece: occupant };
            } else {
              break;
            }
          } else {
            if (foundEnemy) {
              immediateCaptures.push({
                from: { r, c },
                to: { r: cr, c: cc },
                isCapture: true,
                jumped: foundEnemy,
                promotes: false
              });
            }
          }
          step++;
        }
      }
    }
    return immediateCaptures;
  }

  willPromote(piece, landR) {
    if (piece.isKing) return false;
    if (piece.player === PLAYER_1 && landR === 0) return true;
    if (piece.player === PLAYER_2 && landR === this.boardSize - 1) return true;
    return false;
  }

  /**
   * Execute a move. Returns an object describing what happened.
   */
  makeMove(move) {
    const piece = this.board[move.from.r][move.from.c];
    if (!piece) {
      return { success: false, reason: 'No piece at source square' };
    }

    // Check if move is legal
    const legalMoves = this.getAllLegalMoves();
    const matchedMove = legalMoves.find(
      m => m.from.r === move.from.r && m.from.c === move.from.c &&
           m.to.r === move.to.r && m.to.c === move.to.c
    );

    if (!matchedMove) {
      return { success: false, reason: 'Illegal move' };
    }

    const effectiveMove = matchedMove;

    // Move piece on board
    this.board[effectiveMove.from.r][effectiveMove.from.c] = null;
    this.board[effectiveMove.to.r][effectiveMove.to.c] = piece;

    let justPromoted = false;
    let turnEnded = true;

    if (effectiveMove.isCapture) {
      this.halfMoveClock = 0;
      const jumpedPieces = this.activeMultiJump
        ? [...this.activeMultiJump.jumpedPieces, effectiveMove.jumped]
        : [effectiveMove.jumped];

      const reachedBackline = this.willPromote(piece, effectiveMove.to.r);
      const touchedBackline = Boolean(this.activeMultiJump?.touchedBackline || reachedBackline);

      // Check if further captures are possible from new position (r, c)
      let subsequentCaptures = [];
      if (this.ruleMode === 'ghana' || this.ruleMode === 'damii') {
        // In Ghanaian Damii: reaching the promotion line ends the turn immediately and crowns!
        subsequentCaptures = reachedBackline
          ? []
          : this.getPieceCaptures(effectiveMove.to.r, effectiveMove.to.c, piece, jumpedPieces);
      } else {
        // In Nigerian and International FMJD rules: a man passing through the king row continues jumping as a man;
        // It does NOT crown before capturing the rest!
        subsequentCaptures = this.getPieceCaptures(effectiveMove.to.r, effectiveMove.to.c, piece, jumpedPieces);
      }

      if (subsequentCaptures.length > 0) {
        // Multi-jump continues!
        this.activeMultiJump = {
          r: effectiveMove.to.r,
          c: effectiveMove.to.c,
          jumpedPieces,
          touchedBackline: touchedBackline
        };
        turnEnded = false;
      } else {
        // Capture chain finished! Remove jumped pieces
        for (const j of jumpedPieces) {
          this.board[j.r][j.c] = null;
          this.capturedPieces[this.currentTurn].push(j.piece);
        }
        this.activeMultiJump = null;

        // In Nigerian rules: "Touch and Crown" — if it touched the backline at any point or ended on it!
        // In International FMJD: crowns only if stopping on the back rank!
        const shouldCrown = (this.ruleMode === 'nigeria')
          ? (touchedBackline || reachedBackline)
          : reachedBackline;

        if (shouldCrown && !piece.isKing) {
          piece.isKing = true;
          justPromoted = true;
        }
      }
    } else {
      // Regular non-capturing move
      this.halfMoveClock++;
      if (effectiveMove.promotes && !piece.isKing) {
        piece.isKing = true;
        justPromoted = true;
      }
    }

    // Record in move history
    this.moveHistory.push({
      player: this.currentTurn,
      piece: { ...piece },
      from: { ...effectiveMove.from },
      to: { ...effectiveMove.to },
      isCapture: effectiveMove.isCapture,
      jumped: effectiveMove.jumped,
      promoted: justPromoted,
      turnEnded
    });

    if (turnEnded) {
      this.currentTurn = this.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      this.recordPosition();
      this.checkEndGame();
    }

    return {
      success: true,
      turnEnded,
      justPromoted,
      isCapture: effectiveMove.isCapture,
      capturedPiece: effectiveMove.jumped ? effectiveMove.jumped.piece : null,
      gameOver: this.gameOver,
      winner: this.winner,
      winReason: this.winReason,
      nextTurn: this.currentTurn
    };
  }

  checkEndGame() {
    if (this.gameOver) return;

    let p1Pieces = 0;
    let p2Pieces = 0;
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const p = this.board[r][c];
        if (p) {
          if (p.player === PLAYER_1) p1Pieces++;
          else p2Pieces++;
        }
      }
    }

    if (p1Pieces === 0) {
      this.gameOver = true;
      this.winner = PLAYER_2;
      this.winReason = 'All Player 1 seeds chopped!';
      return;
    }

    if (p2Pieces === 0) {
      this.gameOver = true;
      this.winner = PLAYER_1;
      this.winReason = 'All Player 2 seeds chopped!';
      return;
    }

    const legalMoves = this.getAllLegalMoves();
    if (legalMoves.length === 0) {
      this.gameOver = true;
      this.winner = this.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      this.winReason = `Player ${this.currentTurn === PLAYER_1 ? 1 : 2} has no legal moves (Locked)!`;
      return;
    }

    // Ghanaian Damii Endgame Seed-Counting & Crown Rules
    if (this.ruleMode === 'ghana' || this.ruleMode === 'damii') {
      let p1Kings = 0, p2Kings = 0, p1Men = 0, p2Men = 0;
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          const p = this.board[r][c];
          if (p) {
            if (p.player === PLAYER_1) {
              if (p.isKing) p1Kings++; else p1Men++;
            } else {
              if (p.isKing) p2Kings++; else p2Men++;
            }
          }
        }
      }

      // Rule 1: One seed + one crown for both players is a DRAW (1 Man + 1 King each)
      if (p1Kings === 1 && p1Men === 1 && p2Kings === 1 && p2Men === 1) {
        this.gameOver = true;
        this.winner = 'draw';
        this.winReason = 'Draw by Ghanaian Damii rule: 1 Crown + 1 Seed each';
        return;
      }

      // Rule 2: One seed + one crown vs one crown alone is a WIN
      if (p1Kings === 1 && p1Men >= 1 && p2Kings === 1 && p2Men === 0) {
        this.gameOver = true;
        this.winner = PLAYER_1;
        this.winReason = 'Player 1 wins by Ghanaian Damii seed-count rule: Crown + Seed vs lone Crown';
        return;
      }
      if (p2Kings === 1 && p2Men >= 1 && p1Kings === 1 && p1Men === 0) {
        this.gameOver = true;
        this.winner = PLAYER_2;
        this.winReason = 'Player 2 wins by Ghanaian Damii seed-count rule: Crown + Seed vs lone Crown';
        return;
      }

      // Rule 3: One crown vs one crown alone is a DRAW (1 King vs 1 King)
      if (p1Kings === 1 && p1Men === 0 && p2Kings === 1 && p2Men === 0) {
        this.gameOver = true;
        this.winner = 'draw';
        this.winReason = 'Draw by Ghanaian Damii rule: 1 Crown vs 1 Crown';
        return;
      }

      // Rule 4: 3 Kings vs 1 King Ghana 16-move rule (32 half-moves)
      const is3v1 = (p1Kings === 3 && p2Kings === 1 && p1Men === 0 && p2Men === 0) ||
                    (p2Kings === 3 && p1Kings === 1 && p1Men === 0 && p2Men === 0);
      if (is3v1 && this.halfMoveClock >= 32) {
        this.gameOver = true;
        this.winner = 'draw';
        this.winReason = 'Draw by Ghanaian 16-move rule (3 Kings vs 1 King)';
        return;
      }
    }

    if (this.halfMoveClock >= 50) {
      this.gameOver = true;
      if (this.modifications === 'draw_odds_p2') {
        this.winner = PLAYER_2;
        this.winReason = 'Player 2 won by Draw Odds rule';
      } else {
        this.winner = 'draw';
        this.winReason = 'Draw by 25 consecutive king moves without capture';
      }
    }
  }

  getStats() {
    let p1Men = 0, p1Kings = 0;
    let p2Men = 0, p2Kings = 0;

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        const p = this.board[r][c];
        if (p) {
          if (p.player === PLAYER_1) {
            if (p.isKing) p1Kings++;
            else p1Men++;
          } else {
            if (p.isKing) p2Kings++;
            else p2Men++;
          }
        }
      }
    }

    return {
      p1: { men: p1Men, kings: p1Kings, total: p1Men + p1Kings },
      p2: { men: p2Men, kings: p2Kings, total: p2Men + p2Kings },
      currentTurn: this.currentTurn,
      gameOver: this.gameOver,
      winner: this.winner,
      winReason: this.winReason
    };
  }
}
