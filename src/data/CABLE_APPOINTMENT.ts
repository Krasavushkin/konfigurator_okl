import {BaseEntity} from "./data";

export const CABLE_APPOINTMENT: BaseEntity[] = [
    {id: "cable_type:all", name: "Все кабели"},
    {id: "cable_type:signal", name: "Для систем пожарной сигнализации"},
    {id: "cable_type:rs485", name: "Для промышленной автоматизации однопроволочные (RS-485, Profibus и т.д.)"},
    {id: "cable_type:rs485g", name: "Для промышленной автоматизации многопроволочные (RS-485, Profibus и т.д.)"},
    {id: "cable_type:rs485ltx", name: "Для промышленной автоматизации (RS-485, Profibus и т.д.) с низкой токсичностью продуктов горения"},
    {id: "cable_type:power450_750", name: "Силовые на номинальное переменное напряжение до 450/750 В"},
    {id: "cable_type:lan", name: "Для структурированных кабельных сетей"},
    {id: "cable_type:ltx", name: "С низкой токсичностью продуктов горения для систем сигнализации, управления и связи"},
    {id: "cable_type:power450_750_ltx", name: "Силовые на номинальное переменное напряжение до 450/750 В с низкой токсичностью продуктов горения"},
    {id: "cable_type:scab", name: "Универсальные СКАБ для контрольно-измерительных приборов и аппаратуры"},
    {id: "cable_type:scab_m", name: "Универсальные СКАБ-М до 1 кВ"},
    {id: "cable_type:scab_s", name: "Универсальные СКАБ-С до 660 В"},
    {id: "cable_type:kers", name: "Для систем электроники"},
    {id: "cable_type:kshs", name: "Симметричные для шлейфов сигнализации"},
    {id: "cable_type:scap", name: "Монтажные до 500 В"},
    {id: "cable_type:optic", name: "Оптические"},
]