import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { counterReducer } from './store/counter.reducer';
import { userReducer } from './store/demo/user.reducer';
import { provideEffects } from '@ngrx/effects';
// import { RouterModule } from '@angular/router';

// import { UserEffects } from './store/demo/user.effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore({ counter: counterReducer, user:userReducer }),
    provideEffects(),  
    // Added here
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }) // Added here
    ,
    provideEffects()
]
};
