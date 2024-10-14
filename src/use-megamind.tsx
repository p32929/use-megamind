"use client";

import { useState, useEffect, useId } from 'react';

/**
 * Global configuration object for setting global validation callbacks.
 */
const globalMegamindConfig: {
    globalValidateOnSuccess?: (data: any) => boolean;
    globalValidateOnError?: (error: any) => boolean;
} = {};

/**
 * Set global validation for onSuccess.
 * @param validateFn A function that returns true to proceed with onSuccess, false otherwise.
 */
export const setGlobalValidateOnSuccess = (validateFn: (data: any) => boolean) => {
    globalMegamindConfig.globalValidateOnSuccess = validateFn;
};

/**
 * Set global validation for onError.
 * @param validateFn A function that returns true to proceed with onError, false otherwise.
 */
export const setGlobalValidateOnError = (validateFn: (error: any) => boolean) => {
    globalMegamindConfig.globalValidateOnError = validateFn;
};

/**
 * Options for the useMegamind hook.
 */
export interface MegamindOptions<T> {
    /** Minimum delay between consecutive calls in milliseconds. */
    minimumDelayBetweenCalls?: number;
    /** Maximum number of calls allowed. */
    maxCalls?: number | 'infinite';
    /** Whether to call the function immediately upon mounting. */
    callRightAway?: boolean;
    /** Whether to enable debug logging. */
    debug?: boolean;
    /** Whether to cache the result in a variable. */
    cache?: boolean;
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
    /** Validation before success callback, returns true to proceed. */
    validateOnSuccess?: (data: UnwrapPromise<T> | null) => boolean;
    /** Callback when the function succeeds. */
    onSuccess?: (data: UnwrapPromise<T> | null) => void;
    /** Validation before error callback, returns true to proceed. */
    validateOnError?: (error: any) => boolean;
    /** Callback when the function fails. */
    onError?: (error: any) => void;
    /** Callback when the loading state changes. */
    onLoadingChange?: (isLoading: boolean) => void;
}

