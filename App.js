import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./src/screen/Splash/Splash";
import SignIn from "./src/screen/SignIn/SignIn";
import SignUp from "./src/screen/SignUp/SignUp.mjs";
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
