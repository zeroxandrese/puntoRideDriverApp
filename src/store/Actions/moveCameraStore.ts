import { create } from "zustand";

import { Location } from '../../interface/interface';

interface LocationState {
    moveKnowLocation: Location | null;

    setLocationMoveCamera: (coords: PropsMoveCamera) => Promise<Location | null>;
}

interface PropsMoveCamera {
    latitude: number;
    longitude: number;
}

export const moveCameraStore = create<LocationState>()((set) => ({
    moveKnowLocation: null,

    setLocationMoveCamera: async ({ latitude, longitude }: PropsMoveCamera) => {
        const newLocation = { latitude, longitude };
        
        set({
            moveKnowLocation: newLocation,
        });

        return newLocation;
    },
}));