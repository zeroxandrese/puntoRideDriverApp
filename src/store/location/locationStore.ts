import { create } from "zustand";
import { Location } from '../../interface/interface';
import { getCurrentLocation } from "../../actions/Location";

interface LocationState {
    lastKnowLocation: Location | null;

    getLocation: () => Promise<Location | null>;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
    lastKnowLocation: null,

    getLocation: async () => {
        const Location = await getCurrentLocation();
        set({ lastKnowLocation: Location });
        
        return Location
    }
})
);