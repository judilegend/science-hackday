import { db, auth } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const reportIssue = async (type, description) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const issueData = {
      type,
      description,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      // You would typically get these from the device's GPS
      latitude: 0,
      longitude: 0,
    };

    await addDoc(collection(db, "issues"), issueData);
  } catch (error) {
    console.error("Error reporting issue:", error);
    throw error;
  }
};

export const getReportedIssues = async () => {
  try {
    const issuesSnapshot = await getDocs(collection(db, "issues"));
    return issuesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting reported issues:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const notificationsSnapshot = await getDocs(notificationsQuery);
    return notificationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

export const getConsumptionData = async (type) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const consumptionQuery = query(
      collection(db, "consumption"),
      where("userId", "==", user.uid),
      where("type", "==", type),
      orderBy("date", "asc")
    );
    const consumptionSnapshot = await getDocs(consumptionQuery);
    return consumptionSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting consumption data:", error);
    throw error;
  }
};
