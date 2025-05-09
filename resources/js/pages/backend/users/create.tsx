import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add New Record',
        href: '/users',
    },
];

export default function UserCreation() {
    const { roles = {} } = usePage().props as { roles?: Record<number, string> };

    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
        status: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                toast.success('User created successfully');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to create user');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Record" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex justify-end">
                    <Link
                        href="/users"
                        className="px-4 py-2 mt-2 text-sm font-medium text-center text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 me-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-700"
                    >
                        Back
                    </Link>
                </div>
                <div className="flex justify-center items-center min-h-[60vh] px-2">
                    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)} required
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)} required
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)} required
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Role</label>

                            <select
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)} required
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Role</option>
                                {Object.entries(roles).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name
                                            .split('-')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.role_id} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)} required
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Status</option>
                                <option value="0">Active</option>
                                <option value="1">Inactive</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>

                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
