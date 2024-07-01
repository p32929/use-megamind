"use client"

import { useState, useEffect, useId } from 'react';

// export type GetStatesFunction<T> = (data: T | null, error: any, isLoading: boolean) => void;

export interface MegamindOptions<T> {
    minimumDelayBetweenCalls?: number;
    maxCalls?: number | 'infinite';
    callRighAway?: boolean;
    debug?: boolean,
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export interface MegamindEventCallbacks<T> {
    onLoadingStart?: () => void;
    onLoadingFinished?: () => void;
    onSuccess?: (data: UnwrapPromise<T> | null) => void;
    onError?: (error: any) => void;
    onLoadingChange?: (isLoading: boolean) => void;
}

let counter = 0;
let lastUniqueId = "";

const useMegamind = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    configs?: {
        functionParams?: Parameters<T> | null,
        options?: MegamindOptions<UnwrapPromise<ReturnType<T>>>,
        events?: MegamindEventCallbacks<UnwrapPromise<ReturnType<T>>>,
    },
) => {
    const uniqueId = useId();
    const [data, setDataState] = useState<UnwrapPromise<ReturnType<T>> | null>(null);
    const [error, setErrorState] = useState<any>(null);
    const [isLoading, setLoadingState] = useState(false);

    const {
        functionParams = null,
        options,
        events
    } = configs ?? {}

    const {
        minimumDelayBetweenCalls = 0,
        maxCalls = 'infinite',
        callRighAway = true,
        debug = true,
    } = options ?? {};
    let functionName = fn.name

    const log = (level: 'log' | 'warn' | 'error', message: string, ...optionalParams: any[]) => {
        if (debug) {
            console[level](message, ...optionalParams);
        }
    };

    const fetchData = async (params: Parameters<T> | null) => {
        log('log', `${functionName} :: useMegaMind.tsx :: fetchData :: `);
        if (lastUniqueId === uniqueId) {
            log('warn', `${functionName} :: useMegaMind.tsx :: fetchData :: last call isn't finished yet`);
            return;
        }
        counter++;

        if (maxCalls && maxCalls !== 'infinite') {
            if (counter > maxCalls) {
                log('warn', `${functionName} :: useMegaMind.tsx :: fetchData :: max calls exceeded`);
                return;
            }
        }

        lastUniqueId = uniqueId;
        setLoadingState(true);
        events?.onLoadingStart?.()
        events?.onLoadingChange?.(true);
        log('log', `${functionName} :: useMegaMind.tsx :: fetchData :: started calling`);

        try {
            const result = params ? await fn(...params) : await fn();
            const resolvedData = await result;
            setDataState(resolvedData);
            events?.onSuccess?.(resolvedData);
            log('log', `${functionName} :: useMegaMind.tsx :: fetchData :: call succeeded`);
        } catch (error) {
            setErrorState(error);
            events?.onError?.(error);
            log('error', `${functionName} :: useMegaMind.tsx :: fetchData :: call failed`, error);
        }

        setLoadingState(false);
        events?.onLoadingFinished?.()
        events?.onLoadingChange?.(false);
        log('log', `${functionName} :: useMegaMind.tsx :: fetchData :: call finished`);

        setTimeout(() => {
            lastUniqueId = "";
            log('log', `${functionName} :: useMegaMind.tsx :: setTimeout :: cleared last id`);
        }, minimumDelayBetweenCalls);
    };

    useEffect(() => {
        const requiredArgs = fn.length;

        if (callRighAway) {
            if (!functionParams && requiredArgs === 0) {
                log('log', `${functionName} :: useMegaMind.tsx :: useEffect :: calling right away because no params found`);
                fetchData(null);
            } else if (functionParams) {
                fetchData(functionParams);
            } else {
                log('error', `${functionName} :: useMegaMind.tsx :: useEffect :: unable to call because you need to pass some params`);
            }
        }
    }, []);

    const call = async (...params: Parameters<T>) => {
        log('log', `${functionName} :: useMegaMind.tsx :: call :: `);
        await fetchData(params);
    };

    const clear = () => {
        log('log', `${functionName} :: useMegaMind.tsx :: clear :: `);
        setDataState(null);
        setErrorState(null);
        setLoadingState(false);
    };

    return {
        data,
        call,
        isLoading,
        error,
        clear,
    };
};

export default useMegamind;