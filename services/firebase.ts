import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set, onValue, off, query, orderByChild, limitToLast, remove } from "firebase/database";
import { MoodEntry, Goal } from "../types";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7kW8wJJjviPPqf1bbzvhNJLWloyfxSkE",
  authDomain: "manam-ai.firebaseapp.com",
  databaseURL: "https://manam-ai-default-rtdb.firebaseio.com/",
  projectId: "manam-ai",
  storageBucket: "manam-ai.firebasestorage.app",
  messagingSenderId: "305963698989",
  appId: "1:305963698989:web:8f6e87091379f8ce4161a4",
  measurementId: "G-0V4WB46HDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app);

// Database service functions for mood entries
export const moodService = {
  // Add a new mood entry
  addMoodEntry: async (userId: string, moodEntry: Omit<MoodEntry, 'id'>): Promise<string> => {
    const moodEntriesRef = ref(db, `users/${userId}/moodEntries`);
    const newEntryRef = push(moodEntriesRef);
    const entryWithTimestamp = {
      ...moodEntry,
      timestamp: moodEntry.timestamp.toISOString()
    };
    await set(newEntryRef, entryWithTimestamp);
    return newEntryRef.key!;
  },

  // Listen to mood entries changes
  listenToMoodEntries: (userId: string, callback: (entries: MoodEntry[]) => void): (() => void) => {
    const moodEntriesRef = ref(db, `users/${userId}/moodEntries`);
    const moodQuery = query(moodEntriesRef, orderByChild('timestamp'), limitToLast(100));
    
    const unsubscribe = onValue(moodQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries: MoodEntry[] = Object.entries(data).map(([id, entry]: [string, any]) => ({
          id,
          mood: entry.mood,
          notes: entry.notes,
          timestamp: new Date(entry.timestamp)
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        callback(entries);
      } else {
        callback([]);
      }
    });

    return () => off(moodEntriesRef, 'value', unsubscribe);
  },

  // Delete a mood entry
  deleteMoodEntry: async (userId: string, entryId: string): Promise<void> => {
    const entryRef = ref(db, `users/${userId}/moodEntries/${entryId}`);
    await remove(entryRef);
  }
};

// Database service functions for goals
export const goalService = {
  // Add a new goal
  addGoal: async (userId: string, goal: Omit<Goal, 'id'>): Promise<string> => {
    const goalsRef = ref(db, `users/${userId}/goals`);
    const newGoalRef = push(goalsRef);
    await set(newGoalRef, goal);
    return newGoalRef.key!;
  },

  // Listen to goals changes
  listenToGoals: (userId: string, callback: (goals: Goal[]) => void): (() => void) => {
    const goalsRef = ref(db, `users/${userId}/goals`);
    
    const unsubscribe = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const goals: Goal[] = Object.entries(data).map(([id, goal]: [string, any]) => ({
          id,
          ...goal
        }));
        callback(goals);
      } else {
        callback([]);
      }
    });

    return () => off(goalsRef, 'value', unsubscribe);
  },

  // Update a goal
  updateGoal: async (userId: string, goalId: string, updates: Partial<Goal>): Promise<void> => {
    const goalRef = ref(db, `users/${userId}/goals/${goalId}`);
    await set(goalRef, updates);
  },

  // Delete a goal
  deleteGoal: async (userId: string, goalId: string): Promise<void> => {
    const goalRef = ref(db, `users/${userId}/goals/${goalId}`);
    await remove(goalRef);
  }
};

// User profile service functions
export const userService = {
  // Initialize user profile
  initializeUserProfile: async (userId: string, userData: any): Promise<void> => {
    const userRef = ref(db, `users/${userId}/profile`);
    await set(userRef, userData);
  },

  // Get user profile
  getUserProfile: (userId: string, callback: (profile: any) => void): (() => void) => {
    const userRef = ref(db, `users/${userId}/profile`);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });

    return () => off(userRef, 'value', unsubscribe);
  }
};
