/* eslint-disable @typescript-eslint/no-empty-function */
export class TestClass {
	private privateField = 123;
	public publicField = "ABC";
    private _publicProp: Date = new Date();
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public TestClass(arg1: number = null) {}
	
	protected get privateProp(): number { return 543; }
	protected set privateProp(value: number) {}
	
	public get publicProp(): Date { return this._publicProp; }
	public set publicProp(value: Date) { this._publicProp = value; }
	
	private privateMethod(): void {}
	
	public publicMethod(arg1: number, arg2: number): number {
		return arg1 + arg2;
	}
}
