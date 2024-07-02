"use client"

import { useState, useEffect, useId } from 'react';

/**
 * Options for the useMegamind hook.
 */
export interface MegamindOptions<T> {
    /** Minimum delay between consecutive calls in milliseconds. */
    minimumDelayBetweenCalls?: number;
    /** Maximum number of calls allowed. */
    maxCalls?: number | 'infinite';
    /** Whether to call the function immediately upon mounting. */
    callRighAway?: boolean;
    /** Whether to enable debug logging. */
    debug?: boolean;
}

/**
 * Unwraps the promise type.
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Event callbacks for the useMegamind hook.
 */
export interface MegamindEventCallbacks<T> {
    /** Callback when loading starts. */
    onLoadingStart?: () => void;
    /** Callback when loading finishes. */
    onLoadingFinished?: () => void;
    /** Callback when the function succeeds. */
    onSuccess?: (data: UnwrapPromise<T> | null) => void;
    /** Callback when the function fails. */
    onError?: (error: any) => void;
    /** Callback when the loading state changes. */
    onLoadingChange?: (isLoading: boolean) => void;
}

let counter = 0;
let lastUniqueId = "";

/**
 * A custom hook for managing asynchronous function calls.
 * 
 * @template T The type of the asynchronous function.
 * @param fn The asynchronous function to be managed by the hook.
 * @param configs Configuration object.
 * @param configs.functionParams Parameters to pass to the asynchronous function.
 * @param configs.options Options for the hook.
 * @param configs.events Event callbacks for the hook.
 * @returns An object containing the state and control functions for the hook.
 */
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
        debug = false,
    } = options ?? {};
    let functionName = fn.name

    /**
     * Logs messages to the console if debug mode is enabled.
     * @param level The log level.
     * @param message The message to log.
     * @param optionalParams Additional parameters to log.
     */
    const log = (level: 'log' | 'warn' | 'error', message: string, ...optionalParams: any[]) => {
        if (debug) {
            console[level](message, ...optionalParams);
        }
    };

    /**
     * Fetches data by calling the asynchronous function.
     * @param params Parameters to pass to the asynchronous function.
     */
    const fetchData = async (params: Parameters<T> | null) => {
        log('log', `${functionName} :: useMegamind :: fetchData :: `);
        if (lastUniqueId === uniqueId) {
            log('warn', `${functionName} :: useMegamind :: fetchData :: last call isn't finished yet`);
            return;
        }
        counter++;

        if (maxCalls && maxCalls !== 'infinite') {
            if (counter > maxCalls) {
                log('warn', `${functionName} :: useMegamind :: fetchData :: max calls exceeded`);
                return;
            }
        }

        lastUniqueId = uniqueId;
        setLoadingState(true);
        events?.onLoadingStart?.();
        events?.onLoadingChange?.(true);
        log('log', `${functionName} :: useMegamind :: fetchData :: started calling`);

        try {
            const result = params ? await fn(...params) : await fn();
            const resolvedData = await result;
            setDataState(resolvedData);
            events?.onSuccess?.(resolvedData);
            log('log', `${functionName} :: useMegamind :: fetchData :: call succeeded`);
        } catch (error) {
            setErrorState(error);
            events?.onError?.(error);
            log('error', `${functionName} :: useMegamind :: fetchData :: call failed`, error);
        }

        setLoadingState(false);
        events?.onLoadingFinished?.();
        events?.onLoadingChange?.(false);
        log('log', `${functionName} :: useMegamind :: fetchData :: call finished`);

        setTimeout(() => {
            lastUniqueId = "";
            log('log', `${functionName} :: useMegamind :: setTimeout :: cleared last id`);
        }, minimumDelayBetweenCalls);
    };

    useEffect(() => {
        const requiredArgs = fn.length;

        if (callRighAway) {
            if (!functionParams && requiredArgs === 0) {
                log('log', `${functionName} :: useMegamind :: useEffect :: calling right away because no params found`);
                fetchData(null);
            } else if (functionParams) {
                fetchData(functionParams);
            } else {
                log('error', `${functionName} :: useMegamind :: useEffect :: unable to call because you need to pass some params`);
            }
        }
    }, []);

    /**
     * Manually calls the asynchronous function with provided parameters.
     * @param params Parameters to pass to the asynchronous function.
     */
    const call = async (...params: Parameters<T>) => {
        log('log', `${functionName} :: useMegamind :: call :: `);
        await fetchData(params);
    };

    /**
     * Clears the state of the hook.
     */
    const clear = () => {
        log('log', `${functionName} :: useMegamind :: clear :: `);
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
