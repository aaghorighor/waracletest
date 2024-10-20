import axios from "axios";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
export interface Cat {
	id: string;
	url: string;
	height: number;
	width: number;
	isFavourite?: boolean;
	favouriteId?: string;
	score?: number;
}

interface Initialize {
	data: Cat[] | null | undefined;
	error: Error | null;
	loading: boolean;
}

const CAT_API_KEY = Constants.expoConfig?.extra?.apiKey;
const CAT_BASE_URL = Constants.expoConfig?.extra?.apiUrl;

const useCatImages = () => {

	const [cats, setCats] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	const fetchCats = async (page: number = 1) => {
		setCats((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await axios.get(`${CAT_BASE_URL}/v1/images/search`, {
				headers: {
					"x-api-key": CAT_API_KEY,
				},
				params: {
					limit: 10,
					page
				},
			});

			setCats((prevCats) => ({
				...prevCats,
				data: prevCats.data ? [...prevCats.data, ...response.data] : response.data,
				loading: false,
				error: null,
			}));
		} catch (err) {
			setCats((prev) => ({
				...prev,
				error: new Error("Failed to fetch cat images. Please try again."),
				loading: false,
			}));
		}
	};
	useEffect(() => {
		fetchCats(1);
	}, []);

	const handleVote = async (catId: string, voteType: "up" | "down") => {
		try {
			setCats((prev) => ({ ...prev, loading: true }));
			const response = await axios.post(
				`${CAT_BASE_URL}/v1/votes`,
				{ image_id: catId, value: voteType === "up" ? 1 : 0 },
				{ headers: { "x-api-key": CAT_API_KEY } },
			);

			if (response.status === 201) {
				setCats((prev) => ({
					...prev,
					data: prev.data?.map((c) =>
						c.id === catId
							? {
								...c,
								score:
									voteType === "up" ? (c.score || 0) + 1 : (c.score || 0) - 1,
							}
							: c,
					),
					loading: false
				}));
			}
		} catch (err) {
			setCats((prev) => ({
				...prev,
				error: new Error("Failed to vote. Please try again."),
				loading: false,
			}));
		}
	};

	const handleFavourite = async (catId: string) => {
		try {
			setCats((prev) => ({ ...prev, loading: true }));
			const cat = cats.data?.find((c) => c.id === catId);
			if (cat?.isFavourite) {
				await axios.delete(`${CAT_BASE_URL}/v1/favourites/${cat.favouriteId}`, {
					headers: {
						"x-api-key": CAT_API_KEY,
					},
				});
				setCats((prev) => ({
					...prev,
					data: prev.data?.map((c) =>
						c.id === catId
							? { ...c, isFavourite: false, favouriteId: undefined }
							: c,
					),
					loading: false
				}));
			} else {
				const response = await axios.post(
					`${CAT_BASE_URL}/v1/favourites`,
					{ image_id: catId },
					{
						headers: {
							"x-api-key": CAT_API_KEY,
						},
					},
				);
				setCats((prevCats) => ({
					...prevCats,
					data: prevCats.data?.map((c) =>
						c.id === catId
							? { ...c, isFavourite: true, favouriteId: response.data.id }
							: c,
					),
					loading: false
				}));
			}
		} catch (err) {
			setCats((prev) => ({
				...prev,
				error: new Error(
					"Failed to update favourite status. Please try again.",
				),
				loading: false,
			}));
		}
	};

	const handleReset = () => {
		setCats((prev) => ({ ...prev, error: null }));
	};

	return {
		...cats,
		handleFavourite,
		fetchCats,
		handleVote,
		handleReset,
	};
};

const useUploadImage = () => {
	const [cats, setCats] = useState<{
		data: Cat | null | undefined;
		error: Error | null;
		loading: boolean;
	}>({
		data: null,
		error: null,
		loading: false,
	});

	const handleUpload = async (fileUri: string) => {
		setCats((prev) => ({ ...prev, loading: true }));

		const formData = new FormData();
		formData.append("file", {
			uri: fileUri,
			name: fileUri.split("/").pop() || "cat.jpg",
			type: "image/jpeg",
			sub_id: "abel-90988",
		} as any);

		try {
			const response = await axios.post(
				`${CAT_BASE_URL}/v1/images/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data; boundary=---",
						"x-api-key": CAT_API_KEY,
					},
				},
			);

			if (response.status === 201) {
				setCats((prev) => ({
					...prev,
					data: response.data,
					loading: false,
				}));
			}
		} catch (err) {
			setCats((prev) => ({
				...prev,
				error: new Error("Failed to upload image."),
				loading: false,
			}));
		}

	};

	const handleReset = () => {
		setCats((prev) => ({ ...prev, error: null }));
	};

	return {
		...cats,
		handleUpload,
		handleReset
	}
};

export { useCatImages, useUploadImage };
