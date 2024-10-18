import React from "react";
import { useCustomFonts } from "./hooks/useCustomFonts";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
	const isReady = useCustomFonts();
		if (!isReady) {
		return null;
	}	

	return <AppNavigator />;
}