const lastUniqueIdMap: Record<string, string> = {};
const cacheMap: Record<string, any> = {};

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
        functionParams?: Parameters<T> | null;
        options?: MegamindOptions<UnwrapPromise<ReturnType<T>>>;
        events?: MegamindEventCallbacks<UnwrapPromise<ReturnType<T>>>;
    },
) => {
    const uniqueId = useId();
    const [data, setDataState] = useState<UnwrapPromise<ReturnType<T>> | null>(null);
    const [latestData, setLatestData] = useState<UnwrapPromise<ReturnType<T>> | null>(null);
    const [error, setErrorState] = useState<any>(null);
    const [isLoading, setLoadingState] = useState(false);
    const [functionCallCounter, setFunctionCallCounter] = useState(0);

    const { functionParams = null, options, events } = configs ?? {};

    const {
        minimumDelayBetweenCalls = 0,
        maxCalls = 'infinite',
        callRightAway = true,
        debug = false,
        cache = false,
    } = options ?? {};

    const functionName = fn.name;

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
     * Generates a unique ID based on the function name and its parameters.
     * @param fnName The name of the function.
     * @param params The parameters passed to the function.
     * @returns A unique ID string.
     */
    const generateUniqueId = (fnName: string, params: Parameters<T> | null): string => {
        const paramsString = params ? JSON.stringify(params) : '';
        return `${fnName}-${paramsString}`;
    };

    /**
     * Fetches data by calling the asynchronous function.
     * @param params Parameters to pass to the asynchronous function.
     * @param append Whether to append the new data to the existing state.
     */
    const fetchData = async (params: Parameters<T> | null, append = false) => {
        const currentUniqueId = generateUniqueId(functionName, params);
        log('log', `${functionName} :: useMegamind :: fetchData :: currentUniqueId: ${currentUniqueId}`);

        if (cache && cacheMap[currentUniqueId]) {
            log('log', `${functionName} :: useMegamind :: fetchData :: returning cached result`);
            setLatestData(cacheMap[currentUniqueId]);
            setDataState(cacheMap[currentUniqueId]);
            events?.onSuccess?.(cacheMap[currentUniqueId]);
            return;
        }

        if (lastUniqueIdMap[currentUniqueId] === uniqueId) {
            log('warn', `${functionName} :: useMegamind :: fetchData :: last call isn't finished yet`);
            return;
        }

        lastUniqueIdMap[currentUniqueId] = uniqueId;
        setLoadingState(true);
        events?.onLoadingStart?.();
        events?.onLoadingChange?.(true);
        log('log', `${functionName} :: useMegamind :: fetchData :: started calling`);

        try {
            if (maxCalls !== 'infinite' && functionCallCounter >= (maxCalls as number)) {
                log('warn', `${functionName} :: useMegamind :: fetchData :: max calls exceeded`);
                setLoadingState(false);
                events?.onLoadingFinished?.();
                events?.onLoadingChange?.(false);
                return;
            }

            setFunctionCallCounter((prev) => prev + 1);
            const result = params ? await fn(...params) : await fn();
            const resolvedData = await result;

            setLatestData(resolvedData);

            if (append) {
                if (typeof resolvedData === 'object' && resolvedData !== null && data !== null) {
                    const arrayKey = Object.keys(resolvedData).find(
                        (key) => Array.isArray(resolvedData[key]) && Array.isArray((data as any)[key]),
                    );

                    if (arrayKey) {
                        setDataState((prev) => ({
                            ...resolvedData,
                            [arrayKey]: [...(prev as any)[arrayKey], ...resolvedData[arrayKey]],
                        }));
                    } else {
                        setDataState(resolvedData);
                    }
                } else {
                    setDataState(resolvedData);
                }
            } else {
                setDataState(resolvedData);
            }

            if (cache) {
                cacheMap[currentUniqueId] = resolvedData;
                log('log', `${functionName} :: useMegamind :: fetchData :: caching result`);
            }

            // Validate using local or global validation functions
            const proceedToSuccess =
                events?.validateOnSuccess?.(resolvedData) ??
                globalMegamindConfig.globalValidateOnSuccess?.(resolvedData) ??
                true;

            if (proceedToSuccess) {
                events?.onSuccess?.(resolvedData);
            }

            log('log', `${functionName} :: useMegamind :: fetchData :: call succeeded :: `, resolvedData);
        } catch (error) {
            setErrorState(error);

            // Validate using local or global validation functions
            const proceedToError =
                events?.validateOnError?.(error) ??
                globalMegamindConfig.globalValidateOnError?.(error) ??
                true;

            if (proceedToError) {
                events?.onError?.(error);
            }

            log('error', `${functionName} :: useMegamind :: fetchData :: call failed`, error);
        }

        setLoadingState(false);
        events?.onLoadingFinished?.();
        events?.onLoadingChange?.(false);
        log('log', `${functionName} :: useMegamind :: fetchData :: call finished`);

        setTimeout(() => {
            delete lastUniqueIdMap[currentUniqueId];
            log('log', `${functionName} :: useMegamind :: setTimeout :: cleared last id`);
        }, minimumDelayBetweenCalls);
    };

    useEffect(() => {
        log('log', `${functionName} :: useMegamind :: useEffect :: callRightAway: ${callRightAway}`);
        const requiredArgs = fn.length;

        if (callRightAway) {
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
        log('log', `${functionName} :: useMegamind :: call(explicit) :: `);
        await fetchData(params);
    };

    /**
     * Manually calls the asynchronous function and appends the result to the current state.
     * @param params Parameters to pass to the asynchronous function.
     */
    const callToAppend = async (...params: Parameters<T>) => {
        log('log', `${functionName} :: useMegamind :: callToAppend :: `);
        await fetchData(params, true);
    };

    /**
     * Clears the state of the hook.
     * Resets data, error, and loading states.
     */
    const clear = () => {
        log('log', `${functionName} :: useMegamind :: clear :: `);
        setDataState(null);
        setLatestData(null);
        setErrorState(null);
        setLoadingState(false);

        const currentUniqueId = generateUniqueId(functionName, functionParams);
        delete lastUniqueIdMap[currentUniqueId];
    };

    /**
     * Resets the state of the hook including cache and call counter.
     * Clears data, error, and loading states.
     * Clears the cached result and resets the call counter.
     */
    const reset = () => {
        log('log', `${functionName} :: useMegamind :: reset :: `);
        clear();
        setFunctionCallCounter(0);
    };

    return {
        data,
        latestData,
        call,
        callToAppend,
        isLoading,
        error,
        clear,
        reset,
    };
};

export default useMegamind;
