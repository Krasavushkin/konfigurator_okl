import {nanoid} from "nanoid";

export type BaseEntity = {
    id: string;
    name: string;
};

export type Suspension = BaseEntity & {
    compatibleSurfaces: Surface['id'][];
    defaultFittings: {
        [surfaceId: Surface['id']]: Fitting['id'][];
    };
};

export type Surface = BaseEntity;

export type Fitting = BaseEntity;

export type CableType = BaseEntity;

export type CableData = BaseEntity & {
    cableTypeId: CableType['id'];
};





export const SUSPENSIONS: Suspension[] = [
    {id: `suspension:gladkaya_plastikovaya_truba`,
        name: "Гладкая пластиковая труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gipsokarton",
            "surface:sandwichpanel",
            "surface:armatura"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba"],
            "surface:gipsokarton": ["fitting:skoba"],
            "surface:sandwichpanel": ["fitting:skoba"],
            "surface:armatura": ["fitting:provoloka", "fitting:homut"]}},
    {id: `suspension:goffrirovannaya_truba`,
        name: "Гофрированная труба",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gipsokarton",
            "surface:sandwichpanel",
            "surface:armatura"
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba"],
            "surface:gipsokarton": ["fitting:skoba"],
            "surface:sandwichpanel": ["fitting:skoba"],
            "surface:armatura": ["fitting:provoloka", "fitting:homut"]}},
    {id: `suspension:metallicheskiy_kabel_kanal`,
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
        }},
    {id: `suspension:plastikovyy_kabel_kanal`,
        name: "Пластиковый кабель-канал",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gipsokarton",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:dubel_homut", "fitting:kruchok"],
            "surface:gipsokarton": ["fitting:dubel_homut"],
        }
        },
    {id: `suspension:setka_manye_na_kryuchkah`,
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
        }},
    {id: `suspension:otkritaya_prokladka`,
        name: "Открытая прокладка",
        compatibleSurfaces: [
            "surface:beton",
            "surface:gipsokarton",
            "surface:sandwichpanel",
        ],
        defaultFittings: {
            "surface:beton": ["fitting:skoba", "fitting:dubel_homut"],
            "surface:gipsokarton": ["fitting:dubel_homut"],
            "surface:sandwichpanel": ["fitting:dubel_homut"],
        }}
]

export const SURFACES: Surface[] = [
    { id: "surface:beton", name: "Бетон" },
    { id: "surface:gipsokarton", name: "Гипсокартон" },
    { id: "surface:sandwichpanel", name: "Сэндвичпанель" },
    { id: "surface:armatura", name: "Арматура" }
];

export const FITTINGS: Fitting[] = [
    { id: "fitting:skoba", name: "Скоба" },
    { id: "fitting:homut", name: "Хомут" },
    { id: "fitting:dubel_homut", name: "Дюбель-хомут" },
    { id: "fitting:provoloka", name: "Проволока" },
    { id: "fitting:kruchok", name: "Крючок" }
];

