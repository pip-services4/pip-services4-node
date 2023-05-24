"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolNode = void 0;
const CharReferenceMap_1 = require("../utilities/CharReferenceMap");
const CharValidator_1 = require("../utilities/CharValidator");
const TokenType_1 = require("../TokenType");
/**
  * A <code>SymbolNode</code> object is a member of a tree that contains all possible prefixes
  * of allowable symbols. Multi-character symbols appear in a <code>SymbolNode</code> tree
  * with one node for each character.
  * <p/>
  * For example, the symbol <code>=:~</code> will appear in a tree as three nodes. The first
  * node contains an equals sign, and has a child; that child contains a colon and has a child;
  * this third child contains a tilde, and has no children of its own. If the colon node had
  * another child for a dollar sign character, then the tree would contain the symbol <code>=:$</code>.
  * <p/>
  * A tree of <code>SymbolNode</code> objects collaborate to read a (potentially multi-character)
  * symbol from an input stream. A root node with no character of its own finds an initial node
  * that represents the first character in the input. This node looks to see if the next character
  * in the stream matches one of its children. If so, the node delegates its reading task to its child.
  * This approach walks down the tree, pulling symbols from the input that match the path down the tree.
  * <p/>
  * When a node does not have a child that matches the next character, we will have read the longest
  * possible symbol prefix. This prefix may or may not be a valid symbol.
  * Consider a tree that has had <code>=:~</code> added and has not had <code>=:</code> added.
  * In this tree, of the three nodes that contain <code>=:~</code>, only the first and third contain
  * complete symbols. If, say, the input contains <code>=:a</code>, the colon node will not have
  * a child that matches the 'a' and so it will stop reading. The colon node has to "unread": it must
  * push back its character, and ask its parent to unread. Unreading continues until it reaches
  * an ancestor that represents a valid symbol.
  */
class SymbolNode {
    /**
     * Constructs a SymbolNode with the given parent, representing the given character.
     * @param parent This node's parent
     * @param character This node's associated character.
     */
    constructor(parent, character) {
        this._tokenType = TokenType_1.TokenType.Unknown;
        this._parent = parent;
        this._character = character;
    }
    /**
     * Find or create a child for the given character.
     * @param value
     */
    ensureChildWithChar(value) {
        if (this._children == null) {
            this._children = new CharReferenceMap_1.CharReferenceMap();
        }
        let childNode = this._children.lookup(value);
        if (childNode == null) {
            childNode = new SymbolNode(this, value);
            this._children.addInterval(value, value, childNode);
        }
        return childNode;
    }
    /**
     * Add a line of descendants that represent the characters in the given string.
     * @param value
     * @param tokenType
     */
    addDescendantLine(value, tokenType) {
        if (value.length > 0) {
            let childNode = this.ensureChildWithChar(value.charCodeAt(0));
            childNode.addDescendantLine(value.substring(1), tokenType);
        }
        else {
            this._valid = true;
            this._tokenType = tokenType;
        }
    }
    /**
     * Find the descendant that takes as many characters as possible from the input.
     * @param scanner
     */
    deepestRead(scanner) {
        let nextSymbol = scanner.read();
        let childNode = !CharValidator_1.CharValidator.isEof(nextSymbol)
            ? this.findChildWithChar(nextSymbol) : null;
        if (childNode == null) {
            scanner.unread();
            return this;
        }
        return childNode.deepestRead(scanner);
    }
    /**
     * Find a child with the given character.
     * @param value
     */
    findChildWithChar(value) {
        return this._children != null ? this._children.lookup(value) : null;
    }
    // /**
    //  * Find a descendant which is down the path the given string indicates.
    //  * @param value 
    //  */
    // public findDescendant(value: string): SymbolNode {
    //    let tempChar = value.length > 0 ? value.charCodeAt(0) : CharValidator.Eof;
    //    let childNode = this.findChildWithChar(tempChar);
    //    if (!CharValidator.isEof(tempChar) && childNode != null && value.length > 1) {
    //        childNode = childNode.findDescendant(value.substring(1));
    //    }
    //    return childNode;
    // }
    /**
     * Unwind to a valid node; this node is "valid" if its ancestry represents a complete symbol.
     * If this node is not valid, put back the character and ask the parent to unwind.
     * @param scanner
     */
    unreadToValid(scanner) {
        if (!this._valid && this._parent != null) {
            scanner.unread();
            return this._parent.unreadToValid(scanner);
        }
        return this;
    }
    //internal SymbolNode Parent { get { return _parent; } }
    //internal SymbolNode[] Children { get { return _children; } }
    //internal char Character { get { return _character; } }
    get valid() {
        return this._valid;
    }
    set valid(value) {
        this._valid = value;
    }
    get tokenType() {
        return this._tokenType;
    }
    set tokenType(value) {
        this._tokenType = value;
    }
    /**
     * Show the symbol this node represents.
     * @returns The symbol this node represents.
     */
    ancestry() {
        if (this._ancestry == null) {
            this._ancestry = (this._parent != null ? this._parent.ancestry() : "")
                + (this._character != 0 ? String.fromCharCode(this._character) : "");
        }
        return this._ancestry;
    }
}
exports.SymbolNode = SymbolNode;
//# sourceMappingURL=SymbolNode.js.map