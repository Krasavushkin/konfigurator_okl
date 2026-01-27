import {Cable} from "../data/data";


export function normalizeCable(raw: any): Cable {


    if (raw.coreSection != null) {
        return {
            id: raw.id,
            name: raw.name,
            cableTypeId: raw.cableTypeId,
            cores: raw.cores,
            coreSection: raw.coreSection,
            outerDiameter: raw.outerDiameter,
            TU: raw.TU,
        };
    }

    if (raw.coreDiameter != null) {
        return {
            id: raw.id,
            name: raw.name,
            cableTypeId: raw.cableTypeId,
            cores: raw.cores,
            coreDiameter: raw.coreDiameter,
            outerDiameter: raw.outerDiameter,
            TU: raw.TU,
        };
    }

    throw new Error(`Invalid cable data: ${raw.id}`);
}

/* чтобы найти кабель с битыми данными if (raw.outerDiameter == null) {
            console.warn('❗ Cable without outerDiameter:', {
                id: raw.id,
                name: raw.name,
                cableTypeId: raw.cableTypeId,
                raw,
            });
        }

        return {
            id: raw.id,
            name: raw.name,
            cableTypeId: raw.cableTypeId,
            cores: raw.cores,
            TU: raw.TU,
            outerDiameter: raw.outerDiameter ?? undefined,
            coreSection: raw.coreSection ?? undefined,
            coreDiameter: raw.coreDiameter ?? undefined,
        };*/