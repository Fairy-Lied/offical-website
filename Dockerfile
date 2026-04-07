# Dockerfile for Fairy Lied
FROM node:20-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8.15.4

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", ".output/server/index.mjs"]
