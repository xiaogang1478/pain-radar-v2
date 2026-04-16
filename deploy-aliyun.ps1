# 痛点雷达 v2.0 阿里云部署脚本
# 在阿里云Windows服务器上执行

# 配置变量
$APP_DIR = "C:\pain-radar-v2"
$DB_NAME = "pain_radar"
$DB_HOST = "pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com"
$DB_USER = "petapp"
$DB_PASS = "PetApp2024!"

Write-Host "=== 痛点雷达 v2.0 部署脚本 ===" -ForegroundColor Cyan

# 1. 创建目录
Write-Host "`n[1/7] 创建目录..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $APP_DIR -Force | Out-Null

# 2. 安装Node.js (如果未安装)
Write-Host "[2/7] 检查Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "Node.js未安装，请先安装Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green

# 3. 安装PM2 (如果未安装)
Write-Host "[3/7] 检查PM2..." -ForegroundColor Yellow
$pm2Version = pm2 --version 2>$null
if (-not $pm2Version) {
    Write-Host "安装PM2..." -ForegroundColor Cyan
    npm install -g pm2
}
Write-Host "PM2版本: $(pm2 --version)" -ForegroundColor Green

# 4. 创建环境变量文件
Write-Host "[4/7] 创建环境变量..." -ForegroundColor Yellow
$envContent = @"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}"
JWT_SECRET="pain-radar-jwt-secret-2026-production"
TOPHUB_API_KEY="d7868442656a1f0ca75c9bd035c02f6f"
NEXT_PUBLIC_APP_URL="http://59.110.123.208:3001"
NEXT_PUBLIC_API_BASE_URL="http://59.110.123.208:3001/api"
"@
Set-Content -Path "$APP_DIR\.env" -Value $envContent -Encoding UTF8
Write-Host "环境变量已创建" -ForegroundColor Green

# 5. 创建package.json
Write-Host "[5/7] 创建package.json..." -ForegroundColor Yellow
$packageJson = @"
{
  "name": "pain-radar-v2",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@prisma/adapter-pg": "^7.7.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@tanstack/react-query": "^5.56.0",
    "@tanstack/react-query-devtools": "^5.56.0",
    "axios": "^1.7.7",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.446.0",
    "next": "^15.1.0",
    "pg": "^8.13.0",
    "prisma": "^7.7.0",
    "@prisma/client": "^7.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.53.0",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.7.0",
    "@types/pg": "^8.11.10",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "dotenv": "^16.4.5",
    "typescript": "^5.6.0"
  }
}
"@
Set-Content -Path "$APP_DIR\package.json" -Value $packageJson -Encoding UTF8

# 6. 安装依赖
Write-Host "[6/7] 安装依赖..." -ForegroundColor Yellow
Set-Location $APP_DIR
npm install 2>&1 | Out-Null
Write-Host "依赖安装完成" -ForegroundColor Green

# 7. 创建数据库
Write-Host "[7/7] 创建数据库..." -ForegroundColor Yellow
$createDbScript = @"
-- 连接RDS并创建数据库
\host $DB_HOST
\port 5432
\dbname postgres
\user $DB_USER
\password $DB_PASS

-- 如果数据库已存在会报错，可以忽略
CREATE DATABASE $DB_NAME;
\q
"@

# 使用psql创建数据库（如果安装了psql）
$psqlPath = "C:\Program Files\PostgreSQL\*\bin\psql.exe" -replace '\\*', (Get-ChildItem "C:\Program Files\PostgreSQL" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Name)
if ($psqlPath -and (Test-Path $psqlPath)) {
    & $psqlPath -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>$null
    Write-Host "数据库创建完成" -ForegroundColor Green
} else {
    Write-Host "psql未安装，请手动创建数据库: CREATE DATABASE pain_radar;" -ForegroundColor Yellow
}

Write-Host "`n=== 部署完成 ===" -ForegroundColor Cyan
Write-Host "下一步操作:" -ForegroundColor White
Write-Host "1. 运行数据库迁移: npx prisma migrate deploy" -ForegroundColor White
Write-Host "2. 生成Prisma Client: npx prisma generate" -ForegroundColor White
Write-Host "3. 启动应用: pm2 start npm --name pain-radar-v2 -- run start" -ForegroundColor White
Write-Host "4. 开放安全组端口3001" -ForegroundColor White
