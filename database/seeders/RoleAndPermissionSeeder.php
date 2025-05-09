<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'Create Role',
            'View Role',
            'Update Role',
            'Delete Role',
            'Add or Edit Permissions',
            'Create Permission',
            'View Permission',
            'Update Permission',
            'Delete Permission',
            'Create User',
            'View User',
            'Update User',
            'Delete User',
            'View Contact Us Listings',
            'Delete Contact Us Listings',
            'Download Reports',

            // User role-specific permissions
            'View Profile Details',
            'Update Profile Details',
            'Delete Profile Photos',
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superUserRole = Role::firstOrCreate(['name' => 'super-user']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Exclude user-specific permissions for the super-user
        $userSpecificPermissions = [
            'View Profile Details',
            'Delete Profile Photos',

        ];

        // Assign permissions to super-user (all except user-specific permissions)
        $superUserPermissions = Permission::whereNotIn('name', $userSpecificPermissions)->get();
        $superUserRole->syncPermissions($superUserPermissions);

        $adminRole->syncPermissions([
            'View Role',
            'View Permission',
            'View User',
        ]);

        $userRole->syncPermissions([
            'View Profile Details',
            'Update Profile Details',
            'Delete Profile Photos',
        ]);
    }
}
