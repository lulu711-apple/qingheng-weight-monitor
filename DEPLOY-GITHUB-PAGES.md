# GitHub Pages 部署说明

## 推荐方式：GitHub 仓库

1. 在 GitHub 创建一个新仓库，例如 `qingheng-weight-monitor`。
2. 将本目录中的全部文件上传到仓库根目录。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 分支选择 `main`，目录选择 `/ (root)`，点击保存。
6. 等待 GitHub 完成部署。

部署地址通常为：

```text
https://<GitHub用户名>.github.io/qingheng-weight-monitor/
```

## 安全要求

- 不要向任何人提供 GitHub 账户密码。
- 如需命令行自动部署，请使用细粒度 Personal Access Token。
- Token 只需授予目标仓库的 `Contents: Read and write` 权限。
- 不要将 Token 写入源码、日志或提交记录。

## 重要限制

网址一旦更换，旧网址中的浏览器本地数据不会自动迁移。正式收集数据前应先确定最终域名，并定期导出 JSON 备份。
