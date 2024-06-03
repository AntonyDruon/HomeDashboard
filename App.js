import React from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Splash from "./src/screen/Splash/Splash";
import SignIn from "./src/screen/SignIn/SignIn";
import SignUp from "./src/screen/SignUp/SignUp.mjs";
import HomeLights from "./src/screen/Light/Home.js";
import Rooms from "./src/screen/Rooms/Rooms.js";
import Hue from "./src/screen/Light/Hue.js";
import Nanoleaf from "./src/screen/Light/Nanoleaf.js";

import Dashboard from "./src/screen/Dashboard/Dashboard";
const Stack = createStackNavigator();

import store from "../HomeDashboard/src/store/store";

const App = () => {
  return (
    <Provider store={store}>
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
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lights"
            component={HomeLights}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Rooms"
            component={Rooms}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Hue"
            component={Hue}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Nanoleaf"
            component={Nanoleaf}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
