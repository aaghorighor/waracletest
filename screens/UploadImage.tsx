import React, { useState } from "react";
import {
    YStack,
    XStack,
    StyledSafeAreaView,   
    StyledText,
    StyledHeader,
    StyledSpacer,
    StyledOkDialog,
    StyledSpinner,   
    StyledButton,
    FlexStyledImage,
} from "fluent-styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fontStyles, theme } from "../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { Cat, useCatImages } from "../hooks/useCatImages";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../navigation/RootStackParamList";
import * as ImagePicker from "expo-image-picker";

type UploadImageScreenNavigationProp = StackNavigationProp<
    AppStackParamList,
    "uploadImage"
>;

const UploadImage = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const navigation = useNavigation<UploadImageScreenNavigationProp>();
    const { data, error, loading, handleReset, handleUpload } = useCatImages()

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (imageUrl)
            await handleUpload(imageUrl)
    }
  
    return <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
        <StyledHeader statusProps={{ translucent: true }}>
            <StyledHeader.Header onPress={() => navigation.goBack()} title='Upload Image' icon cycleProps={{
                borderColor: theme.colors.gray[300],
                marginRight: 8
            }} />
        </StyledHeader>
        <YStack flex={1} paddingVertical={8} paddingHorizontal={8} backgroundColor={theme.colors.gray[100]}>
            <XStack justifyContent="center" alignItems="center">
                <FlexStyledImage borderRadius={15} borderWidth={5} borderColor={theme.colors.gray[100]} height={250} width={250} imageUrl={imageUrl} />
                <XStack absolute right={40} bottom={-80}>
                    <Icon size={48} name="add-a-photo" color={theme.colors.gray[800]} onPress={() => pickImage()} />
                </XStack>
            </XStack>
            <StyledSpacer marginVertical={8} />
            <StyledButton backgroundColor={theme.colors.cyan[500]} onPress={() => handleSubmit()}>
                <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[1]}>
                    Upload
                </StyledText>
            </StyledButton>
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
        {
            // data && (
            //     navigation.goBack()
            // )
        }
    </StyledSafeAreaView>;
}

export default UploadImage;
