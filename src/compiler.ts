import * as fs from 'fs';
import * as vscode from 'vscode';
import { StatusBarAlignment } from 'vscode';
export class Compiler {
    private sourcePath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
    private targetPath: string;
    private locales: string[];

    private translationRegex = /\.translation\.json/;
    private contextRegex = /\.context\.json/;
    private pathsByLocale = {};
    private compileContext = false;
    private translations = {};

    constructor() {
    }

    compile() {
        vscode.window.showInformationMessage("Compiling translations...");

        if (!fs.existsSync(this.targetPath)) {
            fs.mkdirSync(this.targetPath);
        }
        
        for (let i in this.locales) {
            let locale = this.locales[i];
            this.translations[locale] = {};
            this.readDirectory(this.sourcePath);

            const pathListByLocale = this.pathsByLocale[locale];

            for (let j in pathListByLocale) {
                let path = pathListByLocale[j];
                let object = this.readTranslation(path);
                let pathPieces = path.replace('.json', '').replace(/-/g, '_').toUpperCase().split('/');
                let objectName = pathPieces[pathPieces.length - 1].split('.')[0];
                this.translations[locale][objectName] = object;
            }

            this.writeTranslation(this.translations[locale], this.targetPath + locale + '.js');
            this.writeTranslation(this.translations[locale], this.targetPath + locale + '.json');
        }

        vscode.window.showInformationMessage("i18n Files compiled successfully...");
    }

    setConfig(config: { targetPath: string, locales: string[], fileSuffix: string }) {
        this.targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\" + config.targetPath;
        this.locales = config.locales
        this.translationRegex = new RegExp('.' + config.fileSuffix + ".json");
    }

    private readDirectory(path, fileList?) {
        fileList = fileList ? fileList : [];
        let files = fs.readdirSync(path);

        files.forEach((file) => {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                fileList = this.readDirectory(path + '/' + file, fileList);
            } else {
                if (this.translationRegex.test(file) && !this.compileContext) {
                    fileList.push(path + '/' + file);

                    this.locales.forEach(locale => {
                        const regex = new RegExp(locale)
                        if (regex.test(path)) {
                            this.pathsByLocale[locale] = this.pathsByLocale[locale] ? this.pathsByLocale[locale] : [];
                            this.pathsByLocale[locale].push(path + '/' + file);
                        }
                    });
                }
                else if (this.contextRegex.test(file) && this.compileContext) {
                    fileList.push(path + '/' + file);

                    this.locales.forEach(locale => {
                        const regex = new RegExp(locale)
                        if (regex.test(path)) {
                            this.pathsByLocale[locale] = this.pathsByLocale[locale] ? this.pathsByLocale[locale] : [];
                            this.pathsByLocale[locale].push(path + '/' + file);
                        }
                    });
                }
            }
        });
        return fileList;
    }

    private readTranslation(path) {
        let data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    }

    private writeTranslation(object, path) {
        fs.writeFileSync(path, JSON.stringify(object, null, 4));
    }
}