import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyDIJw9FcF4JdyLjMLr7yvm4WvCGCCzvxss",
  authDomain: "medalert-61d12.firebaseapp.com",
  projectId: "medalert-61d12",
  storageBucket: "medalert-61d12.appspot.com",
  messagingSenderId: "33503415485",
  appId: "1:33503415485:web:9a4502542cad58c2c47bd4",
  measurementId: "G-3Q7457FZH6"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// ✅ Request notification permission and send token to backend
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BDXxCykp_AA9tc6EsLBuJrRVBqeRebnP_oNYVIZephyJ2n6OQY9P9BTfXZ--0j8n1rCzCNSTdfwQNDaD66MYNZo"
    });

    if (token) {
      console.log("✅ FCM Token:", token);

      const jwtToken = localStorage.getItem("token");
      if (!jwtToken) return console.warn("⚠️ No JWT found in localStorage");

      // ✅ Send FCM token to backend with Authorization header
      await axios.post("https://medalert-backend-3-production.up.railway.app/api/users/fcm-token", {
        fcmToken: token
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      console.log("✅ FCM token saved to backend.");
    }
  } catch (err) {
    console.error("❌ Token Error:", err);
  }
};

// ✅ Foreground message listener
export const onMessageListener = () =>
  new Promise((resolve) =>
    onMessage(messaging, (payload) => resolve(payload))
  );
