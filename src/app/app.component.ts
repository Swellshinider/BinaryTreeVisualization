import { Component, ElementRef, ViewChild } from '@angular/core';
import { Node } from './components/models/node.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  author: string = 'Eduardo Ribeiro Leal';
  contact: string = '<eduardoleal.contact@gmail.com>';

  @ViewChild('valueInput')
  valueInput!: ElementRef;

  @ViewChild('canvasBoard')
  canvasBoard!: ElementRef;

  configOpen: boolean = false;
  genDelay: number = 500;
  nodeSize: number = 40;
  genQuantity: number = 15;
  spacingValue: number = 10;
  boardWidth: number = 1200;
  boardHeight: number = 800;

  private root!: Node;

  validarTecla(event: any) {
    var tecla = event.key || String.fromCharCode(event.keyCode);

    if (tecla.toLowerCase() === 'e')
      event.preventDefault();
  }

  async generateRandom() {
    const myNumbers = this.generateRandomNumbers(this.genQuantity, -100, 100);

    for (let i = 0; i < myNumbers.length; i++) {
      this.addNumber(myNumbers[i]);
      await this.delay(this.genDelay);
    }
  }

  sendInput() {
    const value = this.valueInput.nativeElement.value;
    this.addNumber(parseInt(value, 10));
  }

  addNumber(value: number) {
    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;

    if (this.root == null)
      this.root = new Node(value);
    else
      this.inputNextNode(this.root, value);

    this.root.draw(canva, this.spacingValue, this.canvasBoard.nativeElement.width, this.nodeSize, this.canvasBoard.nativeElement.height);
  }

  printTree() {
    console.log(this.root.toString());
  }

  changeBoardWidth(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.boardWidth = value;
    this.updateCanvas();
  }

  changeBoardHeight(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.boardHeight = value;
    this.updateCanvas();
  }

  changeSpacing(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.spacingValue = value;

    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;
    this.root.draw(canva, this.spacingValue, this.canvasBoard.nativeElement.width, this.nodeSize, this.canvasBoard.nativeElement.height);
  }

  changeNodeSize(event: any): void {
    const value = parseInt(event.target.value, 10);
    this.nodeSize = value;

    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;
    this.root.draw(canva, this.spacingValue, this.canvasBoard.nativeElement.width, this.nodeSize, this.canvasBoard.nativeElement.height);
  }

  private async updateCanvas(): Promise<void> {
    this.canvasBoard.nativeElement.width = this.boardWidth;
    this.canvasBoard.nativeElement.height = this.boardHeight;

    await this.delay(200);

    const canva = this.canvasBoard.nativeElement.getContext('2d', undefined) as CanvasRenderingContext2D;
    this.root.draw(canva, this.spacingValue, this.canvasBoard.nativeElement.width, this.nodeSize, this.canvasBoard.nativeElement.height);
  }

  private async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
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