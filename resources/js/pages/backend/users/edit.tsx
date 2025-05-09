import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Record',
        href: '/users',
    },
];

export default function UserUpdation() {

    interface UserRecord {
        id: number;
        name: string;
        email: string;
        role_id: number | string;
        status: 0 | 1;
    }

    const { roles = {}, userRecord } = usePage().props as { roles?: Record<number, string>, userRecord?: UserRecord };

    const { data, setData, put, errors } = useForm({
        name: userRecord?.name ?? '',
        email: userRecord?.email ?? '',
        password: '',
        role_id: userRecord?.role_id ? String(userRecord.role_id) : '',
        status: userRecord?.status ?? '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${userRecord?.id}`, {
            onSuccess: () => {
                toast.success('User updated successfully');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to update user');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Record" />
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
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 text-red-500">
                            {Object.values(errors).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            />
                            <p className="flex text-red-600 text-sm mt-1">Leave blank if you do not want to change the password.</p>
                            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Role</label>

                            <select
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
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
                            {errors.role_id && <div className="text-red-500 text-sm">{errors.role_id}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Status</option>
                                <option value="0">Active</option>
                                <option value="1">Inactive</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-sm">{errors.status}</div>}
                        </div>

                        <Button type="submit">
                            Update
                        </Button>
                    </form>

                </div>
            </div>
        </AppLayout>
    );
}
