import {BaseEntity} from "../konfigurator_okl/data";

export const CABLE_APPOINTMENT: BaseEntity[] = [
    {id:"cable_type:signal", name:"Для систем пожарной сигнализации"},
    {id:"cable_type:rs485", name:"Для промышленной автоматизации (RS-485, Profibus и т.д.)"},
    {id:"cable_type:rs485ltx", name:"Для промышленной автоматизации (RS-485, Profibus и т.д.) с низкой токсичностью продуктов горения"},
    {id:"cable_type:power450_750", name:"Силовые на номинальное переменное напряжение до 450/750 В)"},
    {id:"cable_type:lan", name:"Для структурированных кабельных сетей"},
    {id:"cable_type:ltx", name:"С низкой токсичностью продуктов горения"},
    {id:"cable_type:power450_750_ltx", name:"Силовые на номинальное переменное напряжение до 450/750 В с низкой токсичностью продуктов горения"},
    {id:"cable_type:scab", name:"Универсальные СКАБ для контрольно-измерительных приборов и аппаратуры"},
    {id:"cable_type:scap", name:"Монтажные до 500 В"},
    {id:"cable_type:scab_m", name:"Универсальные до 1 кВ"},
    {id:"cable_type:scab_s", name:"Универсальные до 660 В"},
    {id:"cable_type:optic", name:"Оптические"},
]