/** @module tokenizers */
import { IScanner } from '../../io/IScanner';
import { TokenType } from '../TokenType';
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
export declare class SymbolNode {
    private _parent;
    private _character;
    private _children;
    private _tokenType;
    private _valid;
    private _ancestry;
    /**
     * Constructs a SymbolNode with the given parent, representing the given character.
     * @param parent This node's parent
     * @param character This node's associated character.
     */
    constructor(parent: SymbolNode, character: number);
    /**
     * Find or create a child for the given character.
     * @param value
     */
    ensureChildWithChar(value: number): SymbolNode;
    /**
     * Add a line of descendants that represent the characters in the given string.
     * @param value
     * @param tokenType
     */
    addDescendantLine(value: string, tokenType: TokenType): void;
    /**
     * Find the descendant that takes as many characters as possible from the input.
     * @param scanner
     */
    deepestRead(scanner: IScanner): SymbolNode;
    /**
     * Find a child with the given character.
     * @param value
     */
    findChildWithChar(value: number): SymbolNode;
    /**
     * Unwind to a valid node; this node is "valid" if its ancestry represents a complete symbol.
     * If this node is not valid, put back the character and ask the parent to unwind.
     * @param scanner
     */
    unreadToValid(scanner: IScanner): SymbolNode;
    get valid(): boolean;
    set valid(value: boolean);
    get tokenType(): TokenType;
    set tokenType(value: TokenType);
    /**
     * Show the symbol this node represents.
     * @returns The symbol this node represents.
     */
    ancestry(): string;
}
