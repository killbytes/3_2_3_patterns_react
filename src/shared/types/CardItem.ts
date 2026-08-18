export type CardItem = {
    flight_number: number;
    mission_name: string;
    rocket?: {
        rocket_name: string;
    };
    links?: {
        mission_patch_small?: string | null;
        mission_patch?: string | null;
    };
    details?: string | null;
};

export type LaunchesResponse = {
    launches: CardItem[];
};