# 图片托管 Web 应用

这是一个简单的网络应用程序，用于托管和分享图片。用户可以安全地上传图片，为其设置密码，并与他人分享链接。上传的图片将安全地存储在服务器的文件系统中，并使用 SQLite 数据库管理其信息。

**特别注意此项目屏蔽华为，低配高价虚假宣传出问题别人背锅的手机不要在我面前跳**

## 特点

- 安全上传图片。
- 为上传的图片设置密码。
- 与他人分享图片链接。
- 使用提供的密码查看图片。
- 适用于移动设备和桌面设备的响应式设计。

## 使用的技术

- Node.js
- Express.js
- SQLite
- Multer（用于文件上传）
- Bcrypt（用于密码哈希）
- EJS（用于服务器端 HTML 渲染）
- HTML/CSS（用于前端样式）

## 安装

1. 克隆存储库：

```
git clone https://github.com/wanderer-fly/ImageHosting.git
```


2. 安装依赖项：

```
cd ImageHosting
npm install
```


3. 设置环境变量：

在项目根目录创建一个 `.env` 文件，并添加以下变量：

```
PORT=3000
BASE_URL=http://localhost:3000
```


4. 启动服务器：

```
npm start
```


5. 在您的网络浏览器中打开 `http://localhost:3000`，以访问应用程序。

## 使用方法

1. 上传图片：
   - 点击“上传图片”按钮。
   - 从计算机中选择图片文件。
   - 可选地为图片设置密码。
   - 单击“上传”按钮。

## 作为服务运行

```
sudo vi /etc/systemd/system/picbook.conf
```

写入

```
[Unit]
Description=PicBook Node.js App
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/PicBook/app.js
WorkingDirectory=/opt/PicBook
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=picbook
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

启动服务

```
sudo systemctl daemon-reload
sudo systemctl start picbook.service
sudo systemctl enable picbook.service
# 或者
sudo systemctl enable --now picbook.service
# 查看运行状态
sudo systemctl status picbook.service
```

## 部署

建议配合反向代理使用，如Nginx：

```
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/your-domain-name
```

```
sudo vi /etc/nginx/sites-available/your-domain-name
```

```
server {
    listen 80;
    server_name your_domain_name;

    location / {
        proxy_pass http://localhost:3801;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```
sudo nginx -t
sudo nginx -s reload
```

## FAQ

1. Nginx上传`413 Request Entity Too Large`报错

因为 Nginx 配置中限制了上传文件的大小。

```
sudo vi /etc/nginx/nginx.conf
```

增加`client_max_body_size`指令： 在`http`，`server` 或`location`块中添加以下行来增加允许的最大请求体大小。例如，设置为 100MB：
```
http {
    ...
    client_max_body_size 100M;
    ...
}
```


```
sudo nginx -s reload
```