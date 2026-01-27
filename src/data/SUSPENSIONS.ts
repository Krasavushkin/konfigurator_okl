import {Suspension} from "./data";

export const SUSPENSIONS: Suspension[] = [
    {
        id: `suspension:gladkaya_plastikovaya_truba`,
        name: "Гладкая пластиковая труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:skoba", "fitting:samorez_press", "fitting:dubel_driva"],
            "surface:sendvic_panel": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:provoloka", "fitting:homut"]
        }
    },
    {
        id: `suspension:gofrirovanaya_plastikovaya_truba`,
        name: "Гофрированная пластиковая труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:skoba", "fitting:samorez_press", "fitting:dubel_driva"],
            "surface:sendvic_panel": ["fitting:skoba", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"]
        }
    },
    {
        id: `suspension:gofrirovanaya_plastikovaya_truba_hf`,
        name: "Гофрированная безгалогенная пластикова труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:sendvic_panel",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:sendvic_panel": ["fitting:skoba", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"],

        }
    },
    {
        id: `suspension:kabel_kanal`,
        name: "Пластиковый кабель-канал",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:lenta_perforirovanay", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:dubel_homut"],
            "surface:sendvic_panel": ["fitting:skoba"],
        }
    },

    {
        id: `suspension:opletka`,
        name: "Оплётка из стальной оцинкованной проволоки",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:vint_kruchok", "fitting:anker", "fitting:gaika"],
        }
    },
    {
        id: `suspension:setka_manye`,
        name: "Сетка Манье",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:vint_kruchok", "fitting:anker", "fitting:gaika"],
        }
    },
    {
        id: `suspension:metallorukav`,
        name: "Металлорукав",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:skoba", "fitting:samorez_press", "fitting:dubel_driva"],
            "surface:sendvic_panel": ["fitting:skoba",  "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"]
        }
    },
    {
        id: `suspension:metallorukav_v_PVH`,
        name: "Металлорукав в ПВХ-оболочке",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:skoba", "fitting:samorez_press", "fitting:dubel_driva"],
            "surface:sendvic_panel": ["fitting:skoba",  "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"]
        }
    },
    {
        id: `suspension:kabel_kanal_k1d`,
        name: "Оплетка в пластиковом кабель-канале",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:dubel_homut"],
        }
    },
    {
        id: `suspension:kabel_kanal_k2d`,
        name: "Сетка Манье в пластиковом кабель-канале",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:lenta_perforirovanay", "fitting:dubel_universal", "fitting:samorez_press"],
        }
    },
    {
        id: `suspension:otkrytaya_prokladka_h`,
        name: "Открытая прокладка - Х",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:lenta_perforirovanay", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:lenta_perforirovanay", "fitting:dubel_driva", "fitting:samorez_press"],
            "surface:sendvic_panel": ["fitting:lenta_perforirovanay", "fitting:samorez_press"],
        }
    },
    {
        id: `suspension:otkrytaya_prokladka_s`,
        name: "Открытая прокладка - С",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:gkl": ["fitting:skoba", "fitting:dubel_driva", "fitting:samorez_press"],
            "surface:sendvic_panel": ["fitting:skoba", "fitting:samorez_press"],
        }
    },
    {id: `suspension:setka_manye_na_trose`,
        name: "Сетка Манье на тросе",
        compatibleSurfaces: [
            "surface:tros",
        ],
        defaultFittings: {
            "surface:tros": ["fitting:homut"],
        }
    },
    {id: `suspension:gofrirovanaya_plastikovaya_truba_na_trose`,
        name: "Гофрированная пластиковая труба на тросе",
        compatibleSurfaces: [
            "surface:tros",
        ],
        defaultFittings: {
            "surface:tros": ["fitting:homut"],
        }
    },
    {id: `suspension:gofrirovanaya_plastikovaya_truba_na_trose_hf`,
        name: "Гофрированная безгалогенная пластиковая труба на тросе",
        compatibleSurfaces: [
            "surface:tros",
        ],
        defaultFittings: {
            "surface:tros": ["fitting:homut"],
        }
    },
    {id: `suspension:metallorukav_na_trose`,
        name: "Металлорукав на тросе",
        compatibleSurfaces: [
            "surface:tros",
        ],
        defaultFittings: {
            "surface:tros": ["fitting:homut"],
        }
    },
    {id: `suspension:metallorukav_v_PVH_na_trose`,
        name: "Металлорукав в ПВХ-оболочке на тросе",
        compatibleSurfaces: [
            "surface:tros",
        ],
        defaultFittings: {
            "surface:tros": ["fitting:homut"],
        }
    },

    {
        id: `suspension:metallorukav_gefest`,
        name: "Металлорукав Гефест",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
        }
    },
    {
        id: `suspension:metallicheskiy_kabel_kanal`,
        name: "Металлический оцинкованный кабель-канал Гефест",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:lenta_perforirovanay", "fitting:dubel_universal", "fitting:samorez_press"],
        }
    },
    {
        id: `suspension:metallorukav_gefest_v_PVH`,
        name: "Металлорукав Гефест в ПВХ-оболочке",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"],
        }
    },

    {
        id: `suspension:gladkaya_plastikovaya_truba_neptun`,
        name: "Гладкая пластиковая труба ООО «Кросс Линк», ООО «Нептун» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:provoloka", "fitting:styagka_sks"]
        }
    },
    {
        id: `suspension:gladkaya_plastikovaya_truba_neptun_hf`,
        name: "Гладкая безгалогенная пластиковая труба ООО «Кросс Линк», ООО «Нептун» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:styagka_sks"]
        }
    },

    {
        id: `suspension:gofrirovanaya_plastikovaya_truba_neptun`,
        name: "Гофрированная пластиковая труба " +
            " ООО «Кросс Линк», ООО «Нептун» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:provoloka", "fitting:styagka_sks"]
        }
    },
    {
        id: `suspension:gofrirovanaya_plastikovaya_truba_neptun_hf`,
        name: "Гофрированная безгалогенная пластиковая труба ООО «Кросс Линк», ООО «Нептун» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:provoloka", "fitting:styagka_sks"]
        }
    },

    {id: `suspension:metallorukav_neptun`,
        name: "Металлорукав ООО «Кросс Линк», ООО «Нептун», ООО «ТД Урал ПАК» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:homut", "fitting:provoloka"],
        }
    },
    {id: `suspension:metallorukav_neptun_v_PVH`,
        name: "Металлорукав в оболочке из ПВХ ООО «Кросс Линк», ООО «Нептун», ООО «ТД Урал ПАК» (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
            "surface:metallokonstrykcya",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],
            "surface:metallokonstrykcya": ["fitting:provoloka", "fitting:styagka_sks"],
        }
    },

    {
        id: `suspension:otkrytaya_prokladka_kit`,
        name: "Открытая прокладка (КиТ)",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_universal", "fitting:samorez_press"],

        }
    },

]