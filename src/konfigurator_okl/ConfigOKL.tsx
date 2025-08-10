import React from 'react';
import {Button} from './Button';
import styles from './styles/OKL.module.css';

type Cable = {
    id: string;
    name: string;
    length: number;
};

type OKLItem = {
    id: string;
    name: string;
    length: number;
    cables: Cable[];
};

type ConfigurationSummaryProps = {
    oklList: OKLItem[];
    fittingsName: string;
    suspensionName: string;
    surfaceName: string;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onSave: () => void;
};

export const ConfigOKL: React.FC<ConfigurationSummaryProps> = ({
                                                                   oklList,
                                                                   fittingsName,
                                                                   suspensionName,
                                                                   surfaceName,
                                                                   onRemoveCable,
                                                                   onSave
                                                               }) => {
    return (
        <div className={styles.result}>
            <div className={styles.oklBlock}>
                <h3>Наименование ОКЛ:</h3>
                <ol className={styles.cableList}>
                    {oklList.map(okl => (
                        <li key={okl.id} className={styles.oklItem}>
                            <span>СПЕЦКАБЛАЙН-{okl.name}-{okl.length} м </span>
                            ({okl.cables.map((cable, index) => (
                            <span key={cable.id} className={styles.cableItem}>
                             {index > 0 && " + "}
                                {cable.name} - {cable.length}м
                            </span>
                        ))})
                        </li>
                    ))}
                </ol>
            </div>
            <div className={styles.oklInfo}>
                <h3>Комплектующие ОКЛ:</h3>
                {oklList.map(okl => (
                <ol className={styles.cableList}>
                    {okl.cables.map(cable => (
                        <li key={cable.id} className={styles.cableItem}>
                            {cable.name} ({cable.length} м)
                            <button
                                className={styles.removeBtn}
                                onClick={() => onRemoveCable(okl.id, cable.id)}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ol>
            ))}
                <ul className={styles.info}>
                  {/*  <li><strong>Подвес:</strong> {suspensionName}</li>
                    <li><strong>Поверхность:</strong> {surfaceName}</li>
                    <li><strong>Крепление:</strong> {fittingsName}</li>*/}
                </ul>
            </div>


            {/* пока нет комплектующих, но блок можно легко добавить */}
            {/*   {okl.cables.length > 0 && (
                <ol className={styles.cableList}>
                    {okl.cables.map(cable => (
                        <li key={cable.id} className={styles.cableItem}>
                            {cable.name} ({cable.length} м)
                            <button
                                className={styles.removeBtn}
                                onClick={() => onRemoveCable(okl.id, cable.id)}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ol>
            )}*/}
            {/* <div className={styles.partsBlock}>
        <h4>Комплектующие:</h4>
        <ul>
          <li>...</li>
        </ul>
      </div> */}

            <Button title="Сохранить конфигурацию" onClick={onSave}/>
        </div>
    );
};
