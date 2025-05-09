import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add New Record',
        href: '/roles',
    },
];

export default function RoleCreation() {
    const { data, setData, post, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles', {
            onSuccess: () => {
                toast.success('Record Created successfully');
                router.reload();
            },
            onError: () => {
                toast.error('Failed to create Record');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Record" />
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
                    <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-2xl">

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="md:w-1/3 text-sm font-medium flex items-center">
                                    Name<sup className="text-red-500 ml-1">*</sup>
                                </label>
                                <div className="md:w-2/3 mt-2 md:mt-0">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
