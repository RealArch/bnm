import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';

import { getStroke } from 'perfect-freehand';
import { ScreenOrientation } from '@capacitor/screen-orientation';

const STROKE_OPTIONS = {
  size: 8,
  thinning: 0.65,
  smoothing: 0.5,
  streamline: 0.6,
  easing: (t: number) => t,
};

type Stroke = {
  points: number[][];
  color: string;
};

@Component({
  selector: 'app-sign-pad-modal',
  templateUrl: './sign-pad-modal.page.html',
  styleUrls: ['./sign-pad-modal.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SignPadModalPage implements AfterViewInit, OnDestroy {

  @ViewChild('signatureCanvas', { static: false }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
  
  private canvasContext!: CanvasRenderingContext2D;
  private penColor = 'black';
  
  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;

  // 🚨 Para controlar el último pointer activo
  private activePointerId: number | null = null;

  constructor(private modalCtrl: ModalController) {}

  async ionViewWillEnter() {
    try {
      await ScreenOrientation.lock({ orientation: 'landscape-primary' });
    } catch (error) {
      console.warn('Screen orientation lock failed.', error);
    }
  }

  async ionViewWillLeave() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait-primary' });
    } catch (error) {
      console.warn('Failed to lock screen orientation back to portrait.', error);
    }
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeCanvas();
      window.addEventListener('resize', this.onResize);
    }, 300);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
    if(this.signatureCanvas?.nativeElement) {
      this.signatureCanvas.nativeElement.removeEventListener('pointerdown', this.handlePointerDown);
    }
  }

  private initializeCanvas() {
    if (!this.signatureCanvas) {
      console.error("Signature canvas element could not be found.");
      return;
    }
    const canvas = this.signatureCanvas.nativeElement;
    this.canvasContext = canvas.getContext('2d')!;
    canvas.addEventListener('pointerdown', this.handlePointerDown);

    canvas.style.touchAction = "none";
    canvas.style.caretColor = "transparent";

    this.resizeCanvas();
  }
  
  private onResize = () => {
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    const parent = canvas.parentElement;

    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      
      canvas.width = parentRect.width * ratio;
      canvas.height = parentRect.height * ratio;
      canvas.style.width = `${parentRect.width}px`;
      canvas.style.height = `${parentRect.height}px`;

      this.canvasContext.scale(ratio, ratio);
      this.redrawCanvas();
    }
  }

  private redrawCanvas() {
    this.canvasContext.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);

    this.strokes.forEach(stroke => {
      this.drawStroke(stroke);
    });

    if (this.currentStroke) {
      this.drawStroke(this.currentStroke);
    }
  }

  private drawStroke(stroke: Stroke) {
    const strokePoints = getStroke(stroke.points, STROKE_OPTIONS);
    if (strokePoints.length < 2) return;

    this.canvasContext.fillStyle = stroke.color;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(strokePoints[0][0], strokePoints[0][1]);
    for (let i = 1; i < strokePoints.length; i++) {
      this.canvasContext.lineTo(strokePoints[i][0], strokePoints[i][1]);
    }
    this.canvasContext.closePath();
    this.canvasContext.fill();
  }

  private handlePointerDown = (event: PointerEvent) => {
    let canDraw = false;

    if (event.pointerType === 'pen' || event.pointerType === 'mouse') {
      canDraw = true;
    } 
    else if (event.pointerType === 'touch') {
      const PALM_CONTACT_THRESHOLD = 25;
      if (event.width > PALM_CONTACT_THRESHOLD || event.height > PALM_CONTACT_THRESHOLD) {
        canDraw = false;
      } else {
        canDraw = true;
      }
    }

    if (!canDraw) {
      return;
    }

    // 🚨 Guardamos el pointerId del último touch/stylus válido
    this.activePointerId = event.pointerId;

    event.preventDefault();
    this.currentStroke = {
      points: [[event.offsetX, event.offsetY, event.pressure]],
      color: this.penColor
    };
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
  };

  private handlePointerMove = (event: PointerEvent) => {
    // 🚨 Ignorar cualquier pointer que no sea el activo
    if (event.pointerId !== this.activePointerId) return;

    if (!this.currentStroke) return;
    if (event.pointerType === 'pen' && event.buttons === 0) return; // hover → ignorar

    event.preventDefault();
    this.currentStroke.points.push([event.offsetX, event.offsetY, event.pressure]);
    this.redrawCanvas();
  };

  private handlePointerUp = (event: PointerEvent) => {
    // 🚨 Solo cerrar si es el pointer activo
    if (event.pointerId === this.activePointerId) {
      if (this.currentStroke) {
        this.strokes.push(this.currentStroke);
        this.currentStroke = null;
      }
      this.activePointerId = null;
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
      this.redrawCanvas();
    }
  };

  public clearSignature() {
    this.strokes = [];
    this.currentStroke = null;
    this.redrawCanvas();
  }

  public changePenColor(color: string) {
    this.penColor = color;
  }

  public acceptSignature() {
    if (this.strokes.length === 0) {
      console.warn('Por favor, provea una firma antes de aceptar.');
      return;
    }
    const dataURL = this.signatureCanvas.nativeElement.toDataURL('image/png');
    this.modalCtrl.dismiss({ signature: dataURL });
  }

  public cancel() {
    this.modalCtrl.dismiss();
  }
}
