import React, { useState, useEffect } from 'react';  

interface Param {  
  id: number;  
  name: string;  
  type: 'string'; // Поддерживаем только текстовые параметры  
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

  const [newParamName, setNewParamName] = useState('');  
  const [editingParamId, setEditingParamId] = useState<number | null>(null);  
  const [tempParamName, setTempParamName] = useState<string>('');  

  useEffect(() => {  
    // Загружаем данные из localStorage  
    const storedParams = localStorage.getItem('params');  
    const storedParamValues = localStorage.getItem('paramValues');  

    if (storedParams) {  
      setParams(JSON.parse(storedParams));  
    }  

    if (storedParamValues) {  
      setParamValues(JSON.parse(storedParamValues));  
    } else {  
      const initialValues = model.paramValues.reduce((acc, paramValue) => {  
        acc[paramValue.paramId] = paramValue.value;  
        return acc;  
      }, {} as { [key: number]: string });  
      setParamValues(initialValues);  
    }  
  }, []);  

  useEffect(() => {  
    // Сохраняем данные в localStorage  
    localStorage.setItem('params', JSON.stringify(params));  
    localStorage.setItem('paramValues', JSON.stringify(paramValues));  
  }, [params, paramValues]);  

  const handleChange = (paramId: number, value: string) => {  
    setParamValues(prevValues => ({  
      ...prevValues,  
      [paramId]: value,  
    }));  
  };  

  const handleAddParam = () => {  
    const newId = params.length > 0 ? Math.max(...params.map(param => param.id)) + 1 : 1;  
    const newParam: Param = {  
      id: newId,  
      name: newParamName || `Недавний параметр ${newId}`,  
      type: 'string',  
    };  

    setParams(prevParams => [...prevParams, newParam]);  
    setParamValues(prevValues => ({  
      ...prevValues,  
      [newId]: '',  
    }));  
    setNewParamName('');  
  };  

  const onHandleClickEdit = (paramId: number) => {  
    setEditingParamId(paramId);  
    // Устанавливаем имя для редактирования текущего параметра  
    setTempParamName(params.find(param => param.id === paramId)?.name || '');  
  };  

  const onHandleClickSave = (paramId: number) => {  
    const updatedParams = params.map(param =>  
      param.id === paramId ? { ...param, name: tempParamName } : param  
    );  

    setParams(updatedParams);  
    setEditingParamId(null);  
    setTempParamName(''); // Сбрасываем значение для нового редактирования  
  };  

  return (  
    <div className='main'>  
      {params.map((param) => (  
        <div key={param.id} className='input-wrapper'>  
          {editingParamId === param.id ? (  
            <>  
              <input  
                type="text"  
                value={tempParamName} // Отображаем текущее имя параметра для редактирования  
                onChange={(e) => setTempParamName(e.target.value)}  
              />  
              <div onClick={() => onHandleClickSave(param.id)} className='save-button'>🖬</div>  
            </>  
          ) : (  
            <label onDoubleClick={() => onHandleClickEdit(param.id)}>{param.name}</label>  
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
};  

const App: React.FC = () => {  
  return <ParamEditor initialParams={initialParams} model={model} />;  
};  

export default App;