export class Node {
    value: number;
    left: Node | null = null;
    right: Node | null = null;
    private rec: number[] = [];

    constructor(
        value: number,
    ) {
        this.value = value;
    }

    public draw(ctx: CanvasRenderingContext2D, spacing: number, width: number, nodeSize: number, height: number) {
        if (!ctx)
            return;

        ctx.clearRect(0, 0, width, height);

        const totalNodes = this.calculateTotalNodes();
        this.drawTree(ctx, width / 2, nodeSize, nodeSize, (totalNodes * spacing) * 2);
    }

    public calculateTotalNodes(): number {
        return this.countNodes(this);
    }

    public toString(): string {
        this.printTree(this, 0);
        return this.traverseToString(this);
    }

    private drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, nodeSize: number, xOffset: number): void {
        if (this.left) {
            // Left coordinates
            const leftX = x - xOffset;
            const leftY = y + (nodeSize * 2);

            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(x, y);
            ctx.lineTo(leftX, leftY);
            ctx.stroke();

            this.left.drawTree(ctx, leftX, leftY, nodeSize, xOffset - (xOffset / 3));
        }

        if (this.right) {
            // Right coordinates
            const rightX = x + xOffset;
            const rightY = y + (nodeSize * 2);

            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(x, y);
            ctx.lineTo(rightX, rightY);
            ctx.stroke();

            this.right.drawTree(ctx, rightX, rightY, nodeSize, xOffset - (xOffset / 3));
        }

        ctx.beginPath();
        ctx.arc(x, y, nodeSize / 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.value}`, x, y);
    }

    private countNodes(node: Node | null): number {
        if (node === null) {
            return 0;
        }

        const leftCount = this.countNodes(node.left);
        const rightCount = this.countNodes(node.right);

        return 1 + leftCount + rightCount;
    }

    private traverseToString(node: Node | null): string {
        if (node === null) {
            return 'null';
        }

        const left = this.traverseToString(node.left);
        const right = this.traverseToString(node.right);

        return `{ value: ${node.value}, left: ${left}, right: ${right} }`;
    }

    printTree(node: Node | null, depth: number): void {
        let i: number;
        if (node === null) return;
    
        console.log('\t',);
        for (i = 0; i < depth; i++) {
            if (i === depth - 1) {
                console.log(this.rec[depth - 1] ? '\u0371\u2014\u2014\u2014' : '\u221F\u2014\u2014\u2014');
            } else {
                console.log(this.rec[i] ? '\u23B8   ' : '    ');
            }
        }
    
        console.log(node.value);
        this.rec[depth] = 1;
        this.printTree(node.left, depth + 1);
        this.rec[depth] = 0;
        this.printTree(node.right, depth + 1);
    }
}