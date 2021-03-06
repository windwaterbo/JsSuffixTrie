'use strict';

(function() {

    angular.module('ngSuffixTrie', []).

    factory('ngSuffixTrie', function() {
        var ngSuffixTrie;
        ngSuffixTrie = function() {
            this.count = 0;
            this.structure = {};
            this.prefix = "";
        };

        ngSuffixTrie.prototype.add = function(string) {
            var chr, index, length, next, node;
            node = this.structure;
            length = string.length;
            index = 0;
            while (index < length) {
                chr = string[index++];
                next = node[chr];
                if (next) {
                    node = next;
                } else {
                    node[chr] = {};
                    node = node[chr];
                }
            }
            if (node.terminator) {
                return false;
            } else {
                node.terminator = true;
                this.count++;
                return true;
            }
        };
        ngSuffixTrie.prototype.remove = function(string) {
            var chr, index, length, node;
            node = this.structure;
            length = string.length;
            index = 0;
            while (index < length) {
                chr = string[index++];
                node = node[chr];
                if (!node) {
                    return false;
                }
            }
            if (node.terminator) {
                delete node.terminator;
                this.count--;
                return true;
            } else {
                return false;
            }
        };
        ngSuffixTrie.prototype.contains = function(string) {
            var node;
            node = this.findNode(string);
            return node !== null && node.terminator;
        };
        ngSuffixTrie.prototype.subTrie = function(prefix) {
            var node, subTrie;
            node = this.findNode(prefix);
            subTrie = new ngSuffixTrie;
            subTrie.structure = node;
            subTrie.prefix = prefix;
            return subTrie;
        };
        ngSuffixTrie.prototype.find = function(prefix) {
            return ngSuffixTrie.nodeToArray(this.findNode(prefix), prefix);
        };
        ngSuffixTrie.prototype.findNode = function(string) {
            var currentChar, index, length, node;
            node = this.structure;
            length = string.length;
            index = 0;
            while (index < length) {
                currentChar = string[index++];
                node = node[currentChar];
                if (!node) {
                    return null;
                }
            }
            return node;
        };
        ngSuffixTrie.prototype.each = function(callback) {
            return ngSuffixTrie.each(callback, this.structure, 0, this.prefix);
        };
        ngSuffixTrie.each = function(callback, node, index, string) {
            var property;
            if (node.terminator) {
                callback(index++, string);
            }
            for (property in node) {
                index = this.each(callback, node[property], index, string + property);
            }
            return index;
        };
        ngSuffixTrie.prototype.size = function() {
            return this.count;
        };
        ngSuffixTrie.prototype.calculateSize = function(node) {
            var property, size;
            if (node == null) {
                node = this.structure;
            }
            size = node.terminator ? 1 : 0;
            for (property in node) {
                size += this.calculateSize(node[property]);
            }
            return size;
        };
        ngSuffixTrie.fromArray = function(array) {
            var i, length, trie;
            trie = new ngSuffixTrie;
            length = array.length;
            i = 0;
            while (i < length) {
                trie.add(array[i++]);
            }
            trie.count = i;
            return trie;
        };
        ngSuffixTrie.prototype.toArray = function() {
            return ngSuffixTrie.nodeToArray(this.structure, this.prefix);
        };
        ngSuffixTrie.nodeToArray = function(node, prefix) {
            var array;
            array = [];
            this.each(function(index, value) {
                return array[index] = value;
            }, node, 0, prefix);
            return array;
        };
        ngSuffixTrie.fromJSON = function(json) {
            var trie;
            trie = new ngSuffixTrie;
            trie.structure = JSON.parse(json);
            trie.calculateSize();
            return trie;
        };
        ngSuffixTrie.prototype.toJSON = function() {
            return JSON.stringify(this.structure);
        };
        return ngSuffixTrie;

    });

})();