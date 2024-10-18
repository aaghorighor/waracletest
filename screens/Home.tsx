import React, { useEffect, useState } from "react";
import {
	YStack,
	XStack,
	StyledSafeAreaView,
	StyledCycle,	
	StyledHeader,
	StyledSpacer,
	StyledOkDialog,
	StyledSpinner,
	FlexStyledImage,
	StyledText	
} from "fluent-styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fontStyles, theme } from "../utils/theme";
import { useCatImages } from "../hooks/useCatImages";
import { useNavigation } from '@react-navigation/native';
import { FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../navigation/RootStackParamList";
import ImageCard from "../components/ImageCard";

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'home'>;

const Home = () => {
	const navigation = useNavigation<HomeScreenNavigationProp>();
	const [page, setPage] = useState<number>(1);
	const { data, error, loading, handleVote, handleReset, handleFavourite, fetchCats } = useCatImages();

	useEffect(() => {
		fetchCats(page)		
	}, [page])

	const loadMoreCats = () => {
		if (!loading) {
			setPage((prevPage) => prevPage + 1);
		}
	};	

	const RenderHeader = () => {
		return (
			<XStack flex={1} justifyContent='flex-start' alignItems='center' paddingVertical={8} paddingHorizontal={16} backgroundColor={theme.colors.gray[1]}>
				<FlexStyledImage
					local={true}
					borderRadius={100}
					height={48}
					width={48}
					imageUrl={require("../assets/cat_2.png")}
				/>				
				<StyledText
					paddingHorizontal={8}
					fontFamily={fontStyles.Roboto_Regular}
					fontWeight={theme.fontWeight.normal}
					fontSize={theme.fontSize.large}
					color={theme.colors.gray[800]}
				>
					Cat Gallery
				</StyledText>
				<StyledSpacer flex={1} />
				<StyledCycle height={48} width={48} borderWidth={1} borderColor={theme.colors.cyan[500]} backgroundColor={theme.colors.cyan[500]}>
					<Icon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigation.navigate('uploadImage')} />
				</StyledCycle>
			</XStack>
		)
	}

	return (
		<StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
			<StyledHeader statusProps={{ translucent: true }} >
				<StyledHeader.Full>
					<RenderHeader />
				</StyledHeader.Full>
			</StyledHeader>
			<YStack
				flex={1}
				paddingVertical={8}
				paddingHorizontal={8}
				backgroundColor={theme.colors.gray[100]}
			>
				<FlatList
					data={data}
					initialNumToRender={100}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					keyExtractor={(item) => item.id}
					renderItem={({ item, index }) => {
						return (
							<ImageCard item={item} key={`${index}-${item.id}`} handleFavourite={handleFavourite} handleVote={handleVote} />
						)
					}}
					onEndReached={loadMoreCats}
				/>
			</YStack>
			{
				(error) && (
					<StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
						handleReset()
					}} />
				)
			}
			{
				(loading) && (
					<StyledSpinner />
				)
			}
		</StyledSafeAreaView>
	);
};

export default Home;
