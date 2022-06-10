
import { window, InputBox, InputBoxOptions, Uri } from 'vscode';
import { pathExists } from 'fs-extra';
import { join } from 'path';

import createTemplate from './createTemplate';

export default function openInputBox(): void {
    const inputBox = window.createInputBox();
    
    inputBox.placeholder = "请输入你的组件名称, 按Enter键确认";

    const inputVal = inputBox.value;

    inputBox.onDidChangeValue(async (val: string) => {
        if(val.length < 1) {
            return "组件名称不能为空";
        }

        const loc = join(__dirname, val);

        if(await pathExists(loc)) {
            return `该路径${loc}已存在, 请换一个组件名称或者路径`;
        }
    });

    inputBox.onDidHide(() => {
        inputBox.value = "";

        inputBox.enabled = true;

        inputBox.busy = false;
    });

    inputBox.onDidAccept(async () => {
        inputBox.enabled = false;
        inputBox.busy = true;

        const result = createTemplate();

        if(result) {
            inputBox.hide();
            window.showInformationMessage('创建成功，请查看');
        } else {
            window.showInformationMessage('创建失败！');
        }

        inputBox.enabled = true;
        inputBox.busy = false;
    });

    inputBox.show();
}