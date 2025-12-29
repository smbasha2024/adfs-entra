import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from "./providers"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login Simulation - AppHub Ecosystem',
  description: 'Application A with unified authentication powered by Azure Entra External ID',
  keywords: ['authentication', 'azure', 'sso', 'passkey', 'mfa'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google reCAPTCHA */}
        <script 
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async 
          defer
        ></script>
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      
      <body className={inter.className}>
        
        <div id="app-root">
          {children}
        </div>
        
        {/* Script for reCAPTCHA execution */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function executeRecaptcha() {
                return new Promise((resolve) => {
                  grecaptcha.ready(function() {
                    grecaptcha.execute('${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}', {action: 'login'})
                      .then(function(token) {
                        resolve(token);
                      });
                  });
                });
              }
              
              // Global function for reCAPTCHA callback
              window.handleRecaptchaCallback = function(token) {
                // This will be used by the LoginForm component
                const event = new CustomEvent('recaptchaVerified', { detail: token });
                window.dispatchEvent(event);
              };
            `,
          }}
        />
      </body>
    </html>
  );
}