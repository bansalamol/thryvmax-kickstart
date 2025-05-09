<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class MarkInactiveUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:mark-inactive-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark users inactive if no login in the last 2 months';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $twoMonthsAgo = Carbon::now()->subMonths(2);

        $count = User::where('last_login_at', '<', $twoMonthsAgo)
            ->update(['status' => 1]);

        $this->info("$count user(s) marked as inactive.");
    }
}
