import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type Permission = {
    id: number;
    name: string;
};

type Props = {
    role: {
        id: number;
        name: string;
    };
    permissions: Permission[];
    rolePermissions: number[];
};

export default function RolesPermissions({ role, permissions, rolePermissions }: Props) {
    const { data, setData, put, processing } = useForm({
        permission: rolePermissions.map(id =>
            permissions.find(p => p.id === id)?.name
        ).filter(Boolean) as string[],
    });

    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        setCheckAll(data.permission.length === permissions.length);
    }, [data.permission, permissions]);

    const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setCheckAll(checked);
        setData('permission', checked ? permissions.map(p => p.name) : []);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.checked) {
            setData('permission', [...data.permission, value]);
        } else {
            setData('permission', data.permission.filter(p => p !== value));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}/give-permissions`);
    };

    return (
        <AppLayout>
            <Head title="Add Roles To Permissions" />

            <div className="flex items-center justify-between px-4 pt-6">
                <h2 className="font-semibold text-xl text-gray-800">
                    Role: <span className="uppercase text-lg">{role.name}</span>
                </h2>
                <Link
                    href="/roles"
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-3 py-1.5 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    Back
                </Link>
            </div>

            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                        <form onSubmit={handleSubmit} className="max-w-screen-md mx-auto">
                            <h2 className="text-2xl font-semibold text-center mb-6">Permissions</h2>

                            <div className="mb-4 float-end">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="checkAll"
                                        checked={checkAll}
                                        onCheckedChange={(val) => handleCheckAll({ target: { checked: val as boolean } } as any)}
                                    />

                                    <label htmlFor="checkAll" className="text-gray-700 font-semibold ml-2">
                                        Check All
                                    </label>
                                </div>
                            </div>

                            <table className="min-w-full border border-gray-300 divide-y divide-gray-200 mt-4">
                                <tbody>
                                    {permissions.map((perm, index) => (
                                        index % 3 === 0 ? (
                                            <tr key={`row-${index}`}>
                                                {[0, 1, 2].map(offset => {
                                                    const p = permissions[index + offset];
                                                    if (!p) return <td key={offset}></td>;
                                                    return (
                                                        <td
                                                            key={p.id}
                                                            className="border border-gray-300 px-4 py-2"
                                                        >
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id={`perm-${p.id}`}
                                                                    value={p.name}
                                                                    checked={data.permission.includes(p.name)}
                                                                    onCheckedChange={(val) => handleCheckboxChange({ target: { checked: val, value: p.name } } as any)}
                                                                />
                                                                <label className="text-gray-700 ml-2">{p.name}</label>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ) : null
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-center mt-6">
                                <Button
                                    type="submit" className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full'
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
