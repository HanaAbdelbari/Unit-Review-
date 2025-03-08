import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { Configuration, ConfigurationParameters, ReviewsService } from '@interiordesigner/reviews-client';

// Function to provide configuration for the API client
export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'http://localhost:3000', // Ensure the protocol is included
  };
  return new Configuration(params);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    { provide: Configuration, useFactory: apiConfigFactory },
    ReviewsService // Provide the service directly
  ]
}).catch((err) => console.error(err));
