import React, { useState } from 'react';  

interface Param {  
  id: number;  
  name: string;  
  type: 'string'; // Мы поддерживаем только текстовые параметры, но можно легко расширить  
}  

interface ParamValue {  
  paramId: number;  
  value: string;  
}  

interface Model {  
  paramValues: ParamValue[];  
  colors?: string[];  
}  

interface Props {  
  initialParams: Param[];  
  model: Model;  
}  

const ParamEditor: React.FC<Props> = ({ initialParams, model }) => {  
  const [params, setParams] = useState<Param[]>(initialParams);  
  const [paramValues, setParamValues] = useState<{ [key: number]: string }>({  
    ...model.paramValues.reduce((obj, paramValue) => {  
      obj[paramValue.paramId] = paramValue.value;  
      return obj;  
    }, {} as { [key: number]: string })  
  });  

  // Состояние для нового параметра  
  const [newParamName, setNewParamName] = useState('');  
  
  // Состояние для редактируемого параметра  
  const [editingParamId, setEditingParamId] = useState<number | null>(null);  

  const [tempParamName, setTempParamName] = useState<string>('');

  // Метод для получения полной структуры модели  
  const getModel = (): Model => {  
    const paramValuesArray: ParamValue[] = Object.entries(paramValues).map(([key, value]) => ({  
      paramId: Number(key),  
      value: value,  
    }));  

    return {  
      paramValues: paramValuesArray,  
      colors: [],  
    };  
  };  

  // Обработчик изменения значения  
  const handleChange = (paramId: number, value: string) => {  
    setParamValues(prevValues => ({  
      ...prevValues,  
      [paramId]: value,  
    }));  
  };  

  // Обработчик добавления нового параметра  
  const handleAddParam = () => {  
    const newId = params.length > 0 ? params[params.length - 1].id + 1 : 1; // Уникальный идентификатор для нового параметра  
    const newParam: Param = {  
      id: newId,  
      name: newParamName || `Недавний параметр ${newId}`, 
      type: 'string',  
    };  

    setParams(prevParams => [...prevParams, newParam]);  
    setParamValues(prevValues => ({  
      ...prevValues,  
      [newId]: '', // Дефолтное значение для нового параметра  
    }));  
    setNewParamName(''); // Очищаем поле ввода для названия нового параметра  
  };  

   
  const onHandleClickEdit = (paramId: number) => {  
    setEditingParamId(paramId);  
  };  

  const onHandleClickSave = (paramId: number) => {
  
    const index = params.findIndex((param) => param.id === paramId);

    if (index !== -1) {
      // Создаем новый массив параметров, заменяя старый параметр новым
      const updatedParams = [
        ...params.slice(0, index),
        { ...params[index], name: tempParamName },
        ...params.slice(index + 1),
      ];

      // Обновляем состояние params
      setParams(updatedParams);
    }

    // Завершаем режим редактирования
    setEditingParamId(null);
  };

 

  return (  
    <div className='main'>  
      {params.map((param) => (  
        <div key={param.id} className='input-wrapper'>  
          {editingParamId === param.id ? (  
            <>
            <input  
              type="text"  
              value={tempParamName}  
              onChange={(e) => setTempParamName(e.target.value)} 
            />  
            <div onClick={() => onHandleClickSave(param.id)} className='save-button'>🖬</div>
            </>
          ) : (  
            <label onDoubleClick={() => {
              setEditingParamId(param.id);
              setTempParamName(param.name);
            }}>{param.name}</label> 
          )}  
          
          <div onClick={() => onHandleClickEdit(param.id)} className='edit-button'>🖉</div>  
          <input  
            type="text"  
            value={paramValues[param.id] || ''}  
            onChange={(e) => handleChange(param.id, e.target.value)}  
          />  
        </div>  
      ))}  

      <div className='input-wrapper'>  
        <input  
          type="text"  
          value={newParamName}  
          onChange={(e) => setNewParamName(e.target.value)}  
          placeholder="Введите название нового параметра"  
        />  
        <button onClick={handleAddParam}>+</button>  
      </div>  
    </div>  
  );  
};  

const initialParams: Param[] = [  
  { id: 1, name: 'Назначение', type: 'string' },  
  { id: 2, name: 'Длина', type: 'string' },  
];  

const model: Model = {  
  paramValues: [  
    { paramId: 1, value: 'повседневное' },  
    { paramId: 2, value: 'макси' },  
  ],  
  colors: [],  
};  

const App: React.FC = () => {  
  return <ParamEditor initialParams={initialParams} model={model} />;  
};  

export default App;