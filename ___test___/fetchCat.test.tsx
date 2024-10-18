import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import { useCatImages } from "../hooks/useCatImages";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("expo-constants", () => ({
    expoConfig: {
        extra: {
            apiKey: "mock-api-key",
            apiUrl: "mock-api-url"
        },
    },
}));

const mockCats = [
    {
        id: "1",
        url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
        height: 300,
        width: 300,
    },
    {
        id: "2",
        url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
        height: 300,
        width: 300,
    },
];

describe('useCatImages Hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with loading true, empty data, and no error', async () => {

        mockedAxios.get.mockResolvedValue({
            data: mockCats,
        });

        const { result, waitForNextUpdate } = renderHook(() =>
            useCatImages(),
        );


        await act(async () => {
            await waitForNextUpdate();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.data).not.toEqual([]);
        expect(result.current.error).toBeNull();

    });

    it("should fetch cat images successfully", async () => {

        mockedAxios.get.mockResolvedValueOnce({ data: mockCats });

        const { result, waitForNextUpdate } = renderHook(() =>
            useCatImages(),
        );

        await waitForNextUpdate();

        expect(axios.get).toHaveBeenCalledWith(
            `${"mock-api-url"}/v1/images/search`,
            {
                headers: {
                    "x-api-key": "mock-api-key",
                },
                params: {
                    limit: 10,
                    page: 1,
                },
            },
        );
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockCats);
        expect(result.current.error).toBe(null);
    });

    it("should handle error if fetching fails", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

        const { result, waitForNextUpdate } = renderHook(() =>
            useCatImages(),
        );

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toEqual(new Error("Failed to fetch cat images. Please try again."));
    });
})