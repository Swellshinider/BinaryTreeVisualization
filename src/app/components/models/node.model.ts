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

    private drawTree(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        nodeSize: number,
        xOffset: number
    ): void {
        x += this.offsetX;
        y += this.offsetY;
        ctx.lineWidth = 2;

        const totalWidth = this.calculateSubtreeWidth() * 0.3;

        const leftX = x - (xOffset * totalWidth / 2);
        const rightX = x + (xOffset * totalWidth / 2);
        const Y = y + (nodeSize * 2);

        if (this.left) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(x, y);
            ctx.lineTo(leftX, Y);
            ctx.stroke();

            this.left.drawTree(ctx, leftX, Y, nodeSize, xOffset - (xOffset / 3));
        }

        if (this.right) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(x, y);
            ctx.lineTo(rightX, Y);
            ctx.stroke();

            this.right.drawTree(ctx, rightX, Y, nodeSize, xOffset - (xOffset / 3));
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

    private calculateSubtreeWidth(): number {
        let width = 1;

        if (this.left) width += this.left.calculateSubtreeWidth();
        if (this.right) width += this.right.calculateSubtreeWidth();

        return width;
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

        return `{ 
                    value: ${node.value}, 
                    left: ${left}, 
                    right: ${right} 
                }`;
    }
}