import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";

import { AppStackParamList } from "./RootStackParamList";
import { NavigationContainer } from "@react-navigation/native";
import UploadImage from "../screens/UploadImage";

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
	return <NavigationContainer>
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="home" component={Home} />
			<Stack.Screen name="uploadImage" component={UploadImage} />
		</Stack.Navigator>
	</NavigationContainer>;
};

export default AppNavigator;
