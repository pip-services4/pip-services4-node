import { IMessageQueue } from 'pip-services4-messaging-node';
export declare class MessageQueueFixture {
    private _queue;
    private cotntext;
    constructor(queue: IMessageQueue);
    testSendReceiveMessage(): Promise<void>;
    testReceiveSendMessage(): Promise<void>;
    testReceiveCompleteMessage(): Promise<void>;
    testReceiveAbandonMessage(): Promise<void>;
    testSendPeekMessage(): Promise<void>;
    testPeekNoMessage(): Promise<void>;
    testMoveToDeadMessage(): Promise<void>;
    testOnMessage(): Promise<void>;
}
