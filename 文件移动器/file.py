import os
import shutil
import tkinter as tk
from tkinter import filedialog, ttk


class FileDialogDemo:
    def __init__(self, root):
        self.root = root
        self.root.title("文件移动器")
        self.root.geometry("400x300")

        self.origin_file_path = ""
        self.target_file_path = ""
        self.rename_files = tk.BooleanVar()

        ttk.Label(root, text='文件移动器', font='宋体 20 bold').pack()

        ttk.Label(root, text="提取文件夹：", font="宋体 15 bold").place(x=50, y=50)
        ttk.Button(root, text="选择文件夹", command=self.show_origin_file).place(x=180, y=50)

        ttk.Label(root, text="目标文件夹：", font="宋体 15 bold").place(x=50, y=100)
        ttk.Button(root, text="选择文件夹", command=self.show_target_file).place(x=180, y=100)

        ttk.Button(root, text="开始移动", command=self.move_file).place(x=50, y=150)
        ttk.Checkbutton(root, text="重命名文件", variable=self.rename_files).place(x=180, y=150)

        self.successLabel = ttk.Label(root, text="准备移动中")
        self.successLabel.place(x=50, y=180)

    def show_origin_file(self):
        self.origin_file_path = filedialog.askdirectory(title="选择文件夹")
        if self.origin_file_path:
            ttk.Label(self.root, text=self.origin_file_path).place(x=50, y=75)

    def show_target_file(self):
        self.target_file_path = filedialog.askdirectory(title="选择文件夹")
        if self.target_file_path:
            ttk.Label(self.root, text=self.target_file_path).place(x=50, y=125)

    def move_file(self):
        self.successLabel.config(text="移动中。。。")
        if self.origin_file_path and self.target_file_path:
            self._move_files_in_directory(self.origin_file_path)
            self.successLabel.config(text="成功")
        else:
            self.successLabel.config(text="失败")

    def _move_files_in_directory(self, origin_path):
        for filename in os.listdir(origin_path):
            file_path = os.path.join(origin_path, filename)
            if os.path.isfile(file_path):
                # 判断是否需要重命名
                if self.rename_files.get():
                    new_filename = self.rename_file(filename)
                    target_path = os.path.join(self.target_file_path, new_filename)
                else:
                    target_path = os.path.join(self.target_file_path, filename)

                shutil.move(file_path, target_path)
            elif os.path.isdir(file_path):
                self._move_files_in_directory(file_path)

    def rename_file(self, filename):
        # 未实现的重命名逻辑，当前返回原文件名
        # 你可以在这里添加重命名规则，例如增加时间戳、序号等
        return filename


# 创建主窗口并运行应用
if __name__ == "__main__":
    root = tk.Tk()
    app = FileDialogDemo(root)
    root.mainloop()
