/**
 * 极简测试辅助（node ESM，无依赖）
 * 用法：
 *   import { test, summary } from './_assert.mjs';
 *   test('描述', () => { assert(条件); assertEq(a, b); });
 *   summary('模块名');
 */
let passCount = 0;
let failCount = 0;
let failures = [];
let currentSuite = '';

export function test(name, fn) {
    try {
        fn();
        passCount++;
    } catch (e) {
        failCount++;
        failures.push(`${currentSuite} > ${name}: ${e.message}`);
    }
}

export function assert(cond, msg = '断言失败') {
    if (!cond) throw new Error(msg);
}

export function assertEq(actual, expected, msg = '') {
    if (actual !== expected) {
        throw new Error(`${msg} 期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`);
    }
}

export function assertDeepEq(actual, expected, msg = '') {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error(`${msg} 期望 ${b}，实际 ${a}`);
    }
}

export function suite(name) {
    currentSuite = name;
}

export function summary() {
    if (failCount > 0) {
        console.error(`\n✗ ${currentSuite}: ${passCount} 通过, ${failCount} 失败`);
        failures.forEach(f => console.error('  ' + f));
        process.exit(1);
    }
    console.log(`✓ ${currentSuite}: ${passCount} 通过`);
    process.exit(0);
}
