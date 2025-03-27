import React, { useState } from 'react'

export const useForm =<T extends Object>( Formulario: T) => {
   
    const [state, setSate] = useState(Formulario)

    const cambioFormulario = (value: string, Field: keyof T) => {
        setSate({
            ...state,
            [Field]: value
        });
    }
    return{
        ...state,
        Formulario: state,
        cambioFormulario
    }
}