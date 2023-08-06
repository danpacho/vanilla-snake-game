// @ts-nocheck
// ------------------------ track ------------------------

/**
 * Temporary box containing the running context
 */
const globalExecutionContext = []
/**
 * Track the signal and execute the `trackFunction` the moment when detecting the change.
 * @param trackFunction Run at the point when the tracked signal changes
 */
const track = (trackFunction) => {
    globalExecutionContext.push({
        action: trackFunction,
        deps: new Set(),
    })

    try {
        trackFunction() // initial setting: signal's connected channels
    } finally {
        globalExecutionContext.pop() // remove execution context
    }
}

// ------------------------ signal ------------------------
const initialSignalContainer = {}
const previousSignalContainer = {}

const isDepsShouldUpdate = (currentGlobalDeps, currentConnectedChannelsDeps) =>
    currentGlobalDeps.size !== currentConnectedChannelsDeps.size ||
    [...currentGlobalDeps].every((value) =>
        currentConnectedChannelsDeps.has(value)
    ) === false

/**
 * Update connected channel each time `SignalGetter` is called
 */
const updateConnectedChannels = ({
    signalId,
    connectedChannels,
    // eslint-disable-next-line no-shadow
    globalExecutionContext,
}) => {
    const currentEC = globalExecutionContext.at(-1)
    if (currentEC) {
        currentEC.deps.add(signalId)
        globalExecutionContext.push(currentEC)

        if (connectedChannels.length >= 1) {
            if (
                isDepsShouldUpdate(
                    currentEC.deps,
                    connectedChannels.at(-1)?.deps
                )
            ) {
                connectedChannels.push(currentEC)
            }
        } else {
            connectedChannels.push(currentEC)
        }

        globalExecutionContext.pop()
    }
}

let globalSignalCount = 0
/**
 * @template T
 * Signal that contains trackable data
 * @param initialData {T} initial data type
 * @returns {[() => T, (setter: any) => T, () => void, () => T]}
 */
const signal = (initialData) => {
    const connectedChannels = []

    // eslint-disable-next-line no-plusplus
    const signalId = globalSignalCount++
    const state = {
        [signalId]: initialData,
    }
    initialSignalContainer[signalId] = initialData

    const getState = () => {
        updateConnectedChannels({
            signalId,
            globalExecutionContext,
            connectedChannels,
        })
        return state[signalId]
    }

    const setState = (setter) => {
        if (setter instanceof Function) {
            state[signalId] = setter(state[signalId])
        } else {
            state[signalId] = setter
        }

        connectedChannels.forEach((channel) => {
            channel.action()
        })
    }

    const resetState = () => {
        setState(initialSignalContainer[signalId])
    }

    const getPreviousState = () =>
        previousSignalContainer[signalId] ?? initialSignalContainer[signalId]

    return [getState, setState, resetState, getPreviousState]
}

export { signal, track }
