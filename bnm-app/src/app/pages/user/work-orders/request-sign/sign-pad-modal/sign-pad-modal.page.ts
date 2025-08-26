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

// Import the SignaturePad library directly from node_modules.
import SignaturePad from 'signature_pad';
// Import Capacitor's ScreenOrientation plugin to control device orientation.
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-sign-pad-modal',
  templateUrl: './sign-pad-modal.page.html',
  styleUrls: ['./sign-pad-modal.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SignPadModalPage implements AfterViewInit, OnDestroy {

  @ViewChild('signatureCanvas', { static: false }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  constructor(private modalCtrl: ModalController) {}

  async ionViewWillEnter() {
    try {
      // Bloquea en apaisado al entrar
      await ScreenOrientation.lock({ orientation: 'landscape-primary' });
      console.log('Screen orientation locked to landscape.');
    } catch (error) {
      console.warn('Screen orientation lock failed.', error);
    }
  }


  async ionViewWillLeave() {
    try {
      // En lugar de solo desbloquear, forzamos el regreso a portrait
      await ScreenOrientation.lock({ orientation: 'portrait-primary' });
      console.log('Screen orientation locked back to portrait.');
    } catch (error) {
      console.warn('Failed to lock screen orientation back to portrait.', error);
    }
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeSignaturePad();
      window.addEventListener('resize', this.onResize);
    }, 300);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.resizeCanvas();
  }

  private initializeSignaturePad() {
    if (!this.signatureCanvas) {
      console.error("Signature canvas element could not be found.");
      return;
    }
    const canvas = this.signatureCanvas.nativeElement;
    
    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 5,
      penColor: 'black',
    });

    this.resizeCanvas();
  }

  private resizeCanvas() {
    if (!this.signatureCanvas || !this.signaturePad) {
      return;
    }

    const canvas = this.signatureCanvas.nativeElement;
    const parent = canvas.parentElement;

    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      
      if (parentRect.width === 0 || parentRect.height === 0) {
        console.warn("Canvas parent has zero dimensions. Sizing might be incorrect.");
        return;
      }

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      
      canvas.width = parentRect.width * ratio;
      canvas.height = parentRect.height * ratio;

      canvas.style.width = `${parentRect.width}px`;
      canvas.style.height = `${parentRect.height}px`;

      canvas.getContext('2d')?.scale(ratio, ratio);
      
      this.signaturePad.clear();
    }
  }

  public clearSignature() {
    this.signaturePad.clear();
  }

  public changePenColor(color: string) {
    this.signaturePad.penColor = color;
  }

  public acceptSignature() {
    if (this.signaturePad.isEmpty()) {
      console.warn('Please provide a signature before accepting.');
      return;
    }

    const dataURL = this.signaturePad.toDataURL('image/png');
    this.modalCtrl.dismiss({ signature: dataURL });
  }

  public cancel() {
    this.modalCtrl.dismiss();
  }
}