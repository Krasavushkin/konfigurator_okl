import {nanoid} from "nanoid";
import {NewCable} from "./infoOKL/OKLCard";

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

// types/config.ts

export interface newOKLItem {
    id: string;
    name: string;
    length: number;
    cables: NewCable[];
    sectionOKL?: number;
    type: string;
    TU: string;
    description: string;
}


export const FITTINGS: Fitting[] = [
    {id: "fitting:skoba", name: "Скоба"},
    {id: "fitting:homut", name: "Хомут"},
    {id: "fitting:dubel_homut", name: "Дюбель-хомут"},
    {id: "fitting:provoloka", name: "Проволока"},
    {id: "fitting:kruchok", name: "Крючок"}
];

export const CABLE_APPOINTMENT: BaseEntity[] = [
    {id: "cable_type:signal", name: "Для систем пожарной сигнализации"},
    {id: "cable_type:rs485", name: "Для промышленной автоматизации (RS-485, Profibus и т.д.)"},
    {
        id: "cable_type:rs485ltx",
        name: "Для промышленной автоматизации (RS-485, Profibus и т.д.) с низкой токсичностью продуктов горения"
    },
    {id: "cable_type:power450_750", name: "Силовые на номинальное переменное напряжение до 450/750 В)"},
    {id: "cable_type:lan", name: "Для структурированных кабельных сетей"},
    {id: "cable_type:ltx", name: "С низкой токсичностью продуктов горения"},
    {
        id: "cable_type:power450_750_ltx",
        name: "Силовые на номинальное переменное напряжение до 450/750 В с низкой токсичностью продуктов горения"
    },
    {id: "cable_type:scab", name: "Универсальные СКАБ для контрольно-измерительных приборов и аппаратуры"},
    {id: "cable_type:scap", name: "Монтажные до 500 В"},
    {id: "cable_type:scab_m", name: "Универсальные до 1 кВ"},
    {id: "cable_type:scab_s", name: "Универсальные до 660 В"},
    {id: "cable_type:optic", name: "Оптические"},
]

export const TIME_OF_WORK = [11, 20, 21, 23, 24, 25, 26, 27, 29, 41, 50, 57, 58, 65, 68, 69, 72, 89, 93, 95, 120]
export interface OKLLink {
    oklType: string;
    link: string;
    description: string;
}

export const OKL_LINKS: OKLLink[] = [
    {
        oklType: "gl",
        link: "https://spetskabel.ru/products/lines/gf-gl/",
        description: "ОКЛ «СПЕЦКАБЛАЙН-ГЛ» - В комплект поставки входят: огнестойкие кабели производства ООО НПП «Спецкабель»;  " +
            "кабеленесущие элементы (трубы гладкие из поливинилхлорида для электромонтажных работ);" +
            "крепежные элементы (скобы металлические, саморезы с прессшайбой, дюбели металлические универсальные, кол-во в соответствии с ТУ (3 комплекта на 1м)." +
            "При реализации огнестойкая кабельная линия сопровождается документами: паспорт, сертификат."
    },
    {
        oklType: "gf",
        link: "https://spetskabel.ru/products/lines/gf-gl/",
        description: "ОКЛ «СПЕЦКАБЛАЙН-ГФГК» -  В комплект поставки входят: огнестойкие кабели производства ООО НПП «Спецкабель»;  " +
            "несущие элементы (трубы с зондом гибкие гофрированные из поливинилхлорида для электромонтажных работ); " +
            "крепежные элементы (скобы металлические однолапковые, дюбели для листовых материалов Driva, " +
            "саморезы с прессшайбой, кол-во в соответствии с ТУ (3 комплекта на 1м). " +
            "При реализации огнестойкая кабельная линия сопровождается документами: паспорт, сертификат."
    },
    {
        oklType: "hd",
        link: "https://spetskabel.ru/products/lines/xd/",
        description: "ОКЛ «СПЕЦКАБЛАЙН-ХД» - В комплект поставки входят: огнестойкие кабели производства ООО НПП «Спецкабель»;  " +
            "кабеленесущие элементы (кабель-канал из самозатухающего ПВХ пластиката (25х17мм, 25х30, 40х17, 40х40, 60х40, 100х40 и др.); " +
            "крепежные элементы (лента стальная перфорированная в изоляции из стеклоткани, " +
            "дюбель стальной универсальный, саморез с прессшайбой (3 комплекта на 1 м)." +
            "  При реализации огнестойкая кабельная линия сопровождается документами: паспорт, сертификат."
    },
    {
        oklType: "h",
        link: "https://spetskabel.ru/products/lines/x/",
        description: "ОКЛ «СПЕЦКАБЛАЙН-Х» - В комплект поставки входят: огнестойкие кабели производства ООО НПП «Спецкабель»; " +
            "крепежные элементы (лента стальная перфорированная в изоляции из стеклоткани, дюбель стальной универсальный, саморез с прессшайбой (3 комплекта на 1 м).  " +
            "При реализации огнестойкая кабельная линия сопровождается документами: паспорт, сертификат."
    },

]

