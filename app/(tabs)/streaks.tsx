import {
  COMPLETIONS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Query } from "react-native-appwrite";

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchCompletions();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );

      setHabits(response.documents as unknown as Habit[]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompletions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      const completions = response.documents as unknown as HabitCompletion[];
      setCompletedHabits(completions);
    } catch (error) {
      console.log(error);
    }
  };

  const getStreakData = (habitId: string) => {
    const habitCompletions = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );
  };

  return (
    <View>
      <Text>Habit Streaks</Text>
    </View>
  );
}
