import { startSession, dispatchSession, reconstruct, publicSession, encodeSession, decodeSession, exportSession } from './session.js';
import { formatBoard } from './observation.js';

export function createPlaytestAPI(build) {
    const revision = build.engine;
    return Object.freeze({ version: build.version, engine: revision,
        start: options => startSession(options, revision),
        command: (session, command) => dispatchSession(session, command, revision),
        observe: session => { const runtime = reconstruct(session, revision); return { board: runtime.board, info: publicSession(session, runtime) }; },
        save: session => encodeSession(session, revision), restore: token => decodeSession(token, revision),
        history: (session, { from = 1, limit = 20 } = {}) => {
            if (!Number.isInteger(from) || from < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new RangeError('历史范围无效');
            return reconstruct(session, revision, { trace: true }).records.slice(from - 1, from - 1 + limit);
        },
        export: session => exportSession(session, revision), formatBoard });
}
