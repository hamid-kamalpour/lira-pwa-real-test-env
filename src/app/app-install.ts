import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'pwa-install',
  template: `
    <div *ngIf="show">
      <div>
        <h3>Install this app</h3>
        <button (click)="installPwa()">Install</button>
        <button (click)="hideDialog()">Close</button>
      </div>
    </div>
    <button *ngIf="!show && isInstallAvailable && !isStandalone" (click)="showDialog()">
      Show Install Prompt
    </button>
  `,
  styles: [
    `
    div { position: fixed; top: 20%; left: 40%; background: white; border: 1px solid #ccc; padding: 2em; }
  `,
  ],
})
export class PwaInstallComponent implements OnInit {
  @Output() installSuccess = new EventEmitter<string>();
  @Output() installFail = new EventEmitter<string>();
  @Output() installAvailable = new EventEmitter<string>();
  @Output() userChoiceResult = new EventEmitter<string>();

  deferredPrompt: any = null;
  isInstallAvailable = false;
  isStandalone = false;
  show = false;

  ngOnInit() {
    this.isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallAvailable = true;
      this.installAvailable.emit('App install available');
    });

    window.addEventListener('appinstalled', () => {
      this.installSuccess.emit('App install success');
      this.hideDialog();
    });
  }

  showDialog() {
    this.show = true;
  }

  hideDialog() {
    this.show = false;
  }

  installPwa() {
    if (!this.deferredPrompt) {
      this.installFail.emit('No install prompt available');
      return;
    }
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((result: any) => {
      this.userChoiceResult.emit(result.outcome);
      if (result.outcome === 'accepted') {
        this.installSuccess.emit('App install success');
      } else {
        this.installFail.emit('App install dismissed');
      }
      this.deferredPrompt = null;
      this.hideDialog();
    });
  }
}
