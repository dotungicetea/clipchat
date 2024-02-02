"use client";

import { put } from "@/request";
import { toastError } from "@components/CustomToast";
import { saveFcmToken } from "@utils/index";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useCallback, useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`,
  measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`,
};

const useFirebase = (nextStep?: () => void) => {
  const [token, setToken] = useState<string>("");
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();
  const [loadingAllow, setLoadingAllow] = useState<boolean>(false);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    setFirebaseApp(app);
  }, []);

  const allowNotifications = useCallback(
    async (isEnable = true) => {
      setLoadingAllow(true);

      const handleNotificationPermission = async (permission: NotificationPermission) => {
        if (permission === "denied") {
          toastError("The notification permission was not granted and blocked instead.");
          return;
        }
        if (permission === "default") return;
        try {
          const messaging = getMessaging(firebaseApp);
          const fbToken = await getToken(messaging);
          console.log("firebase token", fbToken);
          setToken(fbToken);
          await put("/update-fcm-token", {
            body: {
              fcmToken: fbToken,
              isEnable,
            },
            needAuth: true,
          });
          saveFcmToken(fbToken);
          nextStep?.();
          return true;
        } catch (error) {
          console.log("handleNotificationPermission error", error);
          toastError(error?.message + "\nPlease try again!");
        } finally {
          setLoadingAllow(false);
        }
      };

      try {
        switch (Notification.permission) {
          case "granted":
            return await handleNotificationPermission(Notification.permission);
          case "default":
            const permission = await Notification.requestPermission();
            return await handleNotificationPermission(permission);
          case "denied":
          default:
            toastError("The notification permission was not granted and blocked instead.");
            break;
        }
      } catch (error) {
        console.log("firebase error", error);
      } finally {
        setLoadingAllow(false);
      }
    },
    [firebaseApp, nextStep],
  );

  return {
    token,
    loadingAllow,
    allowNotifications,
  };
};

export default useFirebase;
