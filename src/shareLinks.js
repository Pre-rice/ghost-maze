export function mapURL(code, { replay, editor = false } = {}) {
    const base = new URL('./', location.href);

    base.searchParams.set('map', code);
    if (replay) base.searchParams.set('replay', replay);
    return base.toString();
}

