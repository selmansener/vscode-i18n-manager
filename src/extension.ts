'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileGenerator } from './generate-i18n-files';
import { commands } from 'vscode';
import { Compiler } from './compiler';
import * as _ from 'lodash';

export function getConfigurations() {
    let configurations = vscode.workspace.getConfiguration().inspect("i18nManager");
    let mergedConfigs;

    if (configurations.workspaceValue) {
        mergedConfigs = _.mergeWith(configurations.defaultValue, configurations.workspaceValue, (target, source) => {
            return source;
        });
    }
    else {
        mergedConfigs = _.mergeWith(configurations.defaultValue, configurations.globalValue, (target, source) => {
            return source;
        });
    }

    return mergedConfigs;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let fileGenerator = new FileGenerator();
    let i18nCompiler = new Compiler();

    let mergedConfigs = getConfigurations();

    vscode.workspace.onDidChangeConfiguration(() => {
        mergedConfigs = getConfigurations();

        generator.dispose();
        compiler.dispose();

        generator = commands.registerCommand("extension.generateI18n", (args) => {
            fileGenerator.setConfig({
                locales: mergedConfigs.locales,
                fileSuffix: mergedConfigs.translationFileSuffix
            });
            fileGenerator.generate(args);
        });

        compiler = commands.registerCommand("extension.compileI18n", () => {
            i18nCompiler.setConfig({
                targetPath: mergedConfigs.compilerTargetPath,
                locales: mergedConfigs.locales,
                fileSuffix: mergedConfigs.translationFileSuffix
            });
            i18nCompiler.compile();
        });

        context.subscriptions.push(generator, compiler);
    });

    let generator = commands.registerCommand("extension.generateI18n", (args) => {
        fileGenerator.setConfig({
            locales: mergedConfigs.locales,
            fileSuffix: mergedConfigs.translationFileSuffix
        });
        fileGenerator.generate(args);
    });

    let compiler = commands.registerCommand("extension.compileI18n", () => {
        i18nCompiler.setConfig({
            targetPath: mergedConfigs.compilerTargetPath,
            locales: mergedConfigs.locales,
            fileSuffix: mergedConfigs.translationFileSuffix
        });
        i18nCompiler.compile();
    });

    context.subscriptions.push(generator, compiler);
}

// this method is called when your extension is deactivated
export function deactivate() {
}