import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Record',
        href: '/roles',
    },
];

export default function RoleUpdation() {
    interface Role{
        id: number;
        name: string;
    }
    const { role } = usePage().props as { role?: Role };

    const { data, setData, put, errors } = useForm({
        name: role?.name ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role?.id}`,{
            onSuccess: () => {
                toast.success('Record updated successfully');
               router.reload();
            },
            onError: () => {
                toast.error('Failed to update Record');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Record" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex justify-end">
                    <Link
                        href="/roles"
                        className="px-6 py-2 mr-2 mt-2 text-sm font-medium text-center text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-700"
                    >
                        Back
                    </Link>
                </div>

                <div className="flex justify-center items-center px-4">
                    <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-2xl">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="md:w-1/3 text-sm font-medium flex items-center text-gray-700">
                                    Name<sup className="text-red-500 ml-1">*</sup>
                                </label>
                                <div className="md:w-2/3 mt-2 md:mt-0">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300" required
                                    />
                                      <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button type="submit">Update</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
