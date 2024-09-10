import * as vscode from 'vscode';

let workTime = 25 * 60; // 默认工作时间 25 分钟（秒）
let breakTime = 5 * 60; // 默认休息时间 5 分钟（秒）
let isBreakTime = false;
let isPaused = false; // 是否暂停
let completedPomodoros = 0; // 记录完成的番茄钟数量
let statusBar: vscode.StatusBarItem;
let idleTimer: NodeJS.Timeout | undefined;
let focusLostTime: number | undefined; // 记录失去焦点的时间
let pomodoroTimer: NodeJS.Timeout | undefined; // 用于跟踪番茄钟计时器
let intervalTimer: NodeJS.Timeout | undefined; // 用于状态栏倒计时
let remainingWorkTime: number = workTime; // 用于暂停时保存剩余的工作时间

export function activate(context: vscode.ExtensionContext) {
    // 创建状态栏项并设置图标
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.text = '$(clock) 开启番茄钟'; // 使用 VSCode 内置图标 $(clock) 作为番茄钟图标
    statusBar.command = 'extension.startPomodoro'; // 点击时启动番茄钟
    statusBar.show();

    // 自动启动番茄钟
    // vscode.window.showInformationMessage("番茄钟已启动！");
    // startPomodoro();

    // 注册手动启动番茄钟命令
    let startPomodoroCommand = vscode.commands.registerCommand('extension.startPomodoro', () => {
        if (!isPaused) {
            startPomodoro();
        } else {
            vscode.window.showInformationMessage("番茄钟已暂停，无法启动新的计时。");
        }
    });

    // 注册暂停和恢复番茄钟命令
    let pausePomodoroCommand = vscode.commands.registerCommand('extension.pausePomodoro', () => {
        pausePomodoro();
    });

    // 注册自定义时长命令
    let setDurationCommand = vscode.commands.registerCommand('extension.setPomodoroDuration', () => {
        setPomodoroDuration();
    });

	context.subscriptions.push(startPomodoroCommand);
    context.subscriptions.push(pausePomodoroCommand);
    context.subscriptions.push(setDurationCommand);
    context.subscriptions.push(statusBar);

    // 监听窗口状态变化
    vscode.window.onDidChangeWindowState(event => {
        if (event.focused) {
            // 窗口重新获得焦点
            clearIdleDetection(); // 清除闲置检测
            detectIdle(); // 重新检测闲置
        } else {
            // 窗口失去焦点
            focusLostTime = Date.now(); // 记录失去焦点的时间
            startIdleDetection(); // 开始检测失去焦点是否超时
        }
    });
}

function startPomodoro() {
	clearTimers(); // 清除现有的计时器
    vscode.window.showInformationMessage("开始工作！");
    const startTime = Date.now(); // 记录开始时间
    const endTime = startTime + workTime * 1000; // 计算结束时间
    runPomodoroTimer("工作", endTime); // 启动精确的倒计时
	// remainingWorkTime = workTime; // 重置工作时间

    // pomodoroTimer = setTimeout(() => {
	// 	isBreakTime = true;
    //     completedPomodoros += 1; // 番茄钟完成次数增加
    //     vscode.window.showInformationMessage("工作结束！休息时间开始！");
	// 	// 更新状态栏以显示完成次数
    //     statusBar.text = `$(check) 完成番茄钟: ${completedPomodoros}`;
    //     lockEditorForBreak();
    //     startBreak(); // 开始休息
    // }, workTime * 1000);
	// 更新状态栏图标为倒计时
    // statusBar.text = '$(clock) 工作中...';
}

// 暂停或恢复番茄钟
function pausePomodoro() {
    if (!isPaused) {
        // 暂停番茄钟
        if (pomodoroTimer) {
            clearTimeout(pomodoroTimer); // 停止当前计时
        }
        clearInterval(intervalTimer); // 停止倒计时
        isPaused = true;
        vscode.window.showInformationMessage("番茄钟已暂停");
        statusBar.text = `$(clock) 番茄钟已暂停，剩余时间: ${Math.floor(remainingWorkTime / 60)} 分钟`;
    } else {
        // 恢复番茄钟
        vscode.window.showInformationMessage("番茄钟已恢复");
        isPaused = false;
        const startTime = Date.now(); // 记录恢复时的当前时间
        const endTime = startTime + remainingWorkTime * 1000; // 重新计算结束时间
        runPomodoroTimer("工作", endTime); // 启动恢复后的计时器
    }
}

