import {Cable} from "../data/data";
import {cableLoaders} from "../data";
import {normalizeCable} from "./normalizeCable";


const cache: Record<string, Cable[]> = {};

export const loadCablesByType = async (typeId: string): Promise<Cable[]> => {
    if (cache[typeId]) {
        return cache[typeId];
    }

    const loader = cableLoaders[typeId];
    if (!loader) return [];

    const raw = await loader();
    const normalized = raw.map(normalizeCable);

    cache[typeId] = normalized;
    return normalized;
};
