'use client'

import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface UsernameFormProps {
  user: Pick<User, 'id' | 'username'>
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name,
      }

      const { data } = await axios.patch('/api/username', payload)

      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Username already taken',
            description: 'Please choose a different username.',
            variant: 'destructive',
          })
        }
      }

      toast({
        title: 'There was an error',
        description: 'Could not change the username.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your username has been updated',
      })

      router.refresh()
    },
  })

  return (
    <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute grid place-items-center top-0 left-0 w-8 h-10">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label
              className="sr-only"
              htmlFor="name"
            >
              Name
            </Label>
            <Input
              className="w-[400px] pl-6"
              id="name"
              size={32}
              {...register('name')}
            />

            {errors?.name && (
              <p className="p-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
          >
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UsernameForm