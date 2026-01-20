"use client";
import { useEffect,useCallback,useState } from "react";
const SCHOOL_KEY = "school_info";
export function useSchoolHelper() {
    const [hydrated,setHydrated ] = useState(false);
    useEffect(()=>{
        setHydrated(true);
    },[]);
    const saveSchool = useCallback((id: string,name: string) => {
        if(typeof window==="undefined") return;
        localStorage.setItem(SCHOOL_KEY,JSON.stringify({id,name}));
    },[]);
    const clearSchool = useCallback(() => {
        if(typeof window==="undefined") return;
        localStorage.removeItem(SCHOOL_KEY);
    },[]);
    const getSchool = useCallback(() => {
        if(typeof window==="undefined") return;
        const rawData = localStorage.getItem(SCHOOL_KEY);
        return rawData ? JSON.parse(rawData) : null;
    },[]);
    return {saveSchool,clearSchool,getSchool,hydrated};
};