// 启动或恢复番茄钟的计时器
function runPomodoroTimer(mode: string, endTime: number) {
    updateStatusBar(mode, Math.floor((endTime - Date.now()) / 1000)); // 初次更新状态栏
    intervalTimer = setInterval(() => {
        if (isPaused) {
            clearInterval(intervalTimer); // 如果暂停，停止倒计时
            return;
        }
        const remainingTime = Math.floor((endTime - Date.now()) / 1000); // 计算剩余时间
        if (remainingTime > 0) {
            remainingWorkTime = remainingTime; // 更新剩余时间
            updateStatusBar(mode, remainingTime);
        } else {
            clearInterval(intervalTimer); // 停止定时器
            if (mode === "工作") {
                completedPomodoros += 1; // 番茄钟完成次数增加
                vscode.window.showInformationMessage("工作结束！休息时间开始！");
                startBreak(); // 启动休息计时
            } else {
                vscode.window.showInformationMessage("休息结束，开始新的工作！");
                startPomodoro(); // 启动工作计时
            }
        }
    }, 1000); // 每秒更新一次状态栏
}

function startBreak() {
	clearTimers(); // 清除现有的计时器
    vscode.window.showInformationMessage("休息开始！");
    const startTime = Date.now(); // 记录开始时间
    const endTime = startTime + breakTime * 1000; // 计算结束时间
    runPomodoroTimer("休息", endTime); // 启动精确的倒计时

    // pomodoroTimer = setTimeout(() => {
    //     isBreakTime = false;
    //     vscode.window.showInformationMessage("休息结束，开始新的工作！");
    //     unlockEditor();
    //     startPomodoro(); // 重新开始工作
    // }, breakTime * 1000);
	// 更新状态栏图标为休息状态
    // statusBar.text = '$(clock) 休息中...';
}

function updateStatusBar(mode: string, remainingSeconds: number) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    statusBar.text = `$(clock) ${mode}时间: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setPomodoroDuration() {
    clearTimers(); // 清除当前所有计时器
    vscode.window.showInputBox({ prompt: "设置工作时间 (分钟)", value: "25" }).then(inputWork => {
        if (inputWork) {
            workTime = parseInt(inputWork) * 60;
            remainingWorkTime = workTime; // 更新剩余时间
            vscode.window.showInputBox({ prompt: "设置休息时间 (分钟)", value: "5" }).then(inputBreak => {
                if (inputBreak) {
                    breakTime = parseInt(inputBreak) * 60;
                    vscode.window.showInformationMessage(`工作时长设置为 ${inputWork} 分钟，休息时长设置为 ${inputBreak} 分钟。`);

                    // 设置完成后重新启动番茄钟
                    startPomodoro();
                }
            });
        }
    });
}

function lockEditorForBreak() {
    vscode.commands.executeCommand('workbench.action.closeAllEditors'); // 关闭所有编辑器
    vscode.window.showInformationMessage("休息时间已锁定，专注休息！");
}

function unlockEditor() {
    vscode.window.showInformationMessage("休息结束，编辑器已解锁，继续工作！");
}

// 清除现有的计时器
function clearTimers() {
	if (pomodoroTimer) {
        clearTimeout(pomodoroTimer);
        pomodoroTimer = undefined;
    }
    if (intervalTimer) {
        clearInterval(intervalTimer);
        intervalTimer = undefined;
    }
}

// 开始检测是否闲置超过5分钟
function startIdleDetection() {
	idleTimer = setTimeout(() => {
        if (focusLostTime && (Date.now() - focusLostTime > 5 * 60 * 1000)) {
            vscode.window.showWarningMessage("检测到无操作超过5分钟，番茄钟已暂停。");
            // 暂停倒计时逻辑（根据需要实现暂停功能）
        }
    }, 5 * 60 * 1000); // 设置5分钟的检测时间
}

// 清除闲置检测
function clearIdleDetection() {
    if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = undefined;
    }
    focusLostTime = undefined;
}

// 自动检测用户活动
function detectIdle() {
    if (idleTimer) {
		clearTimeout(idleTimer);
	};

    idleTimer = setTimeout(() => {
        vscode.window.showWarningMessage("检测到无操作，番茄钟已暂停。");
        // 在此实现暂停倒计时功能
    }, 5 * 60 * 1000); // 5分钟无操作暂停
}

export function deactivate() {
    clearTimers(); // 确保插件停用时清除所有计时器
    statusBar.dispose(); // 清理状态栏
}
