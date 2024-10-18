import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "./RootStackParamList";

export type NoNetWorkNavigationProps = StackNavigationProp<
	AppStackParamList,
	"home"
>;