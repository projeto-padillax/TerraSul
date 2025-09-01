"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

type UserFormFieldsProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
};

export function UserFormFields<T extends FieldValues>({ form }: UserFormFieldsProps<T>) {
    return (
        <>
            {/* Status */}
            <FormField
                control={form.control}
                name={"status" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Status:</Label>
                        <FormControl>
                            <RadioGroup
                                value={field.value ? "ativo" : "inativo"}
                                onValueChange={(value) => field.onChange(value === "ativo")}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ativo" id="ativo" className="scale-110" />
                                    <Label htmlFor="ativo" className="text-gray-700 text-base font-medium">
                                        Ativo
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="inativo" id="inativo" className="scale-110" />
                                    <Label htmlFor="inativo" className="text-gray-700 text-base font-medium">
                                        Inativo
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Perfil */}
            <FormField
                control={form.control}
                name={"perfil" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Perfil:</Label>
                        <FormControl>
                            <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ADMIN" id="admin" className="scale-110" />
                                    <Label htmlFor="admin" className="text-gray-700 text-base font-medium">
                                        ADMIN
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SUPERADMIN" id="superadmin" className="scale-110" />
                                    <Label htmlFor="superadmin" className="text-gray-700 text-base font-medium">
                                        SuperAdmin
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Nome */}
            <FormField
                control={form.control}
                name={"name" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Nome:</Label>
                        <FormControl>
                            <Input placeholder="Digite o nome" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Email */}
            <FormField
                control={form.control}
                name={"email" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Email:</Label>
                        <FormControl>
                            <Input type="email" placeholder="Digite o email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Telefone */}
            <FormField
                control={form.control}
                name={"telefone" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Telefone:</Label>
                        <FormControl>
                            <Input
                                type="tel"
                                placeholder="Digite o telefone"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Login */}
            <FormField
                control={form.control}
                name={"login" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Login:</Label>
                        <FormControl>
                            <Input placeholder="Digite o login" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Senha */}
            <FormField
                control={form.control}
                name={"senha" as Path<T>}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28">Senha:</Label>
                        <FormControl>
                            <Input type="password" placeholder="Digite a senha" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
