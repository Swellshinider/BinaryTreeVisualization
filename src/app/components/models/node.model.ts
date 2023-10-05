export class Node {
    value: number;
    left: Node | null = null;
    right: Node | null = null;

    isDragging = false;
    dragStartX = 0;
    dragStartY = 0;
    offsetX = 0;
    offsetY = 0;

    constructor(
        value: number,
    ) {
        this.value = value;
    }

    public draw(ctx: CanvasRenderingContext2D, spacing: number, width: number, nodeSize: number, height: number) {
        if (!ctx)
            return;

        const totalNodes = this.calculateTotalNodes();
        this.drawTree(ctx, width / 2, nodeSize, nodeSize, (totalNodes * spacing) * 2);
    }

    public calculateTotalNodes(): number {
        return this.countNodes(this);
    }

    private drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, nodeSize: number, xOffset: number): void {
        x += this.offsetX;
        y += this.offsetY;

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
        ctx.font = `${nodeSize / 2}px Arial`;
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
}