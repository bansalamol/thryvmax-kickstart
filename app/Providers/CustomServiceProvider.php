<?php

namespace App\Providers;

use App\Http\Middleware\CustomPostSizeValidation;
use App\Models\Interest;
use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Verified;
use App\Listeners\SendWelcomeEmail;
use App\Models\Membership;
use App\Models\UserMembership;
use Illuminate\Support\Facades\Event;
use App\Services\SignedUrlServices;
use Inertia\Inertia;

class CustomServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap services.
     */
    public function boot(Router $router)
    {
        Inertia::share('can', function () {
            $user = Auth::user();

            return $user ? [
                'createRole' => $user->can('Create Role'),
                'viewRole' => $user->can('View Role'),
                'updateRole' => $user->can('Update Role'),
                'deleteRole' => $user->can('Delete Role'),

                'addOrEditPermissions' => $user->can('Add or Edit Permissions'),
                'createPermission' => $user->can('Create Permission'),
                'viewPermission' => $user->can('View Permission'),
                'updatePermission' => $user->can('Update Permission'),
                'deletePermission' => $user->can('Delete Permission'),

                'createUser' => $user->can('Create User'),
                'viewUser' => $user->can('View User'),
                'updateUser' => $user->can('Update User'),
                'deleteUser' => $user->can('Delete User'),

                'viewContactUsListings' => $user->can('View Contact Us Listings'),
                'deleteContactUsListings' => $user->can('Delete Contact Us Listings'),

                'downloadReports' => $user->can('Download Reports'),

                'viewProfileDetails' => $user->can('View Profile Details'),
                'updateProfileDetails' => $user->can('Update Profile Details'),
                'deleteProfilePhotos' => $user->can('Delete Profile Photos'),
            ] : [
                'createRole' => false,
                'viewRole' => false,
                'updateRole' => false,
                'deleteRole' => false,

                'addOrEditPermissions' => false,
                'createPermission' => false,
                'viewPermission' => false,
                'updatePermission' => false,
                'deletePermission' => false,

                'createUser' => false,
                'viewUser' => false,
                'updateUser' => false,
                'deleteUser' => false,

                'viewContactUsListings' => false,
                'deleteContactUsListings' => false,

                'downloadReports' => false,

                'viewProfileDetails' => false,
                'updateProfileDetails' => false,
                'deleteProfilePhotos' => false,
            ];
        });

        // Register the middleware aliases
        $router->aliasMiddleware('role', \Spatie\Permission\Middleware\RoleMiddleware::class);
        $router->aliasMiddleware('permission', \Spatie\Permission\Middleware\PermissionMiddleware::class);
        $router->aliasMiddleware('role_or_permission', \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class);


        View::composer('*', function ($view) {
            $user = Auth::user();

            if ($user) {
                $view->with('user', $user);
            } else {
                $view->with('user', null);
            }
        });
    }
}
