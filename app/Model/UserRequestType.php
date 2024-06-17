<?php

namespace App\Model;

enum UserRequestType: string
{
    case CreateTeam = 'CreateTeam';
    case JoinTeam = 'JoinTeam';
    case CreateWorkspace = 'CreateWorkspace';
    case JoinWorkspace = 'JoinWorkspace';
}