<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:View Role', only: ['index']),
            new Middleware('permission:Create Role', only: ['create','store']),
            new Middleware('permission:Add or Edit Permissions', only:['addPermissionToRole','givePermissionToRole']),
            new Middleware('permission:Update Role', only: ['edit','update']),
            new Middleware('permission:Delete Role', only: ['destroy','bulkDeleteRoles']),
        ];
    }

    public function index(Request $request)
    {
        $query = Role::query();

        if ($search = $request->query('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $roles =$query->orderBy('id', 'desc')->paginate(10)->appends($request->query());

        return Inertia::render('backend/roles/index', [
            'roles' => $roles,
        ]);
    }
    public function create()
    {
        return Inertia::render('backend/roles/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:roles,name'
            ]
        ]);
        $roleName = strtolower(str_replace(' ', '-', $request->name));
        Role::create(['name' => $roleName]);
        return back();
    }
    public function edit(Role $role)
    {
        return Inertia::render('backend/roles/edit', compact('role'));
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:roles,name,' . $role->id
            ]
        ]);
        $roleName = strtolower(str_replace(' ', '-', $request->name));
        $role->update(['name' => $roleName]);
        return back();
    }
    public function destroy($roleId)
    {
        $role = Role::findOrFail($roleId);
        $role->delete();
        return redirect('roles')->with('success', 'Role Deleted Successfully');
    }

    public function bulkDeleteRoles(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:roles,id',
        ]);

        Role::whereIn('id', $request->ids)->delete();

        return back();
    }

    public function addPermissionToRole($roleId)
    {
        $permissions = Permission::get();
        $role = Role::findOrFail($roleId);
        $rolePermissions = DB::table('role_has_permissions')
        ->where('role_has_permissions.role_id', $role->id)
        ->pluck('role_has_permissions.permission_id')
        ->toArray();

        return Inertia::render('backend/roles/add-permissions', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions
        ]);
    }

    public function givePermissionToRole(Request $request, $roleId)
    {
        // $request->validate([
        //     'permission' => [
        //         'required'
        //     ]
        // ]);
        $role = Role::findOrFail($roleId);
        $role->syncPermissions($request->permission);

        return back()->with('success', 'Permission Assigned to Role Successfully');
    }
}
