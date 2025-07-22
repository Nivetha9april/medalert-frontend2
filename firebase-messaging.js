// firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

// 🔐 Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIJw9FcF4JdyLjMLr7yvm4WvCGCCzvxss",
  authDomain: "medalert-61d12.firebaseapp.com",
  projectId: "medalert-61d12",
  storageBucket: "medalert-61d12.appspot.com",
  messagingSenderId: "33503415485",
  appId: "1:33503415485:web:9a4502542cad58c2c47bd4",
  measurementId: "G-3Q7457FZH6",
};

// ✅ Initialize Firebase and Messaging
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// ✅ Request FCM token and send to backend securely
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BDXxCykp_AA9tc6EsLBuJrRVBqeRebnP_oNYVIZephyJ2n6OQY9P9BTfXZ--0j8n1rCzCNSTdfwQNDaD66MYNZo",
    });

    if (token) {
      console.log("✅ FCM Token:", token);

      const jwt = localStorage.getItem("token");
      if (!jwt) {
        console.warn("⚠️ JWT token not found. User may not be logged in.");
        return;
      }

      // 🔐 Send token to backend with auth
      await axios.post(
        "https://medalert-backend-3-production.up.railway.app/api/users/fcm-token",
        { token },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("✅ FCM token saved to backend.");
    }
  } catch (err) {
    console.error("❌ Token Error:", err);
  }
};

// ✅ Handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) =>
    onMessage(messaging, (payload) => resolve(payload))
  );
