## ✨ The Internet Folks ✨

This repo contains the code for the **SDE Assignment [004]** 
The project is to create a functionality of users and communities, where we run a SaaS Platform that enables user to make their communities and add members to it.

###  🥧API Endpoints



### Role

| Name | URL |
|--|--|
| Create | `POST /v1/role` |
| Get All |`GET /v1/role` |

### User

| Name | URL |
|--|--|
| Signup| `POST /v1/auth/signup` |
| Signin |`POST /v1/auth/signin` |
|Get me |`GET /v1/auth/me` |
<br>

### Community
| Name|URL |Role |
|--|--|--|
| Create | `POST /v1/community`| - |
| Get All|`GET /v1/community` |- |
|Get All Members |`GET /v1/community/:id/members` |`Community Admin` / `Community Moderator` / `Community Member` |
|Get My Owned Community | `GET /v1/community/me/owner`| -|
|Get My Joined Community |`GET /v1/community/me/member` |- |

<br>

### Member
| Name|URL |Role |
|--|--|--|
| Add member| `POST /v1/member`| `Community Admin` |
| Remove member|`DELETE /v1/member/:id` |`Community Admin`/`Community Moderator` |