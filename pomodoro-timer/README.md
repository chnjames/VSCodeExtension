根据你提供的代码，以下是适合的 `README.md` 文件模板，简要说明了该 VSCode 扩展的功能、使用方法以及如何贡献。

---

# 一点一木 Pomodoro Timer

**一点一木 Pomodoro Timer** 是一个基于番茄工作法的 VSCode 扩展，帮助开发者通过工作/休息循环提高生产力。通过该扩展，你可以轻松设定工作时间和休息时间，并支持暂停与恢复功能，还会记录你完成的 Pomodoro 数量。

## 功能特点

- **工作/休息时间循环**：默认工作时间为 25 分钟，休息时间为 5 分钟。
- **暂停与恢复**：在工作过程中可以随时暂停或恢复 Pomodoro 计时。
- **番茄钟计数**：每次完成一个完整的 Pomodoro 循环，扩展会自动记录完成的次数。
- **状态栏倒计时**：在状态栏中实时显示剩余工作或休息时间。
- **自定义时间**：允许用户自定义工作时间和休息时间。

## 安装

1. 打开 VSCode，进入 **Extensions（扩展）** 面板。
2. 搜索 **Pomodoro Timer** 并点击 **Install**。
3. 安装完成后，扩展会自动激活。

## 使用方法

### 1. 启动 Pomodoro

- 在状态栏中点击 **时钟图标** 开始工作计时。
- 你可以使用默认的工作时间（25 分钟）和休息时间（5 分钟），也可以通过以下步骤自定义时间。

### 2. 自定义工作和休息时间

- 按 `Ctrl+Shift+P` 打开 **Command Palette**，输入 **Set Pomodoro Duration**。
- 根据提示输入新的工作时长和休息时长，完成后新的计时设置将会生效。

### 3. 暂停/恢复 Pomodoro

- 在计时过程中，按 `Ctrl+Shift+P`，输入 **Pause Pomodoro** 来暂停当前倒计时。
- 如果计时已暂停，再次输入 **Pause Pomodoro** 恢复倒计时。

### 4. 查看 Pomodoro 完成次数

- 每当你完成一次完整的 Pomodoro 循环，状态栏将显示你完成的次数。

## 贡献

如果你有任何建议或改进，欢迎通过 [GitHub 仓库](https://github.com/username/my-awesome-extension) 提交问题或贡献代码。

## 许可证

[MIT License](LICENSE)

---

## 开发和发布

1. 克隆本仓库到本地：
   ```bash
   git clone https://github.com/username/my-awesome-extension
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动 VSCode 并开始调试：
   ```bash
   code .
   ```

4. 发布：
   使用 `vsce` 发布扩展：
   ```bash
   vsce publish
   ```

---

此 `README.md` 旨在为用户提供简明扼要的使用指南，并为开发者提供一些贡献和开发的方向。如果你有具体的 GitHub 仓库 URL 或示例截图，可以替换相应的链接和路径。