<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Http\Request;

class IpHelper
{
    public static function getClientIp(Request $request)
    {
        $headers = [
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_X_CLUSTER_CLIENT_IP',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        ];

        foreach ($headers as $header) {
            if ($request->server($header)) {
                $ips = explode(',', $request->server($header));
                return trim($ips[0]);
            }
        }

        return $request->ip();
    }
}
