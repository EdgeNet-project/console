<?php

namespace App\Model;

enum UserRequestStatus: string
{
    case Pending = 'Pending';
    case Approved = 'Approved';
    case Denied = 'Denied';
    case Error = 'Error';
}