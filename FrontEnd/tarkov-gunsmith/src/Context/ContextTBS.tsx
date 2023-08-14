import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';

/**
 * Dictates the structure of the context's data. Used by the StateStructure_Default 
 * and the ContextState Memo in ContextProvider.
 */
type TbsStateStructure = {
    exampleValue: string;
    setExampleValue: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Provides the default object/values needed for the create context.
 */
const TbsStateStructure_Default: TbsStateStructure = {
    exampleValue: "",
    setExampleValue: () => { },
}

/**
 * Gotta have this!
 */
export const TbsContext = createContext(TbsStateStructure_Default);

/**
 *  Just the props definition so that TS doesn't bitch at you.
 */
type TbsContextProviderProps = {
    children: any;
};

/**
 * Component that provides the context and manages its state. Put all of your 
 * page's state, functions and callbacks here.
 * @param children - The the child components that will go between the tags of this. 
 */
export const MwbContextProvider = ({ children }: TbsContextProviderProps) => {
    const [exampleValue, setExampleValue] = useState<string>("");

    const TbsContextState: TbsStateStructure = useMemo(
        () => ({
            exampleValue,
            setExampleValue
        }),
        [
            exampleValue
        ]
    )

    return <TbsContext.Provider value={TbsContextState}>{children}</TbsContext.Provider>;
}