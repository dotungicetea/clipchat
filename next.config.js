/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = withPWA({
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      const fileContent = `// Scripts for firebase and firebase messaging
      importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
      importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
      
      // Initialize the Firebase app in the service worker by passing the generated config
      const firebaseConfig = {
        apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
        authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com",
        projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
        storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com",
        messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
        appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}",
        measurementId: "${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}",
      };
      
      firebase.initializeApp(firebaseConfig);
      
      // Retrieve firebase messaging
      const messaging = firebase.messaging();
      
      messaging.onBackgroundMessage(function (payload) {
        console.log('Received background message ', payload);
      
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
        };
      
        self.registration.showNotification(notificationTitle,
          notificationOptions);
      });`;

      // The path of the file
      const filePath = path.join(__dirname, 'public', 'firebase-messaging-sw.js');

      // Create the file
      fs.writeFileSync(filePath, fileContent, 'utf8');

      // Configure webpack to copy the file to the public folder
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            { from: 'public', to: '' },
          ],
        })
      );
    }

    return config;
  },

  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'pbs.twimg.com'
    },
    {
      protocol: 'https',
      hostname: 'abs.twimg.com'
    }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${[process.env.NEXT_PUBLIC_BASE_API]}:path*`
      }
    ]
  }
})

module.exports = nextConfig
