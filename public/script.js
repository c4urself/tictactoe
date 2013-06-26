window.ttt = window.ttt || {};

ttt.Player = function (id, symbol, name) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
};

ttt.Game = function (size) {
    this.board = $('.board');
    this.playerX = new ttt.Player(1, 'X', 'X');
    this.playerO = new ttt.Player(2, 'O', 'O');

    this.players = [this.playerX, this.playerO];
    this.currentPlayer = this.playerX;
    this.size = size;
    this.squares = [];
    this.inverse = [];
    this.total = size * size;
    this.even = this.size % 2 === 0;
    this.winScenarios = this.size * 2 + 2;
};

ttt.Game.prototype = {

    start: function () {
        this.generateTable();
    },

    check: function () {
        var that = this,
            win = false,
            ndiag = [],
            pdiag = [];

        this.tiedScenarios = 0;

        // check rows
        if (!win) {
            for (var i = 0; i < this.squares.length; i++) {
                win = that.sum(that.squares[i], that.currentPlayer.id);
                if (win) break;

                // setup for negative diagonal
                for (var j = 0; j < that.squares[i].length; j++) {
                    if (j === i) {
                        ndiag.push(that.squares[i][i]);
                    }
                }
            }
        }

        // check columns
        if (!win) {
            for (var i = 0; i < this.inverse.length; i++) {
                win = that.sum(that.inverse[i], that.currentPlayer.id);
                if (win) break;
            }
        }

        // get positive diagonal
        if (!win) {
            for (var i = this.inverse.length - 1, j = 0; i >= 0; i--) {
                console.log(i);
                console.log(j);
                pdiag.push(that.inverse[i][j]);
                j++;
            }
        }

        // check negative diagonal
        if (!win) {
            win = that.sum(ndiag, that.currentPlayer.id);
        }

        // check positive diagonal
        if (!win) {
            win = that.sum(pdiag, that.currentPlayer.id);
        }

        if (this.tiedScenarios === this.winScenarios) {
            this.message('This game will result in a tie.');
        }
        if (win) {
            this.message('Player ' + this.currentPlayer.name + ' won!');
        }
    },

    message: function (msg) {
        $('.caption').html(msg);
    },

    tieCheck: function (arr) {
        if (arr.indexOf(1) > -1 && arr.indexOf(2) > -1) {
            return true;
        }
    },

    sum: function (arr, id) {
        if (this.tieCheck(arr)) {
            this.tiedScenarios += 1;
            return false;
        }
        var sum = this.even && id === 1 ? 1 : 0; // add one for even grids
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                sum = 0;
                break;
            } else {
                sum += arr[i]
            }
        }
        var full = id === 2 ? sum % 2 === 0 : sum % 2 !== 0;
        if (full && sum === (this.size * id)) {
            return true;
        }
        return false;
    },

    pickedSquare: function (row, cell, node) {
        this.squares[row][cell] = this.currentPlayer.id;
        this.inverse[cell][row] = this.currentPlayer.id;
        node.append('<span>' + this.currentPlayer.symbol + '</span>');
        this.check();
        this.currentPlayer = this.players[this.currentPlayer.id === 2 ? 0 : 1]
    },

    clickHandler: function (e) {
        var node = $(e.currentTarget),
            row = node.data('row'),
            cell = node.data('cell');

        if (this.squares[row][cell] === 0) {
            this.pickedSquare(row, cell, node);
        } else {
            this.message('That square is taken!');
        }
    },

    generateTable: function () {
        var that = this;
        for (var r = 0; r < this.size; r++) {
            var tr = $('<tr>');
            that.squares.push([]);
            that.inverse.push([]);
            that.board.append(tr);
            for (var c = 0; c < this.size; c++) {
                var td = $('<td data-row="' + r + '" data-cell="' + c + '">');
                td.on('click dblclick', function () {that.clickHandler.apply(that, arguments)});
                that.squares[r].push(0);
                that.inverse[r].push(0);
                tr.append(td);
            }
        }

        //TODO: use squares to make inverse, reduce code
    }
};



$(document).ready(function () {
    var tictactoe = new ttt.Game(3);
    tictactoe.start();
});
