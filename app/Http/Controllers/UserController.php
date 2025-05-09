<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:View User', only: ['index']),
            new Middleware('permission:Create User', only: ['create', 'store']),
            new Middleware('permission:Update User', only: ['edit', 'update']),
            new Middleware('permission:Delete User', only: ['destroy', 'bulkDeleteUsers']),
        ];
    }
    public function index(Request $request)
    {
        $authUser = Auth::user();

        $query = User::with('UserRole')->orderBy('id', 'desc');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        if (!$authUser->hasRole('super-user')) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'super-user');
            });
        }

        $users = $query->paginate(10)->appends(request()->query());
        return Inertia::render('backend/users/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $authUser = Auth::user();

        $rolesQuery = Role::query();

        if (!$authUser->hasRole('super-user')) {
            $rolesQuery->where('name', '!=', 'super-user');
        }

        $roles = $rolesQuery->pluck('name', 'id');

        return Inertia::render('backend/users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:255',
            'role_id' => 'required',
            'status' => 'required|boolean',
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status,
        ]);

        $role = Role::findOrFail($request->role_id);
        $user->syncRoles($role->name);
        return back()->with('success', 'User Added Successfully');
    }

    public function edit(User $user)
    {
        $authUser = Auth::user();
        $rolesQuery = Role::query();

        if (!$authUser->hasRole('super-user')) {
            $rolesQuery->where('name', '!=', 'super-user');
        }


        $roles = $rolesQuery->pluck('name', 'id');
        $user->role_id = $user->UserRole()->first()?->id;
        return Inertia::render('backend/users/edit', [
            'userRecord' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|max:255',
            'role_id' => 'required|exists:roles,id',
            'status' => 'required|boolean',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->status = $request->status;

        if (!empty($request->password)) {
            $user->password = Hash::make($request->password);
        }
        $roleName = Role::findById($request->role_id)->name;
        $user->syncRoles($roleName);

        $user->update();

        return back()->with('success', 'User Updated Successfully');
    }

    public function destroy($userId)
    {
        $user = User::findOrFail($userId);
        $user->delete();
        return back()->with('success', 'User Deleted Successfully');
    }

    public function bulkDeleteUsers(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
        ]);

        User::whereIn('id', $request->ids)->delete();

        return back()->with('success',  'Selected users deleted successfully.');
    }
}
