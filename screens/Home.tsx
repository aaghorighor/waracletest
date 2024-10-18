import React, { useEffect, useState, useRef } from "react";
import {
	YStack,
	XStack,
	StyledSafeAreaView,
	StyledCycle,
	StyledText,
	StyledHeader,
	StyledSpacer,
	StyledOkDialog,
	StyledSpinner,
	FlexStyledImage,
	StyledCard,
} from "fluent-styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fontStyles, theme } from "../utils/theme";
import { Cat, useCatImages } from "../hooks/useCatImages";
import { useNavigation } from '@react-navigation/native';
import { FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../navigation/RootStackParamList";

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

	const RenderImage = ({ item }: { item: Cat }) => {

		return (
			<StyledCard
				marginBottom={8}
				borderColor={theme.colors.gray[300]}
				backgroundColor={theme.colors.gray[200]}
				shadow='light'
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
				>
				</FlexStyledImage>

				<XStack
					paddingVertical={8}
					paddingHorizontal={8}
					marginHorizontal={8}
					marginVertical={8}
					justifyContent='flex-start' alignItems='center'
					backgroundColor={theme.colors.gray[50]}
					borderRadius={30}
				>
					<Icon size={26} name='thumb-up-off-alt' color={theme.colors.gray[500]} onPress={async () => await handleVote(item.id, "up")} />
					<StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} color={theme.colors.gray[800]}>
						{item.score} {item.isFavourite}
					</StyledText>
					<Icon size={26} name='thumb-down-off-alt' color={theme.colors.gray[500]} onPress={async () => await handleVote(item.id, "down")} />
					<StyledSpacer flex={1} />
					<StyledCycle height={26} width={26} borderWidth={1} borderColor={theme.colors.gray[100]} backgroundColor={theme.colors.gray[100]}>
						<Icon size={24} name={item.isFavourite ? 'favorite' : 'favorite-outline'} color={theme.colors.red[500]} onPress={async () => await handleFavourite(item.id)} />
					</StyledCycle>
				</XStack>

			</StyledCard>
		)
	}

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
				<StyledSpacer marginHorizontal={4} />
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
							<RenderImage item={item} key={`${index}-${item.id}`} />
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
