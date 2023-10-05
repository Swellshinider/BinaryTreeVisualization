import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Node } from './components/models/node.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  author: string = 'Eduardo Ribeiro Leal';
  contact: string = '<eduardoleal.contact@gmail.com>';

  @ViewChild('valueInput')
  valueInput!: ElementRef;

  @ViewChild('canvasBoard')
  canvasBoard!: ElementRef;

  // Generation
  genQuantity: number = 15;
  minValue: number = 0;
  maxValue: number = 1000;

  // Configuration
  configOpen: boolean = false;
  genDelay: number = 500;
  nodeSize: number = 40;
  spacingValue: number = 10;

  private root: Node | null = null;

  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;
    const windowWidth: number = window.innerWidth;

    canva.canvas.height = windowWidth - 275;
    canva.canvas.width = windowWidth - 275;
    this.updateCanvas();
  }

  validarTecla(event: any) {
    var tecla = event.key || String.fromCharCode(event.keyCode);

    if (tecla.toLowerCase() === 'e')
      event.preventDefault();
  }

  async generateRandom() {
    const myNumbers = this.generateRandomNumbers(this.genQuantity, this.minValue, this.maxValue);

    for (let i = 0; i < myNumbers.length; i++) {
      this.addNumber(myNumbers[i]);
      await new Promise<void>((resolve) => { setTimeout(() => { resolve(); }, this.genDelay < 0 ? 0 : this.genDelay); });
    }
  }

  sendInput() {
    const value = parseInt(this.valueInput.nativeElement.value, 10);

    if (value == null || value == undefined || Number.isNaN(value)) {
      alert("Não, valores nulos não serão aceitos")
      return;
    }

    if (value > 9999 || value < -9999) {
      alert(`Infelizmente o valor ${value} não é aceito, tente um valor entre -9999 e 9999`);
      return;
    }

    this.addNumber(value);
  }

  addNumber(value: number) {
    if (this.root == null)
      this.root = new Node(value);
    else
      this.inputNextNode(this.root, value);

    this.updateCanvas();
  }

  changeGeneratingQuantity(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.genQuantity = value;
  }

  changeDelaySpeed(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.genDelay = value;
  }

  changeSpacing(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.spacingValue = value;
    this.updateCanvas();
  }

  changeNodeSize(event: any): void {
    const value = parseInt(event.target.value, 10);

    if (value < 0) {
      alert("Existe tamanho negativo??");
      return;
    }

    this.nodeSize = value;
    this.updateCanvas();
  }

  canvasMouseDown(event: any): void {
    if (this.root == null) return;

    this.root.isDragging = true;
    this.root.dragStartX = event.clientX;
    this.root.dragStartY = event.clientY;
  }

  canvasMouseMove(event: any): void {
    if (this.root == null) return;
    if (!this.root.isDragging) return

    const deltaX = event.clientX - this.root.dragStartX;
    const deltaY = event.clientY - this.root.dragStartY;

    this.root.offsetX += deltaX;
    this.root.offsetY += deltaY;

    this.updateCanvas();

    this.root.dragStartX = event.clientX;
    this.root.dragStartY = event.clientY;
  }

  canvasMouseUp(): void {
    if (this.root == null) return;

    this.root.isDragging = false;
  }

  clearTree(): void {
    this.root = null;
    this.updateCanvas();
  }

  private updateCanvas(): void {
    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;
    canva.clearRect(0, 0, canva.canvas.width, canva.canvas.height);

    this.drawGrid(canva, 25, '#CCC');

    if (this.root)
      this.root.draw(canva, this.spacingValue, this.canvasBoard.nativeElement.width, this.nodeSize, this.canvasBoard.nativeElement.height);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, gridSize: number, color1: string) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    ctx.strokeStyle = color1;
    ctx.lineWidth = 1;

    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }

  private generateRandomNumbers(count: number, min: number, max: number): number[] {
    const randomNumbers: number[] = [];

    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      randomNumbers.push(randomNumber);
    }

    return randomNumbers;
  }

  private inputNextNode(node: Node, value: number) {
    if (value >= node.value)
      node.right === null ? node.right = new Node(value) : this.inputNextNode(node.right, value);
    else
      node.left === null ? node.left = new Node(value) : this.inputNextNode(node.left, value);
  }
}