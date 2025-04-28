#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESMでの __filename 相当の値を取得
const __filename = fileURLToPath(import.meta.url);

// デフォルト設定
const DEFAULT_TARGET_EXTENSIONS = [
    'ts', 'tsx', 'js', 'jsx', 'css', 'scss', 'json', 'mjs',
    'test.js', 'test.ts', 'spec.js', 'spec.ts'  // テストコードも収集対象に追加
];
const DEFAULT_IGNORE_EXTENSIONS = [
    'package-lock.json', 'yarn.lock', 'npm-shrinkwrap.json', 'pnpm-lock.yaml'
];
const DEFAULT_IGNORE_DIRS = ['node_modules', '.next', 'out', '.git'];
const OUTPUT_FILE = 'docs/generated/プロジェクトのソースコード一覧.md';

// このスクリプト自身のファイル名
const THIS_SCRIPT = path.relative('.', __filename);

const targetExtensions = process.env.TARGET_EXTENSIONS?.split(' ') || DEFAULT_TARGET_EXTENSIONS;
const ignoreExtensions = process.env.IGNORE_EXTENSIONS?.split(' ') || DEFAULT_IGNORE_EXTENSIONS;
const ignoreDirs = process.env.IGNORE_DIRS?.split(' ') || DEFAULT_IGNORE_DIRS;

// ユーティリティ関数
function shouldIgnoreFile(filePath) {
    if (filePath === THIS_SCRIPT) {
        return true; // 自身を無視する
    }
    return ignoreExtensions.some((ext) => filePath.endsWith(ext));
}

function shouldIgnoreDir(dirPath) {
    return ignoreDirs.some((ignoreDir) => dirPath.includes(`${path.sep}${ignoreDir}${path.sep}`));
}

function collectFiles(dir) {
    let results = [];

    const list = fs.readdirSync(dir, { withFileTypes: true });
    list.forEach((file) => {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            if (!shouldIgnoreDir(`${path.sep}${fullPath}${path.sep}`)) {
                results = results.concat(collectFiles(fullPath));
            }
        } else {
            const ext = path.extname(file.name).slice(1);
            if (targetExtensions.includes(ext) && !shouldIgnoreFile(path.relative('.', fullPath))) {
                results.push(fullPath);
            }
        }
    });

    return results;
}

// 出力ディレクトリが存在しない場合は作成する
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 出力ディレクトリを作成しました: ${outputDir}`);
}

// 出力ファイル初期化
fs.writeFileSync(OUTPUT_FILE, '');

// ファイル収集
const files = collectFiles('.').sort();

// 各ファイルをMarkdownに追記
files.forEach((file) => {
    const ext = path.extname(file).slice(1);
    const content = fs.readFileSync(file, 'utf-8');

    fs.appendFileSync(OUTPUT_FILE, `## \`${file}\`\n`);
    fs.appendFileSync(OUTPUT_FILE, `\`\`\`${ext}\n`);
    fs.appendFileSync(OUTPUT_FILE, `${content}\n`);
    fs.appendFileSync(OUTPUT_FILE, `\`\`\`\n\n`);
});

console.log(`✅ ソースコードを ${OUTPUT_FILE} にまとめました。`);
