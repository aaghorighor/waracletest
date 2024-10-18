import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "./RootStackParamList";

export type AppRouteProps = StackNavigationProp<AppStackParamList, "home">;