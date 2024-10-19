import React from "react";
import {	
	XStack,
	StyledCard,
	StyledText,
	StyledSpacer,
	StyledCycle,
	FlexStyledImage,
} from "fluent-styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fontStyles, theme } from "../utils/theme";
import { Cat } from "../hooks/useCatImages";

interface ImageCardProps {
	item: Cat;
	handleVote: (id: string, vote: "up" | "down") => Promise<void>;
	handleFavourite: (id: string) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({
	item,
	handleVote,
	handleFavourite,
}) => {
	return (
		<StyledCard
			marginBottom={8}
			borderColor={theme.colors.gray[300]}
			backgroundColor={theme.colors.gray[200]}
			shadow="light"
			marginHorizontal={4}
			borderRadius={15}
			flex={1}
		>
			<FlexStyledImage
				local={false}
				borderRadius={15}
				height={180}
				flex={1}
				imageUrl={item.url}
			/>

			<XStack
				paddingVertical={8}
				paddingHorizontal={16}
				marginHorizontal={8}
				marginVertical={8}
				justifyContent="flex-start"
				alignItems="center"
				backgroundColor={theme.colors.gray[50]}
				borderRadius={30}
			>
				<Icon
					size={26}
					name="thumb-up-off-alt"
					color={theme.colors.gray[400]}
					onPress={async () => await handleVote(item.id, "up")}
				/>
				<StyledText
					paddingHorizontal={8}
					fontFamily={fontStyles.Roboto_Regular}
					fontWeight={theme.fontWeight.bold}
					fontSize={theme.fontSize.large}
					color={theme.colors.gray[800]}
				>
					{item.score} {item.isFavourite}
				</StyledText>
				<Icon
					size={26}
					name="thumb-down-off-alt"
					color={theme.colors.gray[400]}
					onPress={async () => await handleVote(item.id, "down")}
				/>
				<StyledSpacer flex={1} />
				<StyledCycle
					height={26}
					width={26}
					borderWidth={1}
					borderColor={theme.colors.gray[100]}
					backgroundColor={theme.colors.gray[100]}
				>
					<Icon
						size={24}
						name={item.isFavourite ? "favorite" : "favorite-outline"}
						color={theme.colors.red[500]}
						onPress={async () => await handleFavourite(item.id)}
					/>
				</StyledCycle>
			</XStack>
		</StyledCard>
	);
};

export default ImageCard;
