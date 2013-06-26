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

        // check rows
        if (!win) {
            for (var i = 0; i < this.squares.length; i++) {
                win = that.checkSum(that.squares[i], that.currentPlayer.id);
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
                win = that.checkSum(that.inverse[i], that.currentPlayer.id);
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
            win = that.checkSum(ndiag, that.currentPlayer.id);
        }

        // check positive diagonal
        if (!win) {
            win = that.checkSum(pdiag, that.currentPlayer.id);
        }


        if (win) {
            this.message('Player ' + this.currentPlayer.name + ' won!');
        }
    },

    message: function (msg) {
        $('.caption').html(msg);
    },

    checkSum: function (arr, id) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                sum = 0;
                break;
            } else {
                sum += arr[i]
            }
        }
        var same = id === 2 ? sum % 2 === 0 : sum % 2 !== 0;
        if (same && sum === (this.size * id)) {
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
    var tictactoe = new ttt.Game(5);
    tictactoe.start();
});
