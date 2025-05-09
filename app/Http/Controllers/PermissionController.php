<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:View Permission', only: ['index']),
            new Middleware('permission:Create Permission', only: ['create', 'store']),
            new Middleware('permission:Update Permission', only: ['edit', 'update']),
            new Middleware('permission:Delete Permission', only: ['destroy', 'bulkDelete']),
        ];
    }
    public function index(Request $request)
    {
        $query = Permission::query();

        if ($search = $request->query('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $permissions = $query->orderBy('id', 'desc')->paginate(10)->appends($request->query());

        return Inertia::render('backend/permissions/index', [
            'permissions' => $permissions,
        ]);
    }
    public function create()
    {
        return Inertia::render('backend/permissions/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:permissions,name'
            ]
        ]);
        Permission::create(['name' => $request->name]);
        return back()->with('success', 'Permission Added Successfully');
    }
    public function edit(Permission $permission)
    {
        return Inertia::render('backend/permissions/edit', compact('permission'));
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:permissions,name,' . $permission->id
            ]
        ]);

        $permission->update(['name' => $request->name]);
        return back()->with('success', 'Permission Updated Successfully');
    }
    public function destroy($permissionId)
    {
        $permission = Permission::find($permissionId);
        $permission->delete();
        return redirect('permissions')->with('success', 'Permission Deleted Successfully');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:permissions,id',
        ]);

        Permission::whereIn('id', $request->ids)->delete();

        return back()->with('success',  'Selected records deleted successfully.');
    }
}
