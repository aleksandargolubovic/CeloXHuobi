import { useCallback, useEffect, useRef } from 'react';
const DEBUG = false;
/**
 * A combination of useOnBlock and usePoller
 * helper hook to call a function regularly at time intervals when the block changes
 * @param provider hethers/hedera provider
 * @param callback any function
 * @param args function parameters
 */
/**
 * A combination of useOnBlock and usePoller
 * - the hook will invoke a callback regularly on the "block" event.  If a pollTime is provided,
 * it will use that instead.
 * - the hook will invoke the callback when the leadTrigger changes state to true as a leading invokation
 * @param callback (func) :: callback funciton, can have variable args
 * @param options (TOptions)
 * @param args varargs callback function arguments
 */
export const useOnRepetition = (callback, options, ...args) => {
    const polling = (options === null || options === void 0 ? void 0 : options.pollTime) && options.pollTime > 0;
    const leadingCall = useRef(true);
    // created a strigified args to use for deps
    //const argDeps = JSON.stringify(args !== null && args !== void 0 ? args : []);
    // save the input function provided
    const callFunctionWithArgs = useCallback(() => {
        if (callback) {
            if (args && args.length > 0) {
                void callback(...args);
            }
            else {
                void callback();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, args]);
    // Turn on the listener if we have a function & a provider
    const listener = useCallback((_blockNumber) => {
        if (options.provider)
            callFunctionWithArgs();
    }, [callFunctionWithArgs, options.provider]);
    // connect a listener for block changes
    useEffect(() => {
        if (options.provider && !polling) {
            if (DEBUG)
                console.log('register block event', ...args);
            options.provider.addListener('block', listener);
            return () => {
                var _a;
                if (DEBUG)
                    console.log('unregister block event', ...args);
                (_a = options === null || options === void 0 ? void 0 : options.provider) === null || _a === void 0 ? void 0 : _a.removeListener('block', listener);
            };
        }
        else {
            return () => {
                /* do nothing */
            };
        }
    }, [options.provider, polling, listener, args]);
    // Set up the interval if its using polling
    useEffect(() => {
        const tick = () => {
            if (DEBUG)
                console.log('polling: call function');
            callFunctionWithArgs();
        };
        if (polling && (options === null || options === void 0 ? void 0 : options.pollTime)) {
            const safePollTime = (options === null || options === void 0 ? void 0 : options.pollTime) > 10000 ? options.pollTime : 10000;
            const id = setInterval(tick, safePollTime);
            return () => {
                clearInterval(id);
            };
        }
    }, [options.pollTime, polling, callFunctionWithArgs]);
    // call if triggered by extra watch, however only on inital call
    useEffect(() => {
        if (options.leadingTrigger && callFunctionWithArgs != null && (leadingCall === null || leadingCall === void 0 ? void 0 : leadingCall.current) === true) {
            leadingCall.current = false;
            callFunctionWithArgs();
        }
    }, [options.leadingTrigger, callFunctionWithArgs]);
};
