# VS CODE i18n File Manager

This extension **quickly scaffold i18n files** in Angular Components.

## Features

After installing the i18n File Manager extension just right click on an angular component and then click on **Generate i18n** menu item. This command will generate i18n files in selected component with specified locales in vs code settings.

![Generate i18n files](https://fintecardstaticfiles.blob.core.windows.net/vscode-extension-images/usage.gif)

To compile i18n files just open vscode command panel and execute `Compile i18n Files` command. (To open vscode command panel use `F1` or `Ctrl + Shift + P`)

> Warn: This extension only supports angular components at the moment.

## Extension Settings

Customize extension with vscode settings.

* `i18nManager.translationFileSuffix`: string | default: `translation`
* `i18nManager.compilerTargetPath`: string | default: `src/assets/i18n/`
* `i18nManager.locales`: array | default: `['en-GB', 'pl-PL']`

## References

Icon made by [Icon Monk](https://www.flaticon.com/authors/icon-monk) from [www.flaticon.com](www.flaticon.com)

## License

See the [LICENSE]() file for license rights and limitations (MIT).