import {Suspension} from "../konfigurator_okl/data";

export const SUSPENSIONS: Suspension[] = [
    {id: `suspension:gladkaya_plastikovaya_truba`,
        name: "Гладкая пластиковая труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:armatura"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba"],
            "surface:gkl": ["fitting:skoba"],
            "surface:sendvic_panel": ["fitting:skoba"],
            "surface:armatura": ["fitting:provoloka", "fitting:homut"]}},
    {id: `suspension:gofrirovanaya_plastikovaya_truba`,
        name: "Гофрированная пластиковая труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
            "surface:armatura"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba"],
            "surface:gkl": ["fitting:skoba"],
            "surface:sendvic_panel": ["fitting:skoba"],
            "surface:armatura": ["fitting:provoloka", "fitting:homut"]}},
    /* {id: `suspension:metallicheskiy_kabel_kanal`,
         name: "Металлический кабель-канал",
         compatibleSurfaces: [
             "surface:beton",
         ],
         defaultFittings: {
             "surface:beton": ["fitting:dubel_homut"],
            }
            },
     {id: `suspension:metallorukav`, name: "Металлорукав",
         compatibleSurfaces: [
             "surface:beton",
             "surface:gipsokarton",
             "surface:sandwichpanel",
         ],
         defaultFittings: {
             "surface:beton": ["fitting:skoba"],
             "surface:gipsokarton": ["fitting:skoba"],
             "surface:sandwichpanel": ["fitting:skoba"],
           }
           },
     {id: `suspension:metallorukav_v_obolochke`,
         name: "Металлорукав в оболочке",
         compatibleSurfaces: [
             "surface:beton",
         ],
         defaultFittings: {
             "surface:beton": ["fitting:skoba"],
         }},*/
    {id: `suspension:kabel_kanal`,
        name: "Пластиковый кабель-канал",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:dubel_homut", "fitting:kruchok"],
            "surface:gkl": ["fitting:dubel_homut"],
            "surface:sendvic_panel": ["fitting:skoba"],
        }
    },
    /*{id: `suspension:setka_manye_na_kryuchkah`,
        name: "Сетка Манье на крючках",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:kruchok"],
        }
        },
    {id: `suspension:tros_s_setkoy_manye`,
        name: "Трос с сеткой Манье",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:kruchok"],
        }
        },
    {id: `suspension:metallicheskiy_chulok`,
        name: "Металлический чулок",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:kruchok"],
        }},
    {id: `suspension:stalnaya_truba`,
        name: "Стальная труба",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:dubel_homut"],
        }
        },
    {id: `suspension:lotok_metallicheskiy`,
        name: "Лоток металлический",
        compatibleSurfaces: [
            "surface:beton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:dubel_homut"],
        }},*/
    {id: `suspension:otkrytaya_prokladka`,
        name: "Открытая прокладка",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gkl",
            "surface:sendvic_panel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_homut"],
            "surface:gkl": ["fitting:dubel_homut"],
            "surface:sendvic_panel": ["fitting:dubel_homut"],
        }}
]