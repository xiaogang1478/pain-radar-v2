'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
    },
  });
  
  const onSubmit = async (values: RegisterInput) => {
    try {
      await register.mutateAsync(values);
      router.push('/dashboard');
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : '注册失败',
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>
          创建痛点雷达账号，开始发现创业机会
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
            <Label htmlFor="nickname">昵称（选填）</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="你的昵称"
              {...form.register('nickname')}
            />
            {form.formState.errors.nickname && (
              <p className="text-sm text-red-500">{form.formState.errors.nickname.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="至少8位字符"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? '注册中...' : '注册'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            已有账号？{' '}
            <Link href="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
