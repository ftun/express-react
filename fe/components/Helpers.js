import React from 'react';

/**
* Obtienen los valores de los inputs de un formulario y se almacenan en el states
* @param object DOM
* @return mixed
*/
export const getFormValuesOnChange = (e, dataValues = {}) => {
    let target = e.target,
        value = target.type === 'checkbox' ? target.checked : target.value,
        name = target.name,
        tempValues = dataValues
    ;

    tempValues[name] = value;
    return tempValues;
};

/**
* Validar valores de inputs en vista
* @param object DOM
* @return boolean
*/
export const getInputCSSOnBlur = e => {
    let target = e.target,
        value = target.value
    ;
    if (value.trim() === '') {
        target.classList.add('is-danger');
        target.classList.remove('is-success');
        return false;
    } else {
        target.classList.add('is-success');
        target.classList.remove('is-danger');
        return true;
    }
};
