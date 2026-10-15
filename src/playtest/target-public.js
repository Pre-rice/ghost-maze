import { prepareTarget } from './target.js';

export function createTargetAPI(build) {
    return Object.freeze({ engine: build.engine, prepare: (session, options) => prepareTarget(session, build.engine, options) });
}
