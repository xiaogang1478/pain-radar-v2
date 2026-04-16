'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: LoginInput) => {
    try {
      await login.mutateAsync(values);
      router.push('/dashboard');
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : '登录失败',
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>
          登录到痛点雷达平台
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? '登录中...' : '登录'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            还没有账号？{' '}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