export const OKL = [
    {id: nanoid(), name: "ГЛ16", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "ГЛ20", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "ГЛ25", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "ГЛ32", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "ГЛ40", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "ГЛ50", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ16", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ20", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ25", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ32", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ40", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
    {id: nanoid(), name: "КиТ-ГЛ50", compatibleSuspensions: ["suspension:gladkaya_plastikovaya_truba"], compatibleSurfaces: ["surface:beton"] },
]


export const CABLE_APPOINTMENT: BaseEntity[] = [
    {id:"cable_type:signal", name:"Для систем пожарной сигнализации"},
    {id:"cable_type:rs485", name:"Для промышленной автоматизации (RS-485, Profibus и т.д.)"},
    {id:"cable_type:rs485ltx", name:"Для промышленной автоматизации (RS-485, Profibus и т.д.) с низкой токсичностью продуктов горения"},
    {id:"cable_type:power450_750", name:"Силовые на номинальное переменное напряжение до 450/750 В)"},
    {id:"cable_type:lan", name:"Для структурированных кабельных сетей"},
    {id:"cable_type:ltx", name:"С низкой токсичностью продуктов горения"},
    {id:"cable_type:power450_750ltx", name:"Силовые на номинальное переменное напряжение до 450/750 В с низкой токсичностью продуктов горения"},
    {id:"cable_type:scab", name:"Универсальные СКАБ для контрольно-измерительных приборов и аппаратуры"},
    {id:"cable_type:scap", name:"Монтажные до 500 В"},
    {id:"cable_type:scab_m", name:"Универсальные до 1 кВ"},
    {id:"cable_type:scab_s", name:"Универсальные до 660 В"},
    {id:"cable_type:optic", name:"Оптические"},
]

export const CABLES: CableData[] = [
    {id: nanoid(), name: "КПСнг(А)-FRHF 2x2x0,5", cableTypeId: "cable_type:signal"},
    {id: nanoid(), name: "КПСнг(А)-FRHF 2x2x1,0", cableTypeId: "cable_type:signal"},
    {id: nanoid(), name: "КПСЭнг(А)-FRLS 2x2x0,5", cableTypeId: "cable_type:signal"},
    {id: nanoid(), name: "КПСЭнг(А)-FRLS 2x2x1,0", cableTypeId: "cable_type:signal"},
    {id: nanoid(), name: "КСБ нг(А)-FRHF 1x2x0,64", cableTypeId: "cable_type:rs485"},
    {id: nanoid(), name: "КСБ нг(А)-FRHF 1x2x1,78", cableTypeId: "cable_type:rs485"},
    {id: nanoid(), name: "КСБ Гнг(А)-FRHF 1x2x1,78", cableTypeId: "cable_type:rs485"},
    {id: nanoid(), name: "КСБ Гнг(А)-FRHF 1x2x1,78", cableTypeId: "cable_type:rs485"},
    {id: nanoid(), name: "КУНРС Унг(А)-FRHF 1x0,75", cableTypeId: "cable_type:power450_750"},
    {id: nanoid(), name: "КУНРС Унг(А)-FRHF 2x0,75", cableTypeId: "cable_type:power450_750"},
    {id: nanoid(), name: "КУНРС Пнг(А)-FRHF 1x1,0", cableTypeId: "cable_type:power450_750"},
    {id: nanoid(), name: "КУНРС Пнг(А)-FRHF 2x1,0", cableTypeId: "cable_type:power450_750"},
    {id: nanoid(), name: "СПЕЦЛАН FTP-5нг(D)-FRLS 1x2x0,52", cableTypeId: "cable_type:lan"},
    {id: nanoid(), name: "СПЕЦЛАН FTP-5нг(D)-FRLS 2x2x0,52", cableTypeId: "cable_type:lan"},
    {id: nanoid(), name: "СПЕЦЛАН F/FTP-6КГнг(A)-FRHF 4х2х0,57", cableTypeId: "cable_type:lan"},
    {id: nanoid(), name: "СПЕЦЛАН S/FTP-6Кнг(A)-FRHF 4х2х0,57", cableTypeId: "cable_type:lan"},
    {id: nanoid(), name: "СКАБ 250нг(А)-FRLS 2x1,0л", cableTypeId: "cable_type:scab"},
    {id: nanoid(), name: "СКАБ 250нг(А)-FRHF-ХЛ 4x1,0л", cableTypeId: "cable_type:scab"},
    {id: nanoid(), name: "СКАБ 250нг(А)-FRHF-ХЛ 2x0,5л о", cableTypeId: "cable_type:scab"},
    {id: nanoid(), name: "СКАБ 250нг(А)-FRHF-ХЛ 2x2,5л", cableTypeId: "cable_type:scab"},
    {id: nanoid(), name: "СКАПС 21нг(А)-FRHF-ХЛ 1x2x0,2", cableTypeId: "cable_type:scap"},
    {id: nanoid(), name: "СКАПС 21нг(А)-FRHF-ХЛ 5x2x0,5", cableTypeId: "cable_type:scap"},
    {id: nanoid(), name: "СКАПС 21Кнг(А)-FRHF-ХЛ 2x2x0,5", cableTypeId: "cable_type:scap"},
    {id: nanoid(), name: "СКАПС 21КГнг(А)-FRHF-ХЛ 2x2x0,5", cableTypeId: "cable_type:scap"},
    {id: nanoid(), name: "СКАБ-Мнг(А)-FRHF-ХЛ 5x2,5-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-МЭонг(А)-FRHF-ХЛ 1x2,5-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-Мнг(А)-FRHF-ХЛ 3x10-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-МЭонг(А)-FRHF-ХЛ 3x10-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-МЭонг(А)-FRHF-ХЛ 3x10-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-МЭонг(А)-FRHF-ХЛ 3x10-1", cableTypeId: "cable_type:scab_m"},
    {id: nanoid(), name: "СКАБ-C 660нг(A)-FRLS 1х0,5 м3", cableTypeId: "cable_type:scab_s"},
    {id: nanoid(), name: "СКАБ-C 660нг(A)-FRLS 2х1,0 м3", cableTypeId: "cable_type:scab_s"},
    {id: nanoid(), name: "СКАБ-C 660нг(A)-FRHF-ХЛ 2х0,5 м3", cableTypeId: "cable_type:scab_s"},
    {id: nanoid(), name: "СКАБ-C 660нг(A)-FRHF-ХЛ 2х1,0 м3", cableTypeId: "cable_type:scab_s"},

]