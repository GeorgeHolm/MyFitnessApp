import { useEffect, useRef } from 'react';

//Custom hook that mimics useEffect but only runs after the initial load.
//Use case: When you do not want to run a function on the initial load but only after dependancies have changed
const useEffectAfter = (useFunction, dependancies) => {
    const firstLoad = useRef(false);

    useEffect(() => {
        if (firstLoad.current) useFunction();
        else firstLoad.current = true;
    }, dependancies);
}

export default useEffectAfter;