<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling for the application.
     *
     * @return void
     */
    public function register()
    {
        // Handle PermissionAlreadyExists globally
        $this->reportable(function (PermissionAlreadyExists $e) {
            // You can log the error if needed or handle custom reporting
            Log::error("Permission already exists: " . $e->getMessage());
        });

        $this->renderable(function (PermissionAlreadyExists $e, Request $request) {
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return redirect()->back()->with('error', 'This permission already exists.');
            }

            return response()->view('errors.custom', [], 500);
        });
    }
}
