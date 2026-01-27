import {useMemo} from "react";
import {OKL_LINKS, OKLLink} from "../data/data";

export const getOKLLink = (oklType: string | undefined): OKLLink => {
    if (!oklType) {
        return {
            oklType: "default",
            link: "https://spetskabel.ru/products/lines/",
            description: "Огнестойкие кабельные линии СПЕЦКАБЛАЙН"
        };
    }

    const exactMatch = OKL_LINKS.find(link => link.oklType === oklType);
    if (exactMatch) return exactMatch;

    // Ищем частичное совпадение (например, для okl_gl -> gl)
    const cleanType = oklType.replace('okl_', '').replace('_', '');
    const partialMatch = OKL_LINKS.find(link =>
        cleanType.includes(link.oklType) || link.oklType.includes(cleanType)
    );

    return partialMatch || OKL_LINKS[0]; // Возвращаем первую ссылку если не нашли
};
export const useOKLLink = (oklType: string | undefined): OKLLink => {
    return useMemo(() => getOKLLink(oklType), [oklType]);
};

