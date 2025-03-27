import { create } from "zustand";

import { tripCalculate, postTripCalculateData } from '../../interface/interface';
import apiConfig from "../../apiConfig/apiConfig";

interface BusinessState {
    tripÇalculate: tripCalculate | null;
    errorMessage: string;
    postTripCalculate: (postTripCalculateData: postTripCalculateData) => Promise<void>;
}

export const useServiceBusinessStore = create<BusinessState>()((set) => ({
    tripÇalculate: null,
    errorMessage: "",

    postTripCalculate: async ({ latitudeStart,
        longitudeStart, latitudeEnd, longitudeEnd,
        paymentMethod, discountCode }) => {

        try {
            const { data } = await apiConfig.post(`/tripCalculate/`, {
                latitudeStart,
                longitudeStart, latitudeEnd, longitudeEnd,
                paymentMethod, discountCode
            });

            console.log(data)

            set({
                tripÇalculate: data.responseTrip
            });

        } catch (error: any) {
            set({ errorMessage: error.response?.data?.msg || "Error al comentar" });
        }
    }
}));