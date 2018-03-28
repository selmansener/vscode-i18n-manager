import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { dirname } from 'path';

export class FileGenerator {
    private locales: string[];
    private fileSuffix: string;
    private clickedPath: string;

    setConfig(config: { locales: string[], fileSuffix: string }) {
        this.locales = config.locales;
        this.fileSuffix = config.fileSuffix;
    }

    generate(args) {
        if (args === undefined || args === null || args === "") {
            return;
        }

        if (this.locales === undefined || this.locales === null || this.locales.length < 0) {
            vscode.window.showErrorMessage('Couldn\'t find locales settings. Please specify the target locales in vs code settings.');
            return;
        }

        this.clickedPath = args.fsPath;

        if (this.clickedPath === undefined || this.clickedPath === null || this.clickedPath === "") {
            vscode.window.showErrorMessage('Cannot find selected path.');
        }

        const isDir = fs.lstatSync(this.clickedPath).isDirectory();

        if (isDir) {
            const segments = this.clickedPath.split('\\');
            const dirName = segments[segments.length - 1];

            const componentPath = this.clickedPath + '\\' + dirName + '.component.ts';
            const templatePath = this.clickedPath + '\\' + dirName + '.component.html';

            if (!fs.existsSync(componentPath) || !fs.existsSync(templatePath)) {
                vscode.window.showErrorMessage('Selected folder doesn\'t contain an angular component. Please check and try again.');
                return;
            }

            const rootDir = this.clickedPath + '\\i18n\\'

            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir);
            }

            const localeDirs = [];

            this.locales.forEach(locale => {
                const localeDir = rootDir + locale + '\\';
                if (!fs.existsSync(localeDir)) {
                    fs.mkdirSync(localeDir);
                }

                localeDirs.push(localeDir);
            });

            const translationFilePaths = [];

            localeDirs.forEach(localeDir => {
                const localeFilePath = localeDir + dirName + '.' + this.fileSuffix + '.json';

                if (fs.existsSync(localeFilePath)) {
                    vscode.window.showWarningMessage("This component already has a " + localeFilePath + " translation file.");
                }
                else {
                    fs.writeFileSync(localeFilePath, "{}");
                }
            });
        }
    }
}