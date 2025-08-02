import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [email, setEmail] = useState<string>(""); //to keep the track of whats getting typed in the email section
  const [password, setPassword] = useState<string>(""); //same for the password
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();
  const router = useRouter();

  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    //to help signing in and creating an account
    if (!email || !password) {
      //restricts user from signing in if one the parameters are missing
      setError("Please fill in all the fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if(error){
        setError(error);
        return;
      }
    } 
    else {
      const error = await signIn(email, password);
        if(error){
        setError(error);
        return;
      }
      router.replace("/");
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}{" "}
        </Text>

        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail} //tracking
        ></TextInput>

        <TextInput
          label="Password"
          autoCapitalize="none"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword} //tracking
        ></TextInput>

        {error && <Text style={{ color: theme.colors.error }}> {error} </Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}{" "}
        </Button>

        <Button
          mode="text"
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  switchModeButton: {
    marginBottom: 16,
  },
});
