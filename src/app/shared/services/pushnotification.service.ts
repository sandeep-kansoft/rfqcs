// notification.service.ts
import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class PushnotificationService {
  private notificationOptions: NotificationOptions = {
    icon: './assets/media/wonder/RED-LOGO-Notification.png', // Replace with the path to your notification icon
  };

  private sound = new Howl({
    src: [''], // Replace with the path to your notification sound
  });

  constructor() {}

  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        // console.log('Notification permission:', permission);
      });
    }
  }

  showNotification(title: string, options?: NotificationOptions): void {
    const mergedOptions = { ...this.notificationOptions, ...options };
    
    // Check if the browser supports notifications
    if ('Notification' in window) {
      // Request permission to show notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification(title, mergedOptions);

          // Play notification sound
          this.sound.play();

          // Close the notification after a few seconds (adjust as needed)
          setTimeout(() => {
            notification.close();
          }, 10000);
        }
      });
    }
  }
}
