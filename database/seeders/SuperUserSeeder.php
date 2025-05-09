<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superUserRole = Role::firstOrCreate(['name' => 'super-user']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);


        $superUser = User::factory()->create([
            'name' => 'Super user',
            'email' => 'superuser@mail.com',
            'password' => Hash::make('12345678')
        ]);
        $superUser->assignRole($superUserRole);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => Hash::make('12345678')
        ]);
        $admin->assignRole($adminRole);

        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@mail.com',
            'password' => Hash::make('12345678')
        ]);
        $user->assignRole($userRole);
    }
}